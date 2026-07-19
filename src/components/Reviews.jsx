import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const REVIEWS = [
  {
    name: "nicola n",
    when: "Jul 2025",
    quote:
      "Small well appointed room, clean, great food, reasonable prices, friendly staff. Menu with many specialties worth coming back for.",
  },
  {
    name: "mariaregina7",
    when: "Nov 2023",
    quote:
      "Excellent cuisine — not particularly spicy — with attentive service. Very interesting price. I will return with the family.",
  },
  {
    name: "Mayte Garcia",
    when: "Nov 2018",
    quote:
      "The food is outstanding. Amazing flavor and customer service first class. His owner speaks English, Italian, and more.",
  },
  {
    name: "asacur",
    when: "Oct 2018",
    quote:
      "Warm welcome. The ambience was superb. Mouth watering food — and the Indian chai made us feel at home whilst away from home.",
  },
];

export default function Reviews() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="reviews" ref={ref} className="relative py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-sh-surface">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-sh-chili font-semibold mb-5">
            {t("reviews.eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
            {t("reviews.title1")}
            <br />
            <span className="text-stroke-saffron">{t("reviews.title2")}</span>
          </h2>
        </div>
        <div className="md:text-end">
          <div className="font-display text-6xl text-sh-saffron">4.2</div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mt-1">
            {t("reviews.ratingLabel")}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
        {REVIEWS.map((r, i) => (
          <motion.blockquote
            key={r.name}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-sh-border pt-8"
          >
            <p className="font-editorial italic text-2xl md:text-[1.65rem] leading-snug text-sh-text/90">
              “{r.quote}”
            </p>
            <footer className="mt-6 flex items-center justify-between gap-4">
              <cite className="not-italic text-sm font-semibold tracking-wide uppercase">{r.name}</cite>
              <span className="text-[11px] uppercase tracking-[0.18em] text-sh-muted">{r.when}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
