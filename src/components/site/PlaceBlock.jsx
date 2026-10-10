import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";

export default function PlaceBlock({ kind }) {
  const { site, t } = useSite();
  const data = kind === "takeaway" ? site.takeaway : site.restaurant;
  const loc = kind === "takeaway" ? site.locations?.takeaway : site.locations?.restaurant;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const img = kind === "takeaway" ? IMG.ambiance : IMG.dining;
  /** Takeaway: photo left. Restaurant: photo right. */
  const imageLeft = kind === "takeaway";

  if (!data) return null;

  return (
    <section
      id={kind}
      ref={ref}
      className="relative py-20 md:py-28 px-6 md:px-12 lg:px-16 scroll-mt-24 border-t border-sh-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <motion.div
          className={`lg:col-span-6 relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden ring-1 ring-sh-border ${
            imageLeft ? "order-1" : "order-1 lg:order-2"
          }`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <img
            src={img}
            alt={
              kind === "takeaway"
                ? "Shalimar Porta Romana — Halal Indian takeaway Milano"
                : "Shalimar Viale Toscana — Halal Indian restaurant Milano"
            }
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sh-bg/35 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <motion.div
          className={`lg:col-span-6 ${imageLeft ? "order-2" : "order-2 lg:order-1"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-sh-saffron font-semibold mb-4">
            {t(data.eyebrow)}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
            {t(data.title)}
          </h2>
          <p className="font-editorial italic text-xl md:text-2xl text-sh-muted mt-6 max-w-xl">
            {t(data.lead)}
          </p>
          <div className="mt-6 space-y-4 max-w-xl text-sh-text/85 leading-relaxed">
            {(data.paragraphs || []).map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          <p className="mt-6 text-lg">{data.addressLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {kind === "restaurant" ? (
              <>
                <a
                  href="#reserve"
                  className="bg-sh-saffron text-sh-bg px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold"
                >
                  {t(data.ctaBook)}
                </a>
                <Link
                  to="/menu"
                  className="border border-sh-border px-5 py-3 text-xs uppercase tracking-[0.18em] hover:border-sh-saffron hover:text-sh-saffron"
                >
                  {t(data.ctaMenu)}
                </Link>
              </>
            ) : (
              <>
                <a
                  href={
                    loc?.orderUrl ||
                    site.links?.orderOnline ||
                    loc?.phones?.[0]?.tel ||
                    "#"
                  }
                  target={loc?.orderUrl || site.links?.orderOnline ? "_blank" : undefined}
                  rel={loc?.orderUrl || site.links?.orderOnline ? "noreferrer" : undefined}
                  className="bg-sh-saffron text-sh-bg px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold"
                >
                  {t(data.ctaOrder)}
                </a>
                <Link
                  to="/menu"
                  className="border border-sh-border px-5 py-3 text-xs uppercase tracking-[0.18em] hover:border-sh-saffron hover:text-sh-saffron"
                >
                  {t(data.ctaMenu)}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
