import fs from "fs";
import path from "path";

/** Crash-safe JSON write: temp file then rename */
export function writeJsonAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.${process.pid}.tmp`;
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(tmp, json, "utf8");
  fs.renameSync(tmp, filePath);
}

/** Deep-merge plain objects; arrays from `patch` replace */
export function deepMerge(base, patch) {
  if (patch == null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch;
  }
  const out = { ...(base && typeof base === "object" && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
