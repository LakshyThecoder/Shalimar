import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { RESTAURANT, TAKEAWAY } from "../data/locations";

export default function Reserve() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="reserve" ref={ref} className="relative py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-sh-surface scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-sh-chili font-semibold mb-5">
            {t("reserve.eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
            {t("reserve.title1")}
            <br />
            <span className="text-stroke-chili">{t("reserve.title2")}</span>
          </h2>
          <p className="font-editorial italic text-xl text-sh-muted mt-8 max-w-md">
            {t("reserve.lead")}
          </p>
          <p className="text-sm text-sh-muted mt-4 max-w-md">
            {t("reserve.takeawayNote")}{" "}
            <a href={TAKEAWAY.tel} className="text-sh-saffron hover:underline">
              {TAKEAWAY.phone}
            </a>
          </p>
        </motion.div>

        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="border border-sh-saffron/40 bg-sh-bg/60 p-8 md:p-12 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-sh-saffron">
              {t("menu.branch.restaurantKind")} · {RESTAURANT.street}
            </p>
            {RESTAURANT.phones.map((p) => (
              <a
                key={p.tel}
                href={p.tel}
                className="block hover:text-sh-saffron transition-colors"
              >
                <p className="font-display text-3xl md:text-5xl uppercase tracking-tight text-sh-text">
                  {p.display}
                </p>
              </a>
            ))}
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-sh-saffron">
              {t("footer.call")} →
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
