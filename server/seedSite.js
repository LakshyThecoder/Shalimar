import { seedSite, SITE_PATH } from "./siteStore.js";

const force = process.argv.includes("--force");
const site = seedSite(force);
console.log(`Site content → ${SITE_PATH}`);
console.log(`Brand: ${site.brand?.name}`);
