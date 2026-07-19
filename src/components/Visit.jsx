import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";

const HOUR_KEYS = [
  { day: "sunday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
  { day: "monday", hours: "closed" },
  { day: "tuesday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
  { day: "wednesday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
  { day: "thursday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
  { day: "friday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
  { day: "saturday", hours: "11:30 – 14:20 · 18:00 – 22:10" },
];

export default function Visit() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="visit" ref={ref} className="relative py-24 md:py-32 bg-sh-bg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="relative min-h-[45vh] lg:min-h-full">
          <img src={IMG.milan} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-sh-bg/90 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-transparent to-transparent lg:hidden" />
        </div>

        <div className="px-6 md:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-sh-saffron font-semibold mb-5">
              {t("visit.eyebrow")}
            </p>
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
              {t("visit.title1")}
              <br />
              <span className="text-stroke">{t("visit.title2")}</span>
            </h2>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mb-2">{t("visit.address")}</p>
                <p className="text-lg md:text-xl">
                  Viale Toscana 2
                  <br />
                  20136 Milan, Italy
                  <br />
                  <span className="text-sh-muted text-base">Zone 5</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mb-2">{t("visit.contact")}</p>
                <a href="tel:+393391785899" className="text-lg md:text-xl hover:text-sh-saffron transition-colors">
                  +39 339 178 5899
                </a>
              </div>
            </div>

            <div className="mt-12 border-t border-sh-border pt-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mb-5">{t("visit.hours")}</p>
              <ul className="space-y-2.5">
                {HOUR_KEYS.map((h) => (
                  <li key={h.day} className="flex justify-between gap-6 text-sm md:text-base">
                    <span className={h.hours === "closed" ? "text-sh-muted" : ""}>
                      {t(`visit.days.${h.day}`)}
                    </span>
                    <span className={h.hours === "closed" ? "text-sh-chili" : "text-sh-muted"}>
                      {h.hours === "closed" ? t("visit.closed") : h.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Viale+Toscana+2+20136+Milan"
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-10 items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-sh-saffron hover:gap-3 transition-all"
            >
              {t("visit.maps")} →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
