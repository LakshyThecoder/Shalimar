import { buildMenuStore } from "./menuSeedData.js";
import { ensureDirs, writeStore, STORE_PATH } from "./store.js";

ensureDirs();
const store = buildMenuStore();
await writeStore(store);
console.log(`Seeded menu store → ${STORE_PATH}`);
console.log(
  `Restaurant sections: ${store.branches.restaurant.sections.length}, Takeaway: ${store.branches.takeaway.sections.length}`
);
