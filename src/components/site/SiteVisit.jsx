import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";

function LocationCard({ data, inView, delay, id }) {
  const { t } = useSite();
  if (!data) return null;

  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7 }}
      className="border border-sh-border bg-sh-surface/50 p-6 md:p-8 flex flex-col"
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-sh-saffron">{t(data.eyebrow)}</p>
      <h3 className="font-display text-4xl uppercase tracking-tight mt-2">{data.title}</h3>
      <p className="text-sh-muted mt-1">{data.area}</p>

      <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mt-6 mb-2">
        {t({ en: "Telephone", it: "Telefono" })}
      </p>
      <div className="flex flex-col gap-1">
        {(data.phones || []).map((p) => (
          <a key={p.tel} href={p.tel} className="text-lg hover:text-sh-saffron transition-colors">
            {p.display}
          </a>
        ))}
      </div>

      <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mt-6 mb-2">
        {t(data.hoursLabel)}
      </p>
      <ul className="space-y-2">
        {(data.hours || []).map((h, i) => (
          <li key={i} className="flex justify-between gap-4 text-sm">
            <span>{t(h.label)}</span>
            <span className={h.closed ? "text-sh-chili" : "text-sh-muted text-end"}>{t(h.value)}</span>
          </li>
        ))}
      </ul>

      {data.note && <p className="mt-4 text-sm text-sh-muted">{t(data.note)}</p>}
      {data.note2 && <p className="mt-2 text-sm text-sh-muted">{t(data.note2)}</p>}

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
        <a href={data.phones?.[0]?.tel} className="text-xs uppercase tracking-[0.18em] text-sh-saffron font-semibold">
          {t(data.ctaCall)} →
        </a>
        {data.ctaOrder && (
          <a
            href={data.orderUrl || data.phones?.[0]?.tel}
            className="text-xs uppercase tracking-[0.18em] text-sh-text/80 hover:text-sh-saffron"
          >
            {t(data.ctaOrder)}
          </a>
        )}
        <a
          href={data.maps}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.18em] text-sh-muted hover:text-sh-saffron"
        >
          {t(data.ctaMaps)}
        </a>
      </div>
    </motion.article>
  );
}

export default function SiteVisit() {
  const { site, t } = useSite();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="visit" ref={ref} className="relative py-20 md:py-28 bg-sh-bg scroll-mt-24">
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-end">
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-sh-saffron font-semibold mb-4">
              {t({ en: "Locations", it: "Dove siamo" })}
            </p>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]">
              {t({ en: "Find us", it: "Ci trovi" })}
              <br />
              <span className="text-stroke">{t({ en: "in Milan", it: "a Milano" })}</span>
            </h2>
          </div>
          <div className="lg:col-span-7 relative min-h-[24vh] overflow-hidden">
            <img src={IMG.milan} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-transparent to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <LocationCard data={site.locations?.restaurant} inView={inView} delay={0.05} />
          <LocationCard data={site.locations?.takeaway} inView={inView} delay={0.12} />
        </div>
      </div>
    </section>
  );
}
