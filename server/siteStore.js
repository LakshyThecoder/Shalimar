import fs from "fs";
import path from "path";
import { DATA_DIR, ensureDirs } from "./store.js";
import { SITE_DEFAULT } from "../src/data/siteDefault.js";
import { deepMerge, writeJsonAtomic } from "./atomicWrite.js";
import { assertProdStorage, readJsonBlob, useBlob, writeJsonBlob } from "./blobStore.js";

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
    if (remote) return deepMerge(structuredClone(SITE_DEFAULT), remote);
    const seeded = deepMerge(structuredClone(SITE_DEFAULT), {
      updatedAt: new Date().toISOString(),
    });
    await writeJsonBlob(SITE_BLOB, seeded);
    return seeded;
  }
  return seedLocal(false);
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
