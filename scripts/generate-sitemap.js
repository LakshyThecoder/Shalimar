/**
 * Builds production sitemaps into /public
 * Usage: SITE_URL=https://your-domain.com node scripts/generate-sitemap.js
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
  "https://shalimar.vercel.app"
).replace(/\/$/, "");

function readUpdatedAt(file, fallback = new Date().toISOString()) {
  try {
    const json = JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
    return (json.updatedAt || fallback).slice(0, 10);
  } catch {
    return fallback.slice(0, 10);
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hreflangLinks(loc) {
  return ["it", "en", "x-default"]
    .map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(loc)}" />`
    )
    .join("\n");
}

function urlEntry({ loc, lastmod, changefreq, priority, images = [] }) {
  const imageXml = images
    .map(
      (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`
    )
    .join("\n");

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${hreflangLinks(loc)}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageXml ? `${imageXml}\n` : ""}  </url>`;
}

const siteLastmod = readUpdatedAt("site-store.json");
const menuLastmod = readUpdatedAt("menu-store.json");
const today = new Date().toISOString().slice(0, 10);

/** Only real indexable URLs — no #fragments, no QR utility, no admin */
const pages = [
  {
    loc: `${SITE_URL}/`,
    lastmod: siteLastmod,
    changefreq: "daily",
    priority: "1.0",
    images: [
      {
        loc: `${SITE_URL}/og-shalimar.jpg`,
        title: "Shalimar Milano - Halal Indian restaurant",
        caption:
          "Best Halal Indian and Pakistani restaurant and takeaway in Milan - Viale Toscana and Porta Romana",
      },
    ],
  },
  {
    loc: `${SITE_URL}/menu`,
    lastmod: menuLastmod,
    changefreq: "daily",
    priority: "0.95",
    images: [
      {
        loc: `${SITE_URL}/og-shalimar.jpg`,
        title: "Shalimar menu - Indian Halal Milano",
        caption: "Tandoor, curries, biryani, naan and sweets at Shalimar Milan",
      },
    ],
  },
];

const pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(urlEntry).join("\n\n")}
</urlset>
`;

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(`${SITE_URL}/sitemap-pages.xml`)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${escapeXml(`${SITE_URL}/sitemap-images.xml`)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

const imagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(`${SITE_URL}/`)}</loc>
    <lastmod>${siteLastmod}</lastmod>
    <image:image>
      <image:loc>${escapeXml(`${SITE_URL}/og-shalimar.jpg`)}</image:loc>
      <image:title>Shalimar Milano - Best Halal Indian Restaurant</image:title>
      <image:caption>Halal Indian and Pakistani food in Milan - Shalimar restaurant Viale Toscana and takeaway Porta Romana</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${escapeXml(`${SITE_URL}/menu`)}</loc>
    <lastmod>${menuLastmod}</lastmod>
    <image:image>
      <image:loc>${escapeXml(`${SITE_URL}/og-shalimar.jpg`)}</image:loc>
      <image:title>Shalimar Menu - Indian Halal Milano</image:title>
      <image:caption>Full Shalimar menu: tandoor, curry, biryani, vegetarian, naan, sweets</image:caption>
    </image:image>
  </url>
</urlset>
`;

fs.mkdirSync(PUBLIC, { recursive: true });
fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), indexXml, "utf8");
fs.writeFileSync(path.join(PUBLIC, "sitemap-pages.xml"), pagesXml, "utf8");
fs.writeFileSync(path.join(PUBLIC, "sitemap-images.xml"), imagesXml, "utf8");

const robots = `# Shalimar Milano
User-agent: *
Allow: /
Allow: /menu
Allow: /og-shalimar.jpg
Allow: /sitemap.xml
Allow: /sitemap-pages.xml
Allow: /sitemap-images.xml

Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /qrmenu
Disallow: /qrmenu/

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC, "robots.txt"), robots, "utf8");

console.log(`Sitemap generated for ${SITE_URL}`);
console.log(`  → public/sitemap.xml (index)`);
console.log(`  → public/sitemap-pages.xml (${pages.length} URLs + images + hreflang + lastmod)`);
console.log(`  → public/sitemap-images.xml`);
console.log(`  → public/robots.txt`);
