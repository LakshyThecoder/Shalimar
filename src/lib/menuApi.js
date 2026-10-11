const API_BASE = "";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the API. Locally run npm run dev. On the live site, check Vercel env (BLOB_READ_WRITE_TOKEN)."
    );
  }

  const raw = await res.text();
  const looksHtml = /^\s*<!doctype html/i.test(raw) || /^\s*<html/i.test(raw);
  if (looksHtml) {
    const local = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.host);
    throw new Error(
      local
        ? "Wrong app on this port — open Shalimar at http://localhost:5174/admin (not 5173)"
        : "Admin API is not deployed. Redeploy with the /api serverless function and Blob storage."
    );
  }

  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchPublicMenu(branch) {
  return request(`/api/menu/${branch}`);
}

export async function adminLogin(username, password) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout() {
  return request("/api/admin/logout", { method: "POST", body: "{}" });
}

export async function adminMe() {
  return request("/api/admin/me");
}

export async function adminGetMenu(branch) {
  return request(`/api/admin/menu/${branch}`);
}

export async function adminSaveMenu(branch, sections) {
  return request(`/api/admin/menu/${branch}`, {
    method: "PUT",
    body: JSON.stringify({ sections }),
  });
}

export async function adminUploadPhoto(file) {
  const form = new FormData();
  form.append("photo", file);
  return request("/api/admin/upload", {
    method: "POST",
    body: form,
  });
}

export async function adminDeletePhoto(url) {
  const s = String(url || "");
  if (!s) return { ok: true };
  const isLocal = s.startsWith("/uploads/");
  const isBlob = s.includes("blob.vercel-storage.com");
  if (!isLocal && !isBlob) return { ok: true };
  return request("/api/admin/upload", {
    method: "DELETE",
    body: JSON.stringify({ url: s }),
  });
}

export function sectionTitle(section, lang = "it") {
  if (section?.label?.[lang]) return section.label[lang];
  if (section?.label?.it) return section.label.it;
  if (section?.label?.en) return section.label.en;
  return section?.id || "";
}
