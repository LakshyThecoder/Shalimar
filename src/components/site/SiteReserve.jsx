import { useSite } from "../../context/SiteContent";

export default function SiteReserve() {
  const { site, t } = useSite();
  const loc = site.locations?.restaurant;
  if (!loc) return null;

  return (
    <section id="reserve" className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-sh-surface scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sh-chili font-semibold mb-4">
            {t(site.nav?.book)}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9]">
            {t({ en: "Call for", it: "Chiama per" })}
            <br />
            <span className="text-stroke-chili">{t({ en: "a table", it: "un tavolo" })}</span>
          </h2>
          <p className="mt-6 text-sh-muted max-w-md leading-relaxed">{t(loc.note)}</p>
        </div>
        <div className="lg:col-span-6 border border-sh-saffron/40 bg-sh-bg/60 p-8 md:p-10 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-sh-saffron">
            {t(loc.eyebrow)} · {loc.title}
          </p>
          {(loc.phones || []).map((p) => (
            <a key={p.tel} href={p.tel} className="block hover:text-sh-saffron transition-colors">
              <p className="font-display text-3xl md:text-5xl uppercase tracking-tight">{p.display}</p>
            </a>
          ))}
          <p className="text-xs uppercase tracking-[0.2em] text-sh-saffron font-semibold">
            {t(loc.ctaCall)} →
          </p>
        </div>
      </div>
    </section>
  );
}
