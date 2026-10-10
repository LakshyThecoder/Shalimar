/** Central SEO config — Halal Indian / Shalimar Milano */

export const SITE_NAME = "Shalimar";
export const SITE_NAME_FULL = "Shalimar Milano";

/** Production origin — override with VITE_SITE_URL in .env */
export function getSiteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = window.location.origin;
    if (!/localhost|127\.0\.0\.1/.test(origin)) return origin;
  }
  return "https://www.shalimarmilano.store";
}

export const DEFAULT_OG_IMAGE = "/og-shalimar.jpg";

export const LOCAL_BUSINESS = {
  restaurant: {
    name: "Shalimar Restaurant",
    alternateName: "Shalimar Viale Toscana",
    street: "Viale Toscana 2",
    postalCode: "20136",
    city: "Milano",
    region: "MI",
    country: "IT",
    phone: "+39-02-9166-3939",
    phoneAlt: "+39-339-178-5899",
    maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Viale+Toscana+2+20136+Milano",
    priceRange: "€€",
    servesCuisine: ["Indian", "Pakistani", "Halal"],
    geo: { lat: 45.4438, lng: 9.1942 },
  },
  takeaway: {
    name: "Shalimar Take Away & Sweet House",
    alternateName: "Shalimar Porta Romana",
    street: "Corso di Porta Romana 25",
    postalCode: "20122",
    city: "Milano",
    region: "MI",
    country: "IT",
    phone: "+39-02-5830-7508",
    maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Corso+di+Porta+Romana+25+20122+Milano",
    priceRange: "€",
    servesCuisine: ["Indian", "Pakistani", "Halal"],
    geo: { lat: 45.4566, lng: 9.1989 },
  },
};

/** Route → SEO copy (IT primary market + EN for international search) */
export const ROUTES = {
  home: {
    path: "/",
    title: {
      it: "Shalimar Milano | Miglior Ristorante Indiano Halal & Take Away",
      en: "Shalimar Milan | Best Halal Indian Restaurant & Takeaway",
    },
    description: {
      it: "Shalimar: ristorante indiano e pakistano Halal a Milano. Viale Toscana 2 e take away Porta Romana 25. Tandoor, curry, biryani, naan e dolci. Prenota o ordina asporto.",
      en: "Shalimar — best Halal Indian & Pakistani food in Milan. Restaurant on Viale Toscana and takeaway on Porta Romana. Tandoor, curries, biryani, naan and sweets. Book a table or order takeaway.",
    },
    keywords:
      "Shalimar, Shalimar restaurant, Shalimar Milano, best Indian food Milan, ristorante indiano Milano, Halal Milano, Indian restaurant Milan, takeaway indiano, Porta Romana, Viale Toscana, Pakistani food Milan, tandoori, biryani, curry Halal",
  },
  menu: {
    path: "/menu",
    title: {
      it: "Menu Shalimar | Cucina Indiana Halal Milano",
      en: "Shalimar Menu | Halal Indian Food Milan",
    },
    description: {
      it: "Menu Shalimar Milano: tandoor, curry, biryani, vegetariani, naan e dolci. Ristorante Viale Toscana e take away Porta Romana. Cucina indiana e pakistana Halal.",
      en: "Shalimar menu in Milan: tandoor, curries, biryani, vegetarian dishes, naan and sweets. Halal Indian & Pakistani restaurant and takeaway.",
    },
    keywords:
      "Shalimar menu, menu indiano Milano, Halal menu Milan, tandoori Milano, biryani Milano, curry Milano",
  },
  qrmenu: {
    path: "/qrmenu",
    title: {
      it: "Menu QR Shalimar | Prezzi Ristorante & Take Away",
      en: "Shalimar QR Menu | Prices Restaurant & Takeaway",
    },
    description: {
      it: "Menu digitale Shalimar con prezzi. Scegli ristorante Viale Toscana o take away Porta Romana.",
      en: "Shalimar digital menu with prices. Choose Viale Toscana restaurant or Porta Romana takeaway.",
    },
    keywords: "Shalimar QR menu, prezzi menu indiano Milano",
  },
};

export function pickLang(i18nLang) {
  return i18nLang?.startsWith("it") ? "it" : "en";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImage(path = DEFAULT_OG_IMAGE) {
  if (!path) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path);
}

function postalAddress(loc) {
  return {
    "@type": "PostalAddress",
    streetAddress: loc.street,
    addressLocality: loc.city,
    addressRegion: loc.region,
    postalCode: loc.postalCode,
    addressCountry: loc.country,
  };
}

function placeNode(loc, id) {
  return {
    "@type": ["Restaurant", "FoodEstablishment"],
    "@id": id,
    name: loc.name,
    alternateName: loc.alternateName,
    image: absoluteImage(DEFAULT_OG_IMAGE),
    url: getSiteUrl(),
    telephone: loc.phone,
    priceRange: loc.priceRange,
    servesCuisine: loc.servesCuisine,
    address: postalAddress(loc),
    geo: loc.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: loc.geo.lat,
          longitude: loc.geo.lng,
        }
      : undefined,
    hasMap: loc.maps,
    acceptsReservations: id.includes("restaurant"),
    keywords:
      "Halal, Indian restaurant Milan, best Indian food, Shalimar, Pakistani cuisine, ristorante indiano Milano",
    areaServed: [
      { "@type": "City", name: "Milan" },
      { "@type": "City", name: "Milano" },
    ],
    paymentAccepted: "Cash, Credit Card, Debit Card",
    currenciesAccepted: "EUR",
  };
}

/** JSON-LD graph for rich results + local SEO */
export function buildLocalBusinessJsonLd() {
  const site = getSiteUrl();
  const restaurantId = `${site}/#restaurant`;
  const takeawayId = `${site}/#takeaway`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: SITE_NAME_FULL,
        alternateName: ["Shalimar", "Shalimar Restaurant Milano", "Shalimar Halal"],
        inLanguage: ["it-IT", "en"],
        description: ROUTES.home.description.en,
        publisher: { "@id": restaurantId },
      },
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: SITE_NAME_FULL,
        url: site,
        logo: absoluteUrl("/favicon.svg"),
        image: absoluteImage(DEFAULT_OG_IMAGE),
        sameAs: [],
      },
      {
        ...placeNode(LOCAL_BUSINESS.restaurant, restaurantId),
        parentOrganization: { "@id": `${site}/#organization` },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "11:30",
            closes: "14:20",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "18:00",
            closes: "22:10",
          },
        ],
      },
      {
        ...placeNode(LOCAL_BUSINESS.takeaway, takeawayId),
        parentOrganization: { "@id": `${site}/#organization` },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "11:00",
            closes: "21:30",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${site}/#webpage`,
        url: site,
        name: ROUTES.home.title.en,
        isPartOf: { "@id": `${site}/#website` },
        about: [{ "@id": restaurantId }, { "@id": takeawayId }],
        description: ROUTES.home.description.en,
        inLanguage: ["it-IT", "en"],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${site}/`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${site}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Shalimar Halal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Shalimar serves Halal Indian and Pakistani food at both Milan locations.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Shalimar restaurant in Milan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The restaurant is at Viale Toscana 2, 20136 Milano. Takeaway and sweets are at Corso di Porta Romana 25, 20122 Milano.",
            },
          },
          {
            "@type": "Question",
            name: "What is the best Indian food at Shalimar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Guests often order chicken tandoori, chicken tikka, curries, biryani, naan and samosas. Ask the staff for mild or spicy recommendations.",
            },
          },
        ],
      },
    ],
  };
}

export function buildMenuJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Shalimar Menu — Halal Indian Food Milan",
    description: ROUTES.menu.description.en,
    url: absoluteUrl("/menu"),
    inLanguage: ["it-IT", "en"],
    hasMenuSection: [
      { "@type": "MenuSection", name: "Tandoor" },
      { "@type": "MenuSection", name: "Curries" },
      { "@type": "MenuSection", name: "Biryani & Rice" },
      { "@type": "MenuSection", name: "Vegetarian" },
      { "@type": "MenuSection", name: "Bread" },
      { "@type": "MenuSection", name: "Sweets" },
    ],
    provider: { "@id": `${site}/#restaurant` },
  };
}
