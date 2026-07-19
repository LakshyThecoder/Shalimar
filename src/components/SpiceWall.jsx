import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";
import TextReveal from "./TextReveal";

const SHOTS = [
  { src: IMG.tandoori, label: "Tandoor" },
  { src: IMG.biryani, label: "Biryani" },
  { src: IMG.spices, label: "Masala" },
  { src: IMG.naan, label: "Naan" },
  { src: IMG.curry, label: "Curry" },
  { src: IMG.thali, label: "Thali" },
];

export default function SpiceWall() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section ref={ref} className="relative py-20 md:py-28 bg-sh-bg overflow-hidden">
      <div className="px-6 md:px-12 lg:px-16 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-sh-saffron font-semibold mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-sh-saffron" />
            Masala · Fire · Milano
          </p>
          <TextReveal>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]">
              Color. Heat.
              <br />
              <span className="text-stroke-saffron">Soul.</span>
            </h2>
          </TextReveal>
        </div>
        <p className="font-editorial italic text-xl text-sh-muted max-w-sm">
          {t("story.lead")}
        </p>
      </div>

      <motion.div style={{ x }} className="flex gap-3 md:gap-4 w-max ps-6 md:ps-12 lg:ps-16 pe-6">
        {SHOTS.map((shot, i) => (
          <motion.figure
            key={shot.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ delay: i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden ring-1 ring-sh-saffron/15 ${
              i % 2 === 0 ? "w-[70vw] md:w-[28vw] aspect-[3/4]" : "w-[70vw] md:w-[32vw] aspect-[4/5] mt-10"
            }`}
          >
            <img
              src={shot.src}
              alt={shot.label}
              className="w-full h-full object-cover img-liquid"
              loading="lazy"
            />
            <figcaption className="absolute bottom-0 inset-x-0 p-4 md:p-5 bg-gradient-to-t from-black/80 to-transparent">
              <span className="font-display text-2xl uppercase tracking-wide text-sh-saffron">
                {shot.label}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
