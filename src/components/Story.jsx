import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";
import TextReveal, { FadeUp } from "./TextReveal";

export default function Story() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="story" ref={ref} className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 bg-sh-bg overflow-hidden">
      <div className="absolute top-10 end-[-5%] w-[420px] h-[420px] indian-mandala opacity-[0.05] pointer-events-none spin-very-slow" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.35em] text-sh-saffron font-semibold mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-sh-saffron" />
              {t("story.eyebrow")}
            </p>
          </FadeUp>
          <TextReveal>
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
              {t("story.title1")}
            </h2>
          </TextReveal>
          <TextReveal delay={0.12}>
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter text-stroke-saffron">
              {t("story.title2")}
            </h2>
          </TextReveal>
          <FadeUp delay={0.2}>
            <p className="font-editorial italic text-xl md:text-2xl text-sh-muted mt-8 max-w-md leading-relaxed">
              {t("story.lead")}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 text-sh-muted/90 text-sm md:text-base leading-relaxed max-w-md">
              {t("story.body")}
            </p>
          </FadeUp>
        </div>

        <motion.div
          className="lg:col-span-7 order-1 lg:order-2 relative"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/3] overflow-hidden ring-1 ring-sh-saffron/25 filigree">
            <motion.img
              style={{ y: imgY }}
              src={IMG.spices}
              alt=""
              className="absolute inset-[-12%] w-[124%] h-[124%] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sh-bg/60 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -start-2 md:start-8 w-[55%] aspect-[3/4] overflow-hidden border border-sh-saffron/35 shadow-[0_30px_80px_rgba(0,0,0,0.55)] hidden sm:block">
            <img src={IMG.tandoori} alt="" className="w-full h-full object-cover img-liquid" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
