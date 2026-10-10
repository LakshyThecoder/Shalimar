import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";
import EmberField from "../EmberField";

export default function HomeHero() {
  const { site, t } = useSite();
  const hero = site.hero || {};
  const brand = site.brand || {};

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMG.hero}
          alt="Shalimar Milano — best Halal Indian restaurant and takeaway"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-sh-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/40" />
        <div className="absolute inset-0 indian-glow opacity-40 mix-blend-soft-light" />
      </div>
      <EmberField count={16} className="z-[2]" />

      <div className="relative z-10 px-5 sm:px-6 md:px-12 lg:px-16 flex flex-col justify-end min-h-[100svh] pb-14 sm:pb-20 pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-editorial italic text-sh-saffron text-xl sm:text-2xl mb-2"
        >
          {brand.hindi}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-[14vw] sm:text-[11vw] md:text-[9vw] leading-[0.85] tracking-tighter uppercase gold-shimmer"
        >
          {hero.title || brand.name}
        </motion.h1>
        <p className="mt-4 max-w-xl font-editorial italic text-xl md:text-2xl text-sh-text/90">
          {t(brand.tagline)}
        </p>

        <div className="mt-8 max-w-2xl space-y-2">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
            {t(hero.headline)}
          </h2>
          <p className="font-display text-2xl md:text-3xl uppercase tracking-tight text-sh-saffron">
            {t(hero.subhead)}
          </p>
          {(hero.paragraphs || []).map((p, i) => (
            <p key={i} className="text-sh-muted text-base md:text-lg leading-relaxed">
              {t(p)}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {(hero.cards || []).map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="border border-sh-border hover:border-sh-saffron px-4 py-3 text-xs uppercase tracking-[0.18em] transition-colors"
            >
              {t(card.label)}
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#reserve"
            className="inline-flex items-center justify-center bg-sh-chili text-white px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold"
          >
            {t(site.nav?.book)}
          </a>
          <a
            href="#takeaway"
            className="inline-flex items-center justify-center border border-sh-text/30 px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:border-sh-saffron hover:text-sh-saffron"
          >
            {t(site.nav?.orderTakeaway)}
          </a>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center border border-sh-border px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-sh-muted hover:text-sh-saffron"
          >
            {t(site.menuGuide?.ctaRestaurant)}
          </Link>
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-sh-saffron/90">
          {t(hero.tags)}
        </p>
      </div>
    </section>
  );
}
