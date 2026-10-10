import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../../context/SiteContent";

export default function SiteReviews() {
  const { site, t } = useSite();
  const reviews = site.reviews || {};
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="reviews" ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-sh-surface scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="max-w-3xl mb-10"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-sh-chili font-semibold mb-4">
          {t(reviews.eyebrow)}
        </p>
        <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-[0.9]">
          {t(reviews.title)}
        </h2>
        <p className="mt-6 text-sh-muted leading-relaxed">{t(reviews.restaurantNote)}</p>
        <p className="mt-3 text-sh-text/90 font-semibold">{t(reviews.restaurantScore)}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {(reviews.quotes || []).map((q, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * i }}
            className="border-t border-sh-border pt-6"
          >
            <p className="font-editorial italic text-2xl leading-snug">“{t(q.text)}”</p>
            <footer className="mt-5 text-sm uppercase tracking-[0.14em] text-sh-muted">
              {q.author} · {q.source}
            </footer>
          </motion.blockquote>
        ))}
      </div>

      <div className="max-w-3xl space-y-3 text-sh-muted leading-relaxed">
        <p className="text-sh-text/90 font-semibold">{t(reviews.takeawayScore)}</p>
        <p>{t(reviews.takeawayNote)}</p>
        <p className="text-sm">{t(reviews.footnote)}</p>
      </div>
    </section>
  );
}
