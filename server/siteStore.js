import fs from "fs";
import path from "path";
import { DATA_DIR, ensureDirs } from "./store.js";
import { SITE_DEFAULT } from "../src/data/siteDefault.js";
import { deepMerge, writeJsonAtomic } from "./atomicWrite.js";

export const SITE_PATH = path.join(DATA_DIR, "site-store.json");

export function readSite() {
  ensureDirs();
  if (!fs.existsSync(SITE_PATH)) {
    const seeded = deepMerge(structuredClone(SITE_DEFAULT), {
      updatedAt: new Date().toISOString(),
    });
    writeJsonAtomic(SITE_PATH, seeded);
    return seeded;
  }
  const raw = JSON.parse(fs.readFileSync(SITE_PATH, "utf8"));
  // Fill any missing keys from defaults so old stores keep working
  return deepMerge(structuredClone(SITE_DEFAULT), raw);
}

export function writeSite(data) {
  ensureDirs();
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid site payload");
  }
  const merged = deepMerge(structuredClone(SITE_DEFAULT), data);
  merged.updatedAt = new Date().toISOString();
  merged.version = SITE_DEFAULT.version || 1;
  writeJsonAtomic(SITE_PATH, merged);
  return merged;
}

export function seedSite(force = false) {
  ensureDirs();
  if (!force && fs.existsSync(SITE_PATH)) {
    console.log(`Site store already exists → ${SITE_PATH}`);
    return readSite();
  }
  return writeSite(structuredClone(SITE_DEFAULT));
}
