import { useState, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";
import TextReveal, { FadeUp } from "./TextReveal";

const DISH_KEYS = [
  { id: "tandoori", img: IMG.tandoori },
  { id: "biryani", img: IMG.biryani },
  { id: "curry", img: IMG.curry },
  { id: "naan", img: IMG.naan },
  { id: "thali", img: IMG.thali },
];

export default function Signatures() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const dish = DISH_KEYS[active];

  return (
    <section id="signatures" ref={ref} className="relative py-24 md:py-36 bg-sh-surface overflow-hidden">
      <div className="absolute inset-0 paisley-bg opacity-[0.03] pointer-events-none" />
      <div className="px-6 md:px-12 lg:px-16 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative">
        <div>
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.35em] text-sh-chili font-semibold mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-sh-chili" />
              {t("signatures.eyebrow")}
            </p>
          </FadeUp>
          <TextReveal>
            <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.88] tracking-tighter">
              {t("signatures.title1")}
            </h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.88] tracking-tighter text-stroke">
              {t("signatures.title2")}
            </h2>
          </TextReveal>
        </div>
        <FadeUp delay={0.2}>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-sh-saffron border-b border-sh-saffron/40 pb-1 hover:border-sh-saffron hover:gap-3 transition-all"
          >
            {t("menu.viewFull")} →
          </Link>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[75vh] relative">
        <div className="lg:col-span-5 px-6 md:px-12 lg:px-16 flex flex-col justify-center order-2 lg:order-1 py-10 lg:py-0">
          <ul className="space-y-1">
            {DISH_KEYS.map((d, i) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  data-cursor-hover
                  className={`w-full text-start py-4 border-b border-sh-border transition-all duration-500 ${
                    active === i ? "opacity-100" : "opacity-40 hover:opacity-75"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span
                      className={`font-display text-3xl md:text-5xl uppercase tracking-tight transition-colors duration-500 ${
                        active === i ? "text-sh-saffron" : "text-sh-text"
                      }`}
                    >
                      {t(`signatures.dishes.${d.id}.name`)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-sh-muted shrink-0">
                      0{i + 1}
                    </span>
                  </span>
                  {active === i && (
                    <motion.span
                      layoutId="sigLine"
                      className="block h-px bg-gradient-to-r from-sh-saffron to-transparent mt-3"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <AnimatePresence mode="wait">
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-sh-saffron mb-3">
                {t(`signatures.dishes.${dish.id}.tag`)}
              </p>
              <p className="font-editorial italic text-xl md:text-2xl text-sh-muted max-w-md leading-snug">
                {t(`signatures.dishes.${dish.id}.blurb`)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 relative min-h-[52vh] lg:min-h-full order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={dish.id}
              src={dish.img}
              alt=""
              initial={{ opacity: 0, scale: 1.12, filter: "blur(10px) brightness(0.7)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-sh-surface via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-sh-surface/85 via-transparent to-transparent lg:hidden" />
          <div className="absolute bottom-6 end-6 hidden md:block">
            <div className="w-24 h-24 rounded-full border border-sh-saffron/40 flex items-center justify-center spin-very-slow">
              <span className="font-editorial italic text-sh-saffron text-sm text-center leading-tight">
                शालिमार
                <br />
                Halal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
