import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import it from "./locales/it.json";
import {
  GOOGLE_LANGUAGES,
  getGoogleLang,
  clearGoogleTranslate,
  setGoogleTranslate,
  isGoogleLanguage,
} from "./googleTranslate";

/** Native, curated translations */
export const LANGUAGES = [
  { code: "it", label: "Italiano", short: "IT", dir: "ltr", country: "it", via: "native" },
  { code: "en", label: "English", short: "EN", dir: "ltr", country: "gb", via: "native" },
];

/** Native IT/EN + Google-powered extras */
export const ALL_LANGUAGES = [...LANGUAGES, ...GOOGLE_LANGUAGES];

export {
  GOOGLE_LANGUAGES,
  getGoogleLang,
  clearGoogleTranslate,
  setGoogleTranslate,
  isGoogleLanguage,
};

const picked =
  typeof window !== "undefined" ? localStorage.getItem("shalimar_lang_picked") : null;

const googleActive =
  typeof window !== "undefined" ? getGoogleLang() : null;

// If Google Translate is active, keep i18n on Italian (source for Google)
const initialLng =
  googleActive && isGoogleLanguage(googleActive)
    ? "it"
    : picked && LANGUAGES.some((l) => l.code === picked)
      ? picked
      : undefined;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
    },
    lng: initialLng,
    fallbackLng: "it",
    supportedLngs: ["it", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: initialLng ? ["localStorage"] : picked ? ["localStorage", "navigator"] : ["localStorage"],
      caches: ["localStorage"],
    },
  });

export function applyDocumentDirection(lng) {
  const meta = ALL_LANGUAGES.find((l) => l.code === lng) || LANGUAGES[0];
  document.documentElement.lang = lng;
  document.documentElement.dir = meta.dir;
}

export function getActiveLanguageMeta() {
  const google = getGoogleLang();
  if (google && isGoogleLanguage(google)) {
    return ALL_LANGUAGES.find((l) => l.code === google) || LANGUAGES[0];
  }
  const code = i18n.language?.slice(0, 2) || "it";
  return ALL_LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

/**
 * Switch language: IT/EN use native i18n; others use Google Translate.
 * Reloads when toggling Google on/off so the engine applies cleanly.
 */
export function selectLanguage(code) {
  const wasGoogle = getGoogleLang();
  const goingGoogle = isGoogleLanguage(code);

  localStorage.setItem("shalimar_lang_picked", code);

  if (goingGoogle) {
    i18n.changeLanguage("it");
    setGoogleTranslate(code);
    applyDocumentDirection(code);
    if (wasGoogle !== code) {
      window.location.reload();
    }
    return;
  }

  // Native IT / EN
  if (wasGoogle) {
    clearGoogleTranslate();
    i18n.changeLanguage(code);
    applyDocumentDirection(code);
    window.location.reload();
    return;
  }

  i18n.changeLanguage(code);
  applyDocumentDirection(code);
}

i18n.on("languageChanged", (lng) => {
  if (!getGoogleLang()) {
    applyDocumentDirection(lng?.slice(0, 2) || "it");
  }
});

if (typeof document !== "undefined") {
  const google = getGoogleLang();
  if (google && isGoogleLanguage(google)) {
    applyDocumentDirection(google);
  } else {
    applyDocumentDirection(i18n.language?.slice(0, 2) || "it");
  }
}

export default i18n;
