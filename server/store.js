import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeJsonAtomic } from "./atomicWrite.js";
import { buildMenuStore } from "./menuSeedData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = path.join(ROOT, "data");
export const STORE_PATH = path.join(DATA_DIR, "menu-store.json");
export const UPLOAD_DIR = path.join(ROOT, "public", "uploads");

export function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function readStore() {
  ensureDirs();
  if (!fs.existsSync(STORE_PATH)) {
    const seeded = buildMenuStore();
    writeJsonAtomic(STORE_PATH, seeded);
    console.log(`Auto-seeded menu store → ${STORE_PATH}`);
    return seeded;
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
}

export function writeStore(data) {
  ensureDirs();
  data.updatedAt = new Date().toISOString();
  writeJsonAtomic(STORE_PATH, data);
  return data;
}

export function slugify(text) {
  return String(text || "item")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
