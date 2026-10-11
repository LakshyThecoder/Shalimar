import { useBlob } from "../server/blobStore.js";

export default function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      storage: useBlob() ? "vercel-blob" : "local-json",
      admin: true,
      needsBlob: Boolean(process.env.VERCEL) && !useBlob(),
    })
  );
}
