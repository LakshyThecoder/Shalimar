import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMG } from "../lib/images";
import Magnetic from "./Magnetic";
import EmberField from "./EmberField";

export default function Footer() {
  const { t } = useTranslation();
  const cuisine = t("footer.cuisineItems", { returnObjects: true });
  const cuisineItems = Array.isArray(cuisine) ? cuisine : [];

  return (
    <footer className="relative bg-sh-bg border-t border-sh-border overflow-hidden">
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <img src={IMG.chai} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-sh-bg/92 to-sh-bg" />
      </div>
      <div className="absolute inset-0 indian-glow opacity-40 pointer-events-none" />
      <EmberField count={10} />

      <div className="relative px-6 md:px-12 lg:px-16 pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-sh-saffron mb-4">
              {t("footer.eyebrow")}
            </p>
            <h2 className="font-display text-[18vw] md:text-[11vw] leading-[0.78] tracking-tighter uppercase gold-shimmer">
              {t("footer.title1")}
            </h2>
            <h2 className="font-display text-[18vw] md:text-[11vw] leading-[0.78] tracking-tighter uppercase text-stroke-saffron">
              {t("footer.title2")}
            </h2>
            <p className="font-editorial italic text-sh-saffron text-2xl mt-4">शालिमार</p>
          </div>
          <div className="flex flex-col gap-3">
            <Magnetic>
              <a
                href="#reserve"
                className="inline-flex items-center justify-center gap-3 bg-sh-saffron text-sh-bg px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-sh-turmeric transition-colors shadow-[0_0_40px_rgba(232,163,23,0.3)]"
              >
                {t("footer.cta")} →
              </a>
            </Magnetic>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 border border-sh-border px-8 py-3.5 text-xs uppercase tracking-[0.22em] hover:border-sh-saffron hover:text-sh-saffron transition-colors"
            >
              {t("menu.viewFull")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-sh-border/80 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mb-3">{t("footer.navigate")}</p>
            <ul className="space-y-2">
              <li><a href="#story" className="hover:text-sh-saffron transition-colors">{t("nav.story")}</a></li>
              <li><Link to="/menu" className="hover:text-sh-saffron transition-colors">{t("nav.menu")}</Link></li>
              <li><a href="#visit" className="hover:text-sh-saffron transition-colors">{t("nav.visit")}</a></li>
              <li><a href="#reserve" className="hover:text-sh-saffron transition-colors">{t("nav.reserve")}</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mb-3">{t("footer.cuisine")}</p>
            <ul className="space-y-2 text-sh-muted">
              {cuisineItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mb-3">{t("footer.address")}</p>
            <p className="text-sh-muted leading-relaxed">
              Viale Toscana 2
              <br />
              20136 Milan
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sh-muted mb-3">{t("footer.call")}</p>
            <a href="tel:+393391785899" className="hover:text-sh-saffron transition-colors">
              +39 339 178 5899
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-sh-muted">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span className="font-editorial italic normal-case tracking-normal text-sm">
            {t("footer.credit")}
          </span>
        </div>
      </div>
    </footer>
  );
}
