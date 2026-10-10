import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContent";
import { IMG } from "../../lib/images";

export default function SiteFooter() {
  const { site, t } = useSite();
  const year = new Date().getFullYear();
  const restaurant = site.locations?.restaurant;
  const takeaway = site.locations?.takeaway;

  return (
    <footer className="relative bg-sh-bg border-t border-sh-border overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={IMG.chai} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-sh-bg/90 to-sh-bg" />
      </div>

      <div className="relative px-6 md:px-12 lg:px-16 pt-20 pb-10">
        <div className="mb-12">
          <p className="font-editorial italic text-sh-saffron text-xl">{site.brand?.hindi}</p>
          <h2 className="font-display text-[16vw] md:text-[10vw] leading-[0.8] uppercase tracking-tighter gold-shimmer">
            {site.brand?.name}
          </h2>
          <p className="mt-4 text-sh-muted max-w-md">{t(site.brand?.footerLine)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-sh-border/80 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sh-saffron mb-3">
              {t(restaurant?.eyebrow)}
            </p>
            <p>{restaurant?.title}</p>
            {(restaurant?.phones || []).map((p) => (
              <a key={p.tel} href={p.tel} className="block hover:text-sh-saffron mt-1">
                {p.display}
              </a>
            ))}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sh-saffron mb-3">
              {t(takeaway?.eyebrow)}
            </p>
            <p>{takeaway?.title}</p>
            {(takeaway?.phones || []).map((p) => (
              <a key={p.tel} href={p.tel} className="block hover:text-sh-saffron mt-1">
                {p.display}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <Link to="/menu" className="block hover:text-sh-saffron">
              {t(site.menuGuide?.ctaRestaurant)}
            </Link>
            <Link to="/menu" className="block hover:text-sh-saffron">
              {t(site.menuGuide?.ctaTakeaway)}
            </Link>
            <a href="#reserve" className="block hover:text-sh-saffron">
              {t(site.nav?.book)}
            </a>
            <a
              href={takeaway?.orderUrl || takeaway?.phones?.[0]?.tel}
              className="block hover:text-sh-saffron"
            >
              {t(takeaway?.ctaOrder)}
            </a>
          </div>
          <div className="space-y-2">
            <a href="#visit" className="block hover:text-sh-saffron">
              {t({ en: "Locations", it: "Dove siamo" })}
            </a>
            <a href="#visit" className="block hover:text-sh-saffron">
              {t({ en: "Contact", it: "Contatti" })}
            </a>
          </div>
        </div>

        <p className="pt-8 text-[11px] uppercase tracking-[0.18em] text-sh-muted">
          {t(site.footer?.copyright).replace("{{year}}", String(year))}
        </p>
      </div>
    </footer>
  );
}
