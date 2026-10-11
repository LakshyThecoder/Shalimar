import fs from "fs";
import path from "path";
import { DATA_DIR, ensureDirs } from "./store.js";
import { SITE_DEFAULT } from "../src/data/siteDefault.js";
import { deepMerge, writeJsonAtomic } from "./atomicWrite.js";
import { assertProdStorage, readJsonBlob, useBlob, writeJsonBlob } from "./blobStore.js";

function withFullWeekHours(site) {
  const out = site;
  for (const key of ["restaurant", "takeaway"]) {
    const defHours = SITE_DEFAULT.locations?.[key]?.hours;
    const cur = out?.locations?.[key]?.hours;
    const raw = JSON.stringify(cur || []);
    const stale =
      !Array.isArray(cur) ||
      cur.length < 7 ||
      raw.includes("14:20") ||
      raw.includes("22:10") ||
      raw.includes("Every day") ||
      raw.includes("Tutti i giorni") ||
      raw.includes("Tuesday to Sunday") ||
      raw.includes("Martedì–domenica");
    if (stale && out?.locations?.[key] && defHours?.length) {
      out.locations[key].hours = structuredClone(defHours);
    }
  }
  return out;
}

export const SITE_PATH = path.join(DATA_DIR, "site-store.json");
const SITE_BLOB = "shalimar/site-store.json";

function seedLocal(force = false) {
  ensureDirs();
  if (!force && fs.existsSync(SITE_PATH)) {
    const raw = JSON.parse(fs.readFileSync(SITE_PATH, "utf8"));
    return deepMerge(structuredClone(SITE_DEFAULT), raw);
  }
  const seeded = deepMerge(structuredClone(SITE_DEFAULT), {
    updatedAt: new Date().toISOString(),
  });
  writeJsonAtomic(SITE_PATH, seeded);
  return seeded;
}

export async function readSite() {
  assertProdStorage();
  if (useBlob()) {
    const remote = await readJsonBlob(SITE_BLOB);
    if (remote) return withFullWeekHours(deepMerge(structuredClone(SITE_DEFAULT), remote));
    const seeded = deepMerge(structuredClone(SITE_DEFAULT), {
      updatedAt: new Date().toISOString(),
    });
    await writeJsonBlob(SITE_BLOB, seeded);
    return seeded;
  }
  return withFullWeekHours(seedLocal(false));
}

export async function writeSite(data) {
  assertProdStorage();
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid site payload");
  }
  const merged = deepMerge(structuredClone(SITE_DEFAULT), data);
  merged.updatedAt = new Date().toISOString();
  merged.version = SITE_DEFAULT.version || 1;
  if (useBlob()) {
    await writeJsonBlob(SITE_BLOB, merged);
    return merged;
  }
  ensureDirs();
  writeJsonAtomic(SITE_PATH, merged);
  return merged;
}

export async function seedSite(force = false) {
  if (useBlob()) {
    if (!force) {
      const existing = await readJsonBlob(SITE_BLOB);
      if (existing) return deepMerge(structuredClone(SITE_DEFAULT), existing);
    }
    return writeSite(structuredClone(SITE_DEFAULT));
  }
  if (!force && fs.existsSync(SITE_PATH)) {
    console.log(`Site store already exists → ${SITE_PATH}`);
    return readSite();
  }
  return writeSite(structuredClone(SITE_DEFAULT));
}
