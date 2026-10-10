import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ROUTES,
  absoluteImage,
  absoluteUrl,
  buildLocalBusinessJsonLd,
  buildMenuJsonLd,
  pickLang,
  SITE_NAME_FULL,
} from "../lib/seo";

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkRel(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]:not([hreflang])`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertHreflang(hreflang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Route-level SEO: title, meta, Open Graph, Twitter, canonical, hreflang, JSON-LD
 */
export default function Seo({
  routeKey = "home",
  noindex = false,
  jsonLd,
  pathOverride,
  titleOverride,
  descriptionOverride,
}) {
  const { i18n } = useTranslation();
  const lang = pickLang(i18n.language);
  const route = ROUTES[routeKey] || ROUTES.home;
  const path = pathOverride || route.path;
  const title = titleOverride || route.title[lang] || route.title.en;
  const description =
    descriptionOverride || route.description[lang] || route.description.en;
  const canonical = absoluteUrl(path);
  const ogImage = absoluteImage();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang === "it" ? "it" : "en";

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", route.keywords);
    upsertMeta("name", "author", SITE_NAME_FULL);
    upsertMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1"
    );
    upsertMeta("name", "googlebot", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("name", "geo.region", "IT-MI");
    upsertMeta("name", "geo.placename", "Milano");
    upsertMeta("name", "geo.position", "45.4435;9.1945");
    upsertMeta("name", "ICBM", "45.4435, 9.1945");
    upsertMeta("name", "theme-color", "#0A0908");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME_FULL);
    upsertMeta("property", "og:locale", lang === "it" ? "it_IT" : "en_US");
    upsertMeta("property", "og:locale:alternate", lang === "it" ? "en_US" : "it_IT");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", "Shalimar — Halal Indian restaurant Milano");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    upsertLinkRel("canonical", canonical);
    upsertHreflang("it", absoluteUrl(path));
    upsertHreflang("en", absoluteUrl(path));
    upsertHreflang("x-default", absoluteUrl(path));

    if (noindex) {
      document.getElementById("seo-jsonld")?.remove();
      document.getElementById("seo-jsonld-menu")?.remove();
      return;
    }

    if (jsonLd) {
      upsertJsonLd("seo-jsonld", jsonLd);
    } else if (routeKey === "home") {
      upsertJsonLd("seo-jsonld", buildLocalBusinessJsonLd());
    } else if (routeKey === "menu" || routeKey === "qrmenu") {
      upsertJsonLd("seo-jsonld", buildLocalBusinessJsonLd());
      upsertJsonLd("seo-jsonld-menu", buildMenuJsonLd());
    }
  }, [
    title,
    description,
    canonical,
    ogImage,
    lang,
    noindex,
    routeKey,
    path,
    route.keywords,
    jsonLd,
  ]);

  return null;
}
