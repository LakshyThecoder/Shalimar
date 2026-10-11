import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import {
  ROOT,
  UPLOAD_DIR,
  ensureDirs,
  readStore,
  writeStore,
  slugify,
} from "./store.js";
import { readSite, writeSite, seedSite } from "./siteStore.js";
import { deleteBlobByUrl, uploadBinaryBlob, useBlob } from "./blobStore.js";

const IS_PROD = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const ADMIN_USER = process.env.ADMIN_USER || "Shalimar";
const ADMIN_PASS = process.env.ADMIN_PASS || "Shalimar123@";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "shalimar-free-local-menu-secret-v1";
const COOKIE_NAME = "shalimar_admin";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14;

const loginAttempts = new Map();
function loginAllowed(ip) {
  const now = Date.now();
  const row = loginAttempts.get(ip) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > row.reset) {
    row.count = 0;
    row.reset = now + 15 * 60 * 1000;
  }
  row.count += 1;
  loginAttempts.set(ip, row);
  return row.count <= 20;
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data?.exp || data.exp < Date.now()) return null;
    if (data.u !== ADMIN_USER) return null;
    return data;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers["x-admin-token"];
  const session = verifyToken(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.admin = session;
  next();
}

function getBranch(store, branchId) {
  return store.branches?.[branchId] || null;
}

export function createApp({ serveStatic = true } = {}) {
  if (!useBlob()) ensureDirs();

  const app = express();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "8mb" }));
  app.use(cookieParser());

  if (!useBlob()) {
    app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", fallthrough: false }));
    if (serveStatic) {
      app.use(express.static(path.join(ROOT, "public")));
    }
  }

  /** Hard cap — client compresses to ~380 KB; reject anything over 500 KB. */
  const MAX_UPLOAD_BYTES = 500 * 1024;

  const upload = multer({
    storage: useBlob() ? multer.memoryStorage() : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
        const safe = slugify(path.basename(file.originalname, ext)) || "photo";
        cb(null, `${Date.now()}-${safe}${ext}`);
      },
    }),
    limits: { fileSize: MAX_UPLOAD_BYTES },
    fileFilter: (_req, file, cb) => {
      const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
      if (!ok) {
        cb(new Error("Use JPG, PNG or WebP photos"));
        return;
      }
      cb(null, true);
    },
  });

  app.get("/api/health", (_req, res) => {
    const blob = useBlob();
    const onVercel = Boolean(process.env.VERCEL);
    res.json({
      ok: true,
      storage: blob ? "vercel-blob" : "local-json",
      admin: true,
      needsBlob: onVercel && !blob,
    });
  });

  app.get("/api/site", async (_req, res) => {
    try {
      res.json(await readSite());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/menu/:branch", async (req, res) => {
    try {
      const store = await readStore();
      const branch = getBranch(store, req.params.branch);
      if (!branch) {
        res.status(404).json({ error: "Unknown branch" });
        return;
      }
      res.json({
        updatedAt: store.updatedAt,
        allergens: store.allergens,
        sections: branch.sections,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/site", requireAuth, async (_req, res) => {
    try {
      res.json(await readSite());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/site", requireAuth, async (req, res) => {
    try {
      if (!req.body || typeof req.body !== "object") {
        res.status(400).json({ error: "Site JSON required" });
        return;
      }
      const saved = await writeSite(req.body);
      res.json({ ok: true, site: saved });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/site/reset", requireAuth, async (_req, res) => {
    try {
      const saved = await seedSite(true);
      res.json({ ok: true, site: saved });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    if (!loginAllowed(ip)) {
      res.status(429).json({ error: "Too many login attempts — try again later" });
      return;
    }
    const { username, password } = req.body || {};
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      res.status(401).json({ error: "Wrong username or password" });
      return;
    }
    const token = signToken({ u: ADMIN_USER, exp: Date.now() + TOKEN_TTL_MS });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PROD,
      maxAge: TOKEN_TTL_MS,
      path: "/",
    });
    res.json({ ok: true, username: ADMIN_USER, token });
  });

  app.post("/api/admin/logout", (_req, res) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ ok: true });
  });

  app.get("/api/admin/me", requireAuth, (req, res) => {
    res.json({ ok: true, username: req.admin.u });
  });

  app.get("/api/admin/menu/:branch", requireAuth, async (req, res) => {
    try {
      const store = await readStore();
      const branch = getBranch(store, req.params.branch);
      if (!branch) {
        res.status(404).json({ error: "Unknown branch" });
        return;
      }
      res.json({
        updatedAt: store.updatedAt,
        sections: branch.sections,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/menu/:branch", requireAuth, async (req, res) => {
    try {
      const store = await readStore();
      const branch = getBranch(store, req.params.branch);
      if (!branch) {
        res.status(404).json({ error: "Unknown branch" });
        return;
      }
      if (!Array.isArray(req.body?.sections)) {
        res.status(400).json({ error: "sections array required" });
        return;
      }
      branch.sections = req.body.sections.map((section, si) => ({
        id: String(section?.id || `cat-${si}-${Date.now()}`),
        label: {
          it: section?.label?.it || section?.label?.en || "Categoria",
          en: section?.label?.en || section?.label?.it || "Category",
        },
        noteKey: section?.noteKey || null,
        note:
          section?.note && typeof section.note === "object"
            ? { it: section.note.it || "", en: section.note.en || "" }
            : null,
        featured: Boolean(section?.featured),
        isSetMenu: Boolean(section?.isSetMenu),
        image: typeof section?.image === "string" ? section.image : "",
        items: Array.isArray(section?.items)
          ? section.items.map((item, ii) => ({
              id: String(item?.id || `item-${si}-${ii}`),
              name: String(item?.name || "Dish"),
              price: Number(item?.price) || 0,
              spicy: Boolean(item?.spicy),
              available: item?.available !== false,
              image: typeof item?.image === "string" ? item.image : "",
              desc: {
                it: item?.desc?.it || "",
                en: item?.desc?.en || "",
              },
              includes: Array.isArray(item?.includes) ? item.includes.map(String) : [],
            }))
          : [],
      }));
      await writeStore(store);
      res.json({ ok: true, updatedAt: store.updatedAt, sections: branch.sections });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/upload", requireAuth, (req, res) => {
    upload.single("photo")(req, res, async (err) => {
      if (err) {
        const tooBig = err.code === "LIMIT_FILE_SIZE";
        res.status(400).json({
          error: tooBig
            ? `Photo too large — max ${Math.round(MAX_UPLOAD_BYTES / 1024)} KB after compression`
            : err.message,
        });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const size = req.file.size || req.file.buffer?.length || 0;
      if (size > MAX_UPLOAD_BYTES) {
        if (!useBlob() && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch {
            /* ignore */
          }
        }
        res.status(400).json({
          error: `Photo too large — max ${Math.round(MAX_UPLOAD_BYTES / 1024)} KB after compression`,
        });
        return;
      }
      try {
        if (useBlob()) {
          const ext = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
          const safe = slugify(path.basename(req.file.originalname || "photo", ext)) || "photo";
          const pathname = `shalimar/uploads/${Date.now()}-${safe}${ext}`;
          const url = await uploadBinaryBlob(pathname, req.file.buffer, req.file.mimetype);
          res.json({ ok: true, url, bytes: size });
          return;
        }
        res.json({ ok: true, url: `/uploads/${req.file.filename}`, bytes: size });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  });

  app.delete("/api/admin/upload", requireAuth, async (req, res) => {
    const url = req.body?.url;
    if (!url || typeof url !== "string") {
      res.status(400).json({ error: "Invalid upload url" });
      return;
    }
    try {
      if (useBlob()) {
        await deleteBlobByUrl(url);
        res.json({ ok: true });
        return;
      }
      if (!url.startsWith("/uploads/")) {
        res.status(400).json({ error: "Invalid upload url" });
        return;
      }
      const file = path.join(UPLOAD_DIR, path.basename(url));
      if (fs.existsSync(file)) fs.unlinkSync(file);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  if (serveStatic && !useBlob()) {
    app.get("/sitemap.xml", (_req, res) => {
      const file = path.join(ROOT, "public", "sitemap.xml");
      if (!fs.existsSync(file)) {
        res.status(404).type("text").send("Not found");
        return;
      }
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(fs.readFileSync(file));
    });
    app.get("/robots.txt", (_req, res) => {
      const file = path.join(ROOT, "public", "robots.txt");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.send(fs.readFileSync(file));
    });

    const dist = path.join(ROOT, "dist");
    if (fs.existsSync(dist)) {
      app.use(express.static(dist));
      app.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
        res.sendFile(path.join(dist, "index.html"), (err) => {
          if (err) next();
        });
      });
    }
  }

  return app;
}
