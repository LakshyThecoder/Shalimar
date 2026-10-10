import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";
import { RESTAURANT, TAKEAWAY } from "../data/locations";

const RESTAURANT_HOURS = [
  { day: "sunday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
  { day: "monday", hours: "closed" },
  { day: "tuesday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
  { day: "wednesday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
  { day: "thursday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
  { day: "friday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
  { day: "saturday", hours: "11:30 – 14:20 · 14:30 – 22:30" },
];

const TAKEAWAY_HOURS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
].map((day) => ({ day, hours: "11:30 – 21:30" }));

export default function Visit() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="visit" ref={ref} className="relative py-24 md:py-32 bg-sh-bg overflow-hidden scroll-mt-24">
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-12 md:mb-16">
          <motion.div
            className="lg:col-span-5"
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
            <p className="font-editorial italic text-xl text-sh-muted mt-6 max-w-md">
              {t("visit.placesLead")}
            </p>
          </motion.div>
          <div className="lg:col-span-7 relative min-h-[28vh] md:min-h-[34vh] overflow-hidden">
            <img src={IMG.milan} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-sh-bg/20 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <LocationCard
            id="restaurant"
            kind={t("menu.branch.restaurantKind")}
            name={t("menu.branch.restaurant")}
            place={RESTAURANT}
            inView={inView}
            delay={0.05}
          >
            <HoursList rows={RESTAURANT_HOURS} t={t} />
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href="#reserve"
                className="text-xs uppercase tracking-[0.22em] font-semibold text-sh-saffron hover:gap-3 transition-all"
              >
                {t("nav.reserve")} →
              </a>
              <Link
                to="/menu"
                className="text-xs uppercase tracking-[0.22em] font-semibold text-sh-text/80 hover:text-sh-saffron transition-colors"
              >
                {t("nav.menu")} →
              </Link>
              <a
                href={RESTAURANT.maps}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.22em] text-sh-muted hover:text-sh-saffron transition-colors"
              >
                {t("visit.maps")}
              </a>
            </div>
          </LocationCard>

          <LocationCard
            id="takeaway"
            kind={t("menu.branch.takeawayKind")}
            name={t("menu.branch.takeaway")}
            place={TAKEAWAY}
            inView={inView}
            delay={0.15}
          >
            <HoursList rows={TAKEAWAY_HOURS} t={t} />
            <p className="mt-4 text-sm text-sh-muted leading-relaxed max-w-sm">
              {t("visit.takeawayNote")}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={TAKEAWAY.tel}
                className="text-xs uppercase tracking-[0.22em] font-semibold text-sh-saffron transition-colors"
              >
                {t("footer.call")} →
              </a>
              <Link
                to="/menu"
                className="text-xs uppercase tracking-[0.22em] font-semibold text-sh-text/80 hover:text-sh-saffron transition-colors"
              >
                {t("nav.menu")} →
              </Link>
              <a
                href={TAKEAWAY.maps}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.22em] text-sh-muted hover:text-sh-saffron transition-colors"
              >
                {t("visit.maps")}
              </a>
            </div>
          </LocationCard>
        </div>
      </div>
    </section>
  );
}

function HoursList({ rows, t }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.22em] text-sh-muted mt-8 mb-4">{t("visit.hours")}</p>
      <ul className="space-y-2">
        {rows.map((h) => (
          <li key={h.day} className="flex justify-between gap-6 text-sm">
            <span className={h.hours === "closed" ? "text-sh-muted" : ""}>
              {t(`visit.days.${h.day}`)}
            </span>
            <span className={h.hours === "closed" ? "text-sh-chili" : "text-sh-muted"}>
              {h.hours === "closed" ? t("visit.closed") : h.hours}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function LocationCard({ id, kind, name, place, inView, delay, children }) {
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="border border-sh-border bg-sh-surface/50 p-6 md:p-8 scroll-mt-28 flex flex-col"
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-sh-saffron">{kind}</p>
      <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tight leading-none mt-2">
        {name}
      </h3>
      <p className="mt-5 text-lg">
        {place.street}
        <br />
        <span className="text-sh-muted text-base">{place.area}</span>
      </p>
      <div className="mt-3 flex flex-col gap-1">
        {(place.phones || [{ display: place.phone, tel: place.tel }]).map((p) => (
          <a
            key={p.tel}
            href={p.tel}
            className="inline-block text-lg hover:text-sh-saffron transition-colors"
          >
            {p.display}
          </a>
        ))}
      </div>
      {children}
    </motion.article>
  );
}
