import { useEffect } from "react";
import { ensureGoogleTranslateScript, getGoogleLang, isGoogleLanguage } from "../i18n/googleTranslate";

/** Hidden Google Translate host — powers extra languages beyond IT/EN. */
export default function GoogleTranslate() {
  useEffect(() => {
    const active = getGoogleLang();
    // Load script when a Google language is active, or pre-warm for faster switch
    if (active && isGoogleLanguage(active)) {
      ensureGoogleTranslateScript();
    } else {
      // Still mount the element so first Google pick can init after reload
      ensureGoogleTranslateScript();
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      className="google-translate-host"
    />
  );
}
