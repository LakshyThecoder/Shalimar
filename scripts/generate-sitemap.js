/**
 * Single clean Google-compatible sitemap (no XSL, no index tricks).
 * SITE_URL=https://www.shalimarmilano.store node scripts/generate-sitemap.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data");

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  "https://www.shalimarmilano.store"
).replace(/\/$/, "");

function readUpdatedAt(file) {
  try {
    const json = JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
    return (json.updatedAt || new Date().toISOString()).slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const siteLastmod = readUpdatedAt("site-store.json");
const menuLastmod = readUpdatedAt("menu-store.json");

const urls = [
  { loc: `${SITE_URL}/`, lastmod: siteLastmod, priority: "1.0", changefreq: "daily" },
  { loc: `${SITE_URL}/menu`, lastmod: menuLastmod, priority: "0.9", changefreq: "daily" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <xhtml:link rel="alternate" hreflang="it" href="${esc(u.loc)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${esc(u.loc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(u.loc)}" />
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <image:image>
      <image:loc>${esc(`${SITE_URL}/og-shalimar.jpg`)}</image:loc>
      <image:title>Shalimar Milano Halal Indian Restaurant</image:title>
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Allow: /menu
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /qrmenu
Disallow: /qrmenu/

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.mkdirSync(PUBLIC, { recursive: true });

// Write without BOM — Google rejects some BOM-prefixed XML
fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), sitemap, { encoding: "utf8" });
fs.writeFileSync(path.join(PUBLIC, "robots.txt"), robots, { encoding: "utf8" });

// Remove old multi-sitemap files that confuse Search Console
for (const stale of ["sitemap-pages.xml", "sitemap-images.xml", "sitemap.xsl"]) {
  const p = path.join(PUBLIC, stale);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

console.log(`OK → ${SITE_URL}/sitemap.xml (${urls.length} URLs)`);
console.log(`OK → robots.txt`);
