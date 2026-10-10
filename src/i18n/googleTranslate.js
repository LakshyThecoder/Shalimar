/** Google Translate helpers — used for languages beyond native IT/EN. */

export const GOOGLE_LANGUAGES = [
  { code: "hi", label: "हिन्दी", short: "HI", dir: "ltr", country: "in", via: "google" },
  { code: "ur", label: "اردو", short: "UR", dir: "rtl", country: "pk", via: "google" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr", country: "fr", via: "google" },
  { code: "de", label: "Deutsch", short: "DE", dir: "ltr", country: "de", via: "google" },
  { code: "es", label: "Español", short: "ES", dir: "ltr", country: "es", via: "google" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl", country: "sa", via: "google" },
  { code: "zh-CN", label: "中文", short: "ZH", dir: "ltr", country: "cn", via: "google" },
  { code: "pt", label: "Português", short: "PT", dir: "ltr", country: "pt", via: "google" },
];

const COOKIE = "googtrans";
/** Source page language for Google (native Italian copy). */
export const GOOGLE_PAGE_LANG = "it";

export function getGoogleLang() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) return null;
  const parts = decodeURIComponent(match[1]).split("/");
  return parts[2] || null;
}

function setCookie(name, value, domain) {
  const base = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
  document.cookie = base;
  if (domain) document.cookie = `${base};domain=${domain}`;
}

function clearCookie(name, domain) {
  const expired = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = expired;
  if (domain) document.cookie = `${expired};domain=${domain}`;
}

export function clearGoogleTranslate() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  clearCookie(COOKIE);
  clearCookie(COOKIE, host);
  if (host.includes(".")) {
    clearCookie(COOKIE, `.${host}`);
  }
}

export function setGoogleTranslate(targetLang) {
  if (typeof document === "undefined") return;
  const value = `/${GOOGLE_PAGE_LANG}/${targetLang}`;
  const host = window.location.hostname;
  setCookie(COOKIE, value);
  setCookie(COOKIE, value, host);
  if (host.includes(".")) {
    setCookie(COOKIE, value, `.${host}`);
  }
}

export function isGoogleLanguage(code) {
  return GOOGLE_LANGUAGES.some((l) => l.code === code);
}

let scriptLoading = false;

export function ensureGoogleTranslateScript() {
  if (typeof window === "undefined") return;
  if (window.google?.translate?.TranslateElement) {
    initGoogleTranslateElement();
    return;
  }
  if (scriptLoading || document.getElementById("google-translate-script")) return;

  scriptLoading = true;
  window.googleTranslateElementInit = initGoogleTranslateElement;

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.onerror = () => {
    scriptLoading = false;
  };
  document.body.appendChild(script);
}

function initGoogleTranslateElement() {
  if (!window.google?.translate?.TranslateElement) return;
  const host = document.getElementById("google_translate_element");
  if (!host) return;
  // Avoid double-init
  if (host.dataset.ready === "1") return;
  host.dataset.ready = "1";

  const included = GOOGLE_LANGUAGES.map((l) => l.code).join(",");
  // eslint-disable-next-line no-new
  new window.google.translate.TranslateElement(
    {
      pageLanguage: GOOGLE_PAGE_LANG,
      includedLanguages: included,
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "google_translate_element"
  );
}
