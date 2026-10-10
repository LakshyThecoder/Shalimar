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

// Ensure site content exists on boot
seedSite(false);

const PORT = Number(process.env.PORT || 8787);
const IS_PROD = process.env.NODE_ENV === "production";
const ADMIN_USER = process.env.ADMIN_USER || "Shalimar";
const ADMIN_PASS = process.env.ADMIN_PASS || "Shalimar123@";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "shalimar-free-local-menu-secret-v1";
const COOKIE_NAME = "shalimar_admin";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

if (IS_PROD && SESSION_SECRET === "shalimar-free-local-menu-secret-v1") {
  console.warn("⚠ Set SESSION_SECRET in production (.env)");
}
if (IS_PROD && !process.env.ADMIN_PASS) {
  console.warn("⚠ Set ADMIN_USER / ADMIN_PASS in production (.env)");
}

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

ensureDirs();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());
// Free local image storage — files live in /public/uploads
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", fallthrough: false }));
app.use(express.static(path.join(ROOT, "public")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safe = slugify(path.basename(file.originalname, ext)) || "photo";
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
    if (!ok) {
      cb(new Error("Use JPG, PNG or WebP photos"));
      return;
    }
    cb(null, true);
  },
});

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
  const branch = store.branches?.[branchId];
  if (!branch) return null;
  return branch;
}

/** Public: full menu for a branch */
app.get("/api/menu/:branch", (req, res) => {
  try {
    const store = readStore();
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, free: true });
});

/** Serve sitemaps with correct content-type (never fall through to SPA HTML) */
function sendPublicXml(res, filename) {
  const file = path.join(ROOT, "public", filename);
  if (!fs.existsSync(file)) {
    res.status(404).type("text").send("Not found");
    return;
  }
  res.type("application/xml").send(fs.readFileSync(file, "utf8"));
}
app.get("/sitemap.xml", (_req, res) => sendPublicXml(res, "sitemap.xml"));
app.get("/sitemap-pages.xml", (_req, res) => sendPublicXml(res, "sitemap-pages.xml"));
app.get("/sitemap-images.xml", (_req, res) => sendPublicXml(res, "sitemap-images.xml"));
app.get("/robots.txt", (_req, res) => {
  const file = path.join(ROOT, "public", "robots.txt");
  res.type("text/plain").send(fs.readFileSync(file, "utf8"));
});

/** Public website content */
app.get("/api/site", (_req, res) => {
  try {
    res.json(readSite());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/site", requireAuth, (_req, res) => {
  try {
    res.json(readSite());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/site", requireAuth, (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ error: "Site JSON required" });
      return;
    }
    const saved = writeSite(req.body);
    res.json({ ok: true, site: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/site/reset", requireAuth, (_req, res) => {
  try {
    const saved = seedSite(true);
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

app.get("/api/admin/menu/:branch", requireAuth, (req, res) => {
  try {
    const store = readStore();
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

/** Replace entire branch sections */
app.put("/api/admin/menu/:branch", requireAuth, (req, res) => {
  try {
    const store = readStore();
    const branch = getBranch(store, req.params.branch);
    if (!branch) {
      res.status(404).json({ error: "Unknown branch" });
      return;
    }
    if (!Array.isArray(req.body?.sections)) {
      res.status(400).json({ error: "sections array required" });
      return;
    }
    // Light sanitize so bad payloads cannot crash the public menu
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
    writeStore(store);
    res.json({ ok: true, updatedAt: store.updatedAt, sections: branch.sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/upload", requireAuth, (req, res) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url });
  });
});

app.delete("/api/admin/upload", requireAuth, (req, res) => {
  const url = req.body?.url;
  if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
    res.status(400).json({ error: "Invalid upload url" });
    return;
  }
  const file = path.join(UPLOAD_DIR, path.basename(url));
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

// Production: serve Vite build
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

// Ensure menu store exists
try {
  readStore();
} catch {
  console.warn("Menu store missing — run: npm run seed:menu");
}

app.listen(PORT, () => {
  console.log(`Shalimar API (free local storage) → http://localhost:${PORT}`);
  console.log(`  Menu/site JSON → /data`);
  console.log(`  Photos         → /public/uploads`);
  console.log(`  Admin          → /admin  (${ADMIN_USER})`);
});
