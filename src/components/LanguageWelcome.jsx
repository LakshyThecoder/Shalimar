import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LANGUAGES, applyDocumentDirection } from "../i18n";

const STORAGE_KEY = "shalimar_lang_picked";

export default function LanguageWelcome() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const picked = localStorage.getItem(STORAGE_KEY);
    if (!picked) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const choose = (code) => {
    i18n.changeLanguage(code);
    applyDocumentDirection(code);
    localStorage.setItem(STORAGE_KEY, code);
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
                  <span className="text-3xl sm:text-4xl leading-none shrink-0" role="img" aria-label={l.label}>
                    {l.flag}
                  </span>
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
