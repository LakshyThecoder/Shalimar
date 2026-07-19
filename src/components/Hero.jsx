import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import { IMG } from "../lib/images";
import Magnetic from "./Magnetic";
import EmberField from "./EmberField";

const word = {
  hidden: { y: "115%", rotateX: 48, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    rotateX: 0,
    opacity: 1,
    transition: { delay: 0.45 + i * 0.14, duration: 1.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.28]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [0.2, 0.9]);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.img
          src={IMG.hero}
          alt="Shalimar Milano"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          initial={{ scale: 1.4, filter: "brightness(0.25) saturate(0.8)" }}
          animate={{ scale: 1.05, filter: "brightness(0.95) saturate(1.1)" }}
          transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ scale: imgScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-sh-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50" />
        <div className="absolute inset-0 indian-glow opacity-50 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,9,8,0.55)_100%)]" />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      </motion.div>

      <EmberField count={22} className="z-[2]" />

      <motion.div
        className="relative z-10 px-5 sm:px-6 md:px-12 lg:px-16 flex flex-col justify-end min-h-[100svh] pb-14 sm:pb-16 md:pb-24 pt-28 sm:pt-32"
        style={{ y: textY, opacity: brandOpacity, perspective: "1400px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9 }}
          className="flex flex-wrap items-center gap-4 mb-5 text-[11px] uppercase tracking-[0.32em] text-sh-text/70"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sh-chili pulse-dot" />
            Viale Toscana 2
          </span>
          <span className="hidden sm:inline text-sh-border">|</span>
          <span className="text-sh-saffron font-semibold">Halal · Indian · Pakistani</span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.p
            variants={word}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-editorial italic text-sh-saffron text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2"
          >
            शालिमार
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            variants={word}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-[15vw] sm:text-[14vw] md:text-[12vw] lg:text-[10.5vw] leading-[0.82] tracking-tighter uppercase will-change-transform gold-shimmer"
          >
            Shalimar
          </motion.h1>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-[2px] origin-left max-w-[12rem] sm:max-w-md mt-4 sm:mt-6 bg-gradient-to-r from-sh-chili via-sh-saffron to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-6 md:mt-8 max-w-xl font-editorial italic text-lg sm:text-xl md:text-2xl lg:text-3xl text-sh-text/88 leading-snug"
        >
          {t("hero.tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 md:mt-12 flex flex-col xs:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto"
        >
          <Magnetic>
            <a
              href="#reserve"
              className="group inline-flex items-center justify-center gap-3 bg-sh-chili text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#e84a22] transition-all duration-300 shadow-[0_0_40px_rgba(217,64,26,0.35)] touch-manipulation min-h-[48px] w-full sm:w-auto"
            >
              {t("hero.ctaReserve")}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-3 border border-sh-text/25 px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold hover:border-sh-saffron hover:text-sh-saffron hover:bg-sh-saffron/5 transition-all duration-300 touch-manipulation min-h-[48px] w-full sm:w-auto"
            >
              {t("hero.ctaMenu")}
            </Link>
          </Magnetic>
        </motion.div>

        <motion.a
          href="#story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.8 }}
          className="absolute bottom-8 end-6 md:end-12 lg:end-16 hidden md:flex flex-col items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-sh-muted hover:text-sh-saffron transition-colors"
        >
          <span className="writing-vertical">{t("hero.scroll")}</span>
          <ArrowDown size={14} className="animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
}
