import { SITE_DEFAULT } from "../data/siteDefault.js";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the API. Locally run npm run dev. On the live site, set BLOB_READ_WRITE_TOKEN in Vercel."
    );
  }

  const raw = await res.text();
  const looksHtml = /^\s*<!doctype html/i.test(raw) || /^\s*<html/i.test(raw);
  if (looksHtml) {
    const local = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.host);
    throw new Error(
      local
        ? "Wrong app on this port — open Shalimar at http://localhost:5174/admin (not 5173)"
        : "Admin API is not deployed. Redeploy with the /api function and Vercel Blob storage."
    );
  }

  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function fetchSite() {
  return request("/api/site");
}

export async function adminGetSite() {
  return request("/api/admin/site");
}

export async function adminSaveSite(site) {
  return request("/api/admin/site", {
    method: "PUT",
    body: JSON.stringify(site),
  });
}

export async function adminResetSite() {
  return request("/api/admin/site/reset", { method: "POST", body: "{}" });
}

/** Resolve bilingual field */
export function tx(value, lang = "en") {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value[lang] || value.en || value.it || "";
  }
  return String(value);
}

export { SITE_DEFAULT };
