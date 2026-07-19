import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import it from "./locales/it.json";
import hi from "./locales/hi.json";
import ur from "./locales/ur.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import ar from "./locales/ar.json";

export const LANGUAGES = [
  { code: "it", label: "Italiano", short: "IT", dir: "ltr", country: "it", flag: "🇮🇹" },
  { code: "en", label: "English", short: "EN", dir: "ltr", country: "gb", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", short: "HI", dir: "ltr", country: "in", flag: "🇮🇳" },
  { code: "ur", label: "اردو", short: "UR", dir: "rtl", country: "pk", flag: "🇵🇰" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr", country: "fr", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", short: "DE", dir: "ltr", country: "de", flag: "🇩🇪" },
  { code: "es", label: "Español", short: "ES", dir: "ltr", country: "es", flag: "🇪🇸" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl", country: "sa", flag: "🇸🇦" },
];

const picked =
  typeof window !== "undefined" ? localStorage.getItem("shalimar_lang_picked") : null;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
      hi: { translation: hi },
      ur: { translation: ur },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      ar: { translation: ar },
    },
    lng: picked || undefined,
    fallbackLng: "it",
    supportedLngs: ["it", "en", "hi", "ur", "fr", "de", "es", "ar"],
    interpolation: { escapeValue: false },
    detection: {
      // Only auto-detect after user has picked once (stored as shalimar_lang_picked + i18nextLng)
      order: picked ? ["localStorage", "navigator"] : ["localStorage"],
      caches: ["localStorage"],
    },
  });

export function applyDocumentDirection(lng) {
  const meta = LANGUAGES.find((l) => l.code === lng) || LANGUAGES[0];
  document.documentElement.lang = lng;
  document.documentElement.dir = meta.dir;
}

i18n.on("languageChanged", applyDocumentDirection);
if (typeof document !== "undefined") {
  applyDocumentDirection(i18n.language?.slice(0, 2) || "it");
}

export default i18n;
