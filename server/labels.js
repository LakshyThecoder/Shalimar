/** Default IT/EN labels for known category ids */
export const CATEGORY_LABELS = {
  antipasti: { it: "Antipasti", en: "Starters" },
  zuppe: { it: "Zuppe", en: "Soups" },
  tandoori: { it: "Piatti Tandoori", en: "Tandoori" },
  vegetarian: { it: "Piatti Vegetariani", en: "Vegetarian" },
  nonVegetarian: { it: "Piatti Non Vegetariani", en: "Non-Vegetarian" },
  lamb: { it: "Piatti di Agnello", en: "Lamb" },
  rice: { it: "Riso", en: "Rice" },
  bread: { it: "Pane", en: "Bread" },
  burgers: { it: "Burger", en: "Burgers" },
  desserts: { it: "Dolci", en: "Desserts" },
  fixedMenus: { it: "Menu Fissi", en: "Set Menus" },
  drinks: { it: "Bevande", en: "Drinks" },
  fritti: { it: "Fritti", en: "Fried" },
  secondi: { it: "Secondi", en: "Mains" },
  basmati: { it: "Piatti Basmati", en: "Basmati" },
  salse: { it: "Salse", en: "Sauces" },
  naan: { it: "Naan", en: "Naan" },
  combo: { it: "Combo Menu Coca-Cola", en: "Combo + Coca-Cola" },
  dolci: { it: "Dolci", en: "Sweets" },
  bevande: { it: "Bevande", en: "Drinks" },
  birre: { it: "Birre", en: "Beer" },
  offerta: { it: "Offerta Speciale", en: "Special Box" },
};

export function labelFor(id) {
  return CATEGORY_LABELS[id] || { it: id, en: id };
}
