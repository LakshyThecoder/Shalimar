import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LANGUAGES, applyDocumentDirection } from "../i18n";
import FlagImg from "./FlagImg";

const STORAGE_KEY = "shalimar_lang_picked";

/** Routes that should always ask for language on open (QR guests land here directly). */
const FORCE_ASK = ["/qrmenu", "/menu"];

export default function LanguageWelcome() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const force = FORCE_ASK.includes(location.pathname);
    const picked = localStorage.getItem(STORAGE_KEY);
    const sessionKey = `shalimar_lang_asked_${location.pathname}`;
    const askedThisVisit = sessionStorage.getItem(sessionKey);

    if (force && !askedThisVisit) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    } else if (!force && !picked) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setOpen(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [location.pathname]);

  const choose = (code) => {
    i18n.changeLanguage(code);
    applyDocumentDirection(code);
    localStorage.setItem(STORAGE_KEY, code);
    sessionStorage.setItem(`shalimar_lang_asked_${location.pathname}`, "1");
    setOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-sh-bg" />
          <div className="absolute inset-0 indian-glow opacity-60" />
          <div className="absolute inset-0 paisley-bg opacity-[0.04]" />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg sm:max-w-xl bg-sh-surface border border-sh-border sm:rounded-sm max-h-[92svh] overflow-y-auto safe-pb"
          >
            <div className="px-5 pt-8 pb-3 sm:px-8 sm:pt-10 text-center">
              <p className="font-editorial italic text-sh-saffron text-lg sm:text-xl mb-2">शालिमार</p>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tighter leading-none">
                Shalimar
              </h1>
              {FORCE_ASK.includes(location.pathname) && (
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-sh-chili">
                  {location.pathname === "/qrmenu" ? "QR Menu" : "Menu"}
                </p>
              )}
              <p className="mt-4 text-[11px] sm:text-xs uppercase tracking-[0.22em] text-sh-muted leading-relaxed">
                Scegli la lingua · Choose your language
              </p>
              <p className="mt-1 text-[11px] text-sh-muted/80 tracking-wide">
                اختر اللغة · भाषा चुनें
              </p>
            </div>

            <div className="px-4 sm:px-6 pb-6 sm:pb-8 grid grid-cols-2 gap-2.5 sm:gap-3">
              {LANGUAGES.map((l, i) => (
                <motion.button
                  key={l.code}
                  type="button"
                  onClick={() => choose(l.code)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="flex items-center gap-3 px-3.5 py-3.5 sm:py-4 border border-sh-border bg-sh-bg/50 hover:border-sh-saffron hover:bg-sh-saffron/10 active:scale-[0.98] transition-all text-start touch-manipulation"
                >
                  <FlagImg country={l.country} label={l.label} className="w-10 h-7 sm:w-11 sm:h-8" />
                  <span className="min-w-0">
                    <span className="block font-display text-lg sm:text-xl uppercase tracking-tight leading-none">
                      {l.short}
                    </span>
                    <span className="block text-xs text-sh-muted mt-1 truncate">{l.label}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
