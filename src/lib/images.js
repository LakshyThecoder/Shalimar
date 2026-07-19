// Curated Unsplash imagery — matched to each Shalimar section
const u = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const IMG = {
  // Home / brand
  hero: u("photo-1585937421612-70a008356fbe", 1800),
  spices: u("photo-1596040033229-a9821ebd058d", 1600),
  dining: u("photo-1517248135467-4c7edcad34c4", 1600),
  ambiance: u("photo-1414235077428-338989a2e8c0", 1400),
  milan: u("photo-1523906834658-6e24ef2386f9", 1400),

  // Food signatures
  tandoori: u("photo-1697155406147-7d640cbba0e7", 1400),
  biryani: u("photo-1563379091339-03b21ab4a4f8", 1400),
  curry: u("photo-1603894584373-5ac82b2ae398", 1400),
  naan: u("photo-1750190624251-f0608cbea657", 1400),
  thali: u("photo-1585937421612-70a008356fbe", 1400),
  chai: u("photo-1571934811356-5cc061b6821f", 1200),
  kebabs: u("photo-1599487488170-d11ec9c172f0", 1400),

  // Menu chapters (unique per category)
  antipasti: u("photo-1601050690597-df0568f70950", 1200), // samosas
  zuppe: u("photo-1547592166-23ac45744acd", 1200), // soup
  vegetarian: u("photo-1505253758473-96b7015fcd40", 1200), // veg indian bowl
  nonVegetarian: u("photo-1603894584373-5ac82b2ae398", 1200), // butter chicken
  lamb: u("photo-1545247181-516773cae754", 1200), // lamb curry
  rice: u("photo-1563379091339-03b21ab4a4f8", 1200), // biryani
  bread: u("photo-1750190624251-f0608cbea657", 1200), // naan
  burgers: u("photo-1568901346375-23c9450c58cd", 1200),
  desserts: u("photo-1551024506-0bccd828d307", 1200),
  fixedMenus: u("photo-1414235077428-338989a2e8c0", 1200),
  drinks: u("photo-1623065422902-30a2d299bbe4", 1200), // lassi-style

  // Gallery thumbs
  s1: u("photo-1601050690597-df0568f70950", 800),
  s2: u("photo-1697155406147-7d640cbba0e7", 800),
  s3: u("photo-1563379091339-03b21ab4a4f8", 800),
  s4: u("photo-1596040033229-a9821ebd058d", 800),
  s5: u("photo-1603894584373-5ac82b2ae398", 800),
  s6: u("photo-1750190624251-f0608cbea657", 800),
};

export const SECTION_IMAGES = {
  antipasti: IMG.antipasti,
  zuppe: IMG.zuppe,
  tandoori: IMG.tandoori,
  vegetarian: IMG.vegetarian,
  nonVegetarian: IMG.nonVegetarian,
  lamb: IMG.lamb,
  rice: IMG.rice,
  bread: IMG.bread,
  burgers: IMG.burgers,
  desserts: IMG.desserts,
  fixedMenus: IMG.fixedMenus,
  drinks: IMG.drinks,
};
