import { createApp } from "./app.js";
import { seedSite } from "./siteStore.js";
import { readStore } from "./store.js";
import { useBlob } from "./blobStore.js";

const PORT = Number(process.env.PORT || 8787);
const ADMIN_USER = process.env.ADMIN_USER || "Shalimar";

await seedSite(false).catch((err) => {
  console.warn("Site seed:", err.message);
});

try {
  await readStore();
} catch (err) {
  console.warn("Menu store:", err.message);
}

const app = createApp({ serveStatic: true });

app.listen(PORT, () => {
  console.log(`Shalimar API → http://localhost:${PORT}`);
  console.log(`  Storage → ${useBlob() ? "Vercel Blob" : "local data/ + public/uploads"}`);
  console.log(`  Admin   → /admin  (${ADMIN_USER})`);
});
