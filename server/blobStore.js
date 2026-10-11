import { put, list, del } from "@vercel/blob";

export function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** True when running on Vercel without Blob — reads can use defaults; writes must fail clearly. */
export function missingProdBlob() {
  return Boolean(process.env.VERCEL) && !useBlob();
}

/** Vercel has no persistent disk — Blob token is required to save. */
export function assertProdStorage() {
  if (missingProdBlob()) {
    throw new Error(
      "Production storage missing: add a Vercel Blob store (BLOB_READ_WRITE_TOKEN) in project settings."
    );
  }
}

async function findBlob(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 10 });
  return blobs.find((b) => b.pathname === pathname) || blobs[0] || null;
}

export async function readJsonBlob(pathname) {
  const blob = await findBlob(pathname);
  if (!blob?.url) return null;
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function writeJsonBlob(pathname, data) {
  const body = JSON.stringify(data, null, 2);
  const result = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return result.url;
}

export async function uploadBinaryBlob(pathname, buffer, contentType) {
  const result = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: contentType || "application/octet-stream",
  });
  return result.url;
}

export async function deleteBlobByUrl(url) {
  if (!url || !String(url).includes("blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    /* ignore */
  }
}
