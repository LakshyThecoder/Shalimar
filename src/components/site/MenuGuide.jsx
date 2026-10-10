import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";

const CHAPTER_IMAGES = [
  IMG.tandoori,
  IMG.curry,
  IMG.biryani,
  IMG.vegetarian,
  IMG.naan,
  IMG.desserts,
];

export default function MenuGuide() {
  const { site, t } = useSite();
  const guide = site.menuGuide || {};
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const chapters = guide.chapters || [];

  return (
    <section id="menus" ref={ref} className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-sh-surface scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-12 md:mb-16">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-sh-chili font-semibold mb-4">
            {t(guide.eyebrow)}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]">
            {t(guide.title)}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="bg-sh-chili text-white px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              {t(guide.ctaRestaurant)}
            </Link>
            <Link
              to="/menu"
              className="border border-sh-border px-5 py-3 text-xs uppercase tracking-[0.18em] hover:border-sh-saffron hover:text-sh-saffron"
            >
              {t(guide.ctaTakeaway)}
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="lg:col-span-7 relative aspect-[16/10] overflow-hidden ring-1 ring-sh-border"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9 }}
        >
          <img src={IMG.spices} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-sh-surface via-transparent to-transparent" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {chapters.map((ch, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: Math.min(i * 0.06, 0.3) }}
            className="group border border-sh-border bg-sh-bg/40 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={CHAPTER_IMAGES[i % CHAPTER_IMAGES.length]}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 start-4 text-[10px] uppercase tracking-[0.25em] text-sh-saffron">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-display text-2xl uppercase tracking-tight text-sh-saffron">
                {t(ch.title)}
              </h3>
              <p className="mt-3 text-sm text-sh-muted leading-relaxed flex-1">{t(ch.body)}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
