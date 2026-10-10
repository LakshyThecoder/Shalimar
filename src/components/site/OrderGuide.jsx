import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";

export default function OrderGuide() {
  const { site, t } = useSite();
  const guide = site.guide || {};
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const paragraphs = guide.paragraphs || [];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-sh-bg border-t border-sh-border">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <motion.div
          className="lg:col-span-5 relative aspect-[4/5] overflow-hidden ring-1 ring-sh-border order-1"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85 }}
        >
          <img src={IMG.thali} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-sh-bg/50 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="lg:col-span-7 order-2"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-sh-saffron font-semibold mb-4">
            {t(guide.eyebrow)}
          </p>
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-[0.9] max-w-xl">
            {t(guide.title)}
          </h2>

          <ul className="mt-10 space-y-0 border-t border-sh-border">
            {paragraphs.map((p, i) => (
              <li
                key={i}
                className="border-b border-sh-border py-4 flex gap-4 text-base md:text-lg text-sh-text/85 leading-relaxed"
              >
                <span className="font-display text-sh-saffron text-xl shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{t(p)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
