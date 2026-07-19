import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";

export default function Atmosphere() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const stats = [
    { k: "4.2", l: t("atmosphere.stats.rating") },
    { k: "Halal", l: t("atmosphere.stats.halal") },
    { k: "$$", l: t("atmosphere.stats.value") },
    { k: "Zone 5", l: t("atmosphere.stats.zone") },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 bg-sh-bg overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 md:mb-20 max-w-3xl"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-sh-saffron font-semibold mb-5">
          {t("atmosphere.eyebrow")}
        </p>
        <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
          {t("atmosphere.title1")}
          <br />
          <span className="text-stroke-chili">{t("atmosphere.title2")}</span>
        </h2>
        <p className="font-editorial italic text-xl text-sh-muted mt-8 max-w-lg">
          {t("atmosphere.lead")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <motion.div style={{ y: y1 }} className="md:col-span-7 relative aspect-[16/10] overflow-hidden ring-1 ring-sh-saffron/15">
          <img src={IMG.dining} alt="" className="w-full h-full object-cover img-liquid" loading="lazy" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="md:col-span-5 relative aspect-[4/5] overflow-hidden md:mt-20 ring-1 ring-sh-chili/20">
          <img src={IMG.ambiance} alt="" className="w-full h-full object-cover img-liquid" loading="lazy" />
        </motion.div>
      </div>

      <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-sh-border pt-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="font-display text-4xl md:text-5xl text-sh-saffron uppercase">{s.k}</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mt-2">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
