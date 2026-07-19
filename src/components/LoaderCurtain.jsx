import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LoaderCurtain() {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="curtain"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-sh-bg flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 indian-glow opacity-50" />
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/[0.03] last:border-r-0" />
            ))}
          </div>

          <div className="text-center px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.4em] text-sh-muted mb-6"
            >
              {t("loader.line")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl uppercase leading-none tracking-tighter"
            >
              SHALIMAR
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="font-editorial italic text-sh-saffron text-xl md:text-2xl mt-2"
            >
              शालिमार
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="origin-left mt-8 h-px bg-sh-saffron mx-auto"
              style={{ maxWidth: 420 }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 font-editorial italic text-sh-muted text-lg"
            >
              {t("loader.sub")}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
