import { MENU_SECTIONS, ALLERGENS } from "../src/data/menu.js";
import { TAKEAWAY_SECTIONS } from "../src/data/takeawayMenu.js";
import { labelFor } from "./labels.js";

function normalizeSection(section) {
  return {
    id: section.id,
    label: labelFor(section.id),
    noteKey: section.noteKey || null,
    featured: Boolean(section.featured),
    isSetMenu: Boolean(section.isSetMenu),
    image: section.image || "",
    items: (section.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      spicy: Boolean(item.spicy),
      available: item.available !== false,
      image: item.image || "",
      desc: {
        it: item.desc?.it || "",
        en: item.desc?.en || "",
      },
      includes: Array.isArray(item.includes) ? [...item.includes] : [],
    })),
  };
}

export function buildMenuStore() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    allergens: ALLERGENS,
    branches: {
      restaurant: {
        id: "restaurant",
        sections: MENU_SECTIONS.map(normalizeSection),
      },
      takeaway: {
        id: "takeaway",
        sections: TAKEAWAY_SECTIONS.map(normalizeSection),
      },
    },
  };
}
