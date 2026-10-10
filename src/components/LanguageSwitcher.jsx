import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ALL_LANGUAGES, LANGUAGES, getActiveLanguageMeta, selectLanguage } from "../i18n";
import FlagImg from "./FlagImg";

export default function LanguageSwitcher({ compact = false }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = getActiveLanguageMeta();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  const change = (code) => {
    selectLanguage(code);
    setOpen(false);
  };

  const extras = ALL_LANGUAGES.filter((l) => l.via === "google");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        data-cursor-hover
        aria-label={t("nav.language")}
        className={`inline-flex items-center gap-2 border border-sh-border/80 hover:border-sh-saffron text-sh-text/90 hover:text-sh-saffron transition-colors duration-300 touch-manipulation ${
          compact ? "px-2 py-2 text-[10px] min-h-[40px]" : "px-3 py-2 text-[11px] min-h-[42px]"
        } uppercase tracking-[0.14em]`}
      >
        <FlagImg country={current.country} label={current.label} className="w-6 h-4" />
        <span>{current.short}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-2 min-w-[240px] max-h-[70vh] overflow-y-auto bg-sh-surface border border-sh-border shadow-2xl z-[80] py-1.5">
          <p className="px-3.5 pt-2 pb-1 text-[9px] uppercase tracking-[0.18em] text-sh-muted">
            Italiano · English
          </p>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => change(l.code)}
              className={`w-full text-start px-3.5 py-3 text-sm transition-colors flex items-center gap-3 touch-manipulation min-h-[48px] ${
                current.code === l.code
                  ? "text-sh-saffron bg-sh-saffron/10"
                  : "text-sh-text/85 hover:bg-white/5 hover:text-sh-saffron"
              }`}
            >
              <FlagImg country={l.country} label={l.label} className="w-7 h-5" />
              <span className="font-semibold tracking-wide">{l.short}</span>
              <span className="text-sh-muted text-xs truncate">{l.label}</span>
            </button>
          ))}

          <div className="my-1.5 mx-3 border-t border-sh-border/80" />
          <p className="px-3.5 pt-1 pb-1 text-[9px] uppercase tracking-[0.18em] text-sh-muted">
            Google Translate
          </p>
          {extras.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => change(l.code)}
              className={`w-full text-start px-3.5 py-3 text-sm transition-colors flex items-center gap-3 touch-manipulation min-h-[48px] ${
                current.code === l.code
                  ? "text-sh-saffron bg-sh-saffron/10"
                  : "text-sh-text/85 hover:bg-white/5 hover:text-sh-saffron"
              }`}
            >
              <FlagImg country={l.country} label={l.label} className="w-7 h-5" />
              <span className="font-semibold tracking-wide">{l.short}</span>
              <span className="text-sh-muted text-xs truncate">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
