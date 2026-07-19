import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language?.slice(0, 2)) || LANGUAGES[0];

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
    i18n.changeLanguage(code);
    localStorage.setItem("shalimar_lang_picked", code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        data-cursor-hover
        aria-label={t("nav.language")}
        className={`inline-flex items-center gap-1.5 border border-sh-border/80 hover:border-sh-saffron text-sh-text/90 hover:text-sh-saffron transition-colors duration-300 touch-manipulation ${
          compact ? "px-2 py-2 text-[10px] min-h-[40px]" : "px-3 py-2 text-[11px] min-h-[42px]"
        } uppercase tracking-[0.14em]`}
      >
        <span className="text-[1.25rem] leading-none" role="img" aria-label={current.label}>
          {current.flag}
        </span>
        <span>{current.short}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-2 min-w-[220px] max-h-[70vh] overflow-y-auto bg-sh-surface border border-sh-border shadow-2xl z-[80] py-1.5">
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
              <span className="text-2xl leading-none shrink-0" role="img" aria-label={l.label}>
                {l.flag}
              </span>
              <span className="font-semibold tracking-wide">{l.short}</span>
              <span className="text-sh-muted text-xs truncate">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
