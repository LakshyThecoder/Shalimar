/** Hard cap after compression — server rejects anything larger. */
export const MAX_UPLOAD_BYTES = 500 * 1024;
/** Aim under this so uploads stay small. */
export const TARGET_UPLOAD_BYTES = 380 * 1024;
/** Longest side in pixels. */
export const MAX_IMAGE_EDGE = 1600;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function supportsWebp() {
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

/**
 * Resize + recompress aggressively (WebP/JPEG) until under the size cap.
 * Throws if the file still cannot fit under MAX_UPLOAD_BYTES.
 */
export async function compressImage(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("Choose a JPG, PNG or WebP photo");
  }

  // Already tiny — skip work
  if (file.size <= TARGET_UPLOAD_BYTES && file.type !== "image/png" && file.type !== "image/gif") {
    if (file.size <= MAX_UPLOAD_BYTES) return file;
  }

  const img = await loadImage(file);
  const mime = supportsWebp() ? "image/webp" : "image/jpeg";
  const ext = mime === "image/webp" ? "webp" : "jpg";
  const base =
    String(file.name || "photo")
      .replace(/\.[^.]+$/, "")
      .replace(/[^\w\-]+/g, "-")
      .slice(0, 40) || "photo";

  let edge = Math.min(MAX_IMAGE_EDGE, Math.max(img.width, img.height) || MAX_IMAGE_EDGE);
  let best = null;

  for (let pass = 0; pass < 8; pass += 1) {
    const scale = edge / Math.max(img.width, img.height, 1);
    const w = Math.max(1, Math.round(img.width * Math.min(1, scale)));
    const h = Math.max(1, Math.round(img.height * Math.min(1, scale)));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#0c0b0a";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    for (let q = 0.82; q >= 0.4; q -= 0.08) {
      const blob = await canvasToBlob(canvas, mime, q);
      if (!blob) continue;
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= TARGET_UPLOAD_BYTES) {
        return new File([blob], `${base}.${ext}`, { type: mime, lastModified: Date.now() });
      }
    }

    edge = Math.round(edge * 0.75);
    if (edge < 640) break;
  }

  if (best && best.size <= MAX_UPLOAD_BYTES) {
    return new File([best], `${base}.${ext}`, { type: mime, lastModified: Date.now() });
  }

  throw new Error(
    `Photo is still too large after compression (max ${Math.round(MAX_UPLOAD_BYTES / 1024)} KB). Try a smaller image.`
  );
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
