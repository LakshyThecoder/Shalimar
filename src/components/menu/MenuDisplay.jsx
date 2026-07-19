import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { ALLERGENS, MENU_SECTIONS, formatPrice, getItemDesc } from "../../data/menu";
import LanguageSwitcher from "../LanguageSwitcher";
import EmberField from "../EmberField";
import MenuImage from "./MenuImage";
import { IMG, SECTION_IMAGES } from "../../lib/images";

const ACCENTS = {
  antipasti: "from-sh-chili/80",
  zuppe: "from-amber-800/80",
  tandoori: "from-sh-chili/85",
  vegetarian: "from-emerald-900/75",
  nonVegetarian: "from-orange-950/80",
  lamb: "from-red-950/80",
  rice: "from-sh-saffron/45",
  bread: "from-orange-900/70",
  burgers: "from-stone-900/80",
  desserts: "from-rose-950/70",
  fixedMenus: "from-sh-saffron/40",
  drinks: "from-sky-950/70",
};

const ease = [0.22, 1, 0.36, 1];

export default function MenuDisplay({ showPrices = false }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("it") ? "it" : "en";
  const sections = useMemo(() => MENU_SECTIONS, []);
  const [view, setView] = useState("index");
  const [allergenOpen, setAllergenOpen] = useState(false);

  const activeIndex = sections.findIndex((s) => s.id === view);
  const activeSection = activeIndex >= 0 ? sections[activeIndex] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const goSection = (id) => setView(id);
  const goIndex = () => setView("index");
  const goPrev = () => {
    if (activeIndex > 0) setView(sections[activeIndex - 1].id);
    else goIndex();
  };
  const goNext = () => {
    if (activeIndex < sections.length - 1) setView(sections[activeIndex + 1].id);
  };

  return (
    <div className="relative min-h-screen bg-sh-bg text-sh-text overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 indian-glow opacity-35" />
      <div className="pointer-events-none fixed inset-0 paisley-bg opacity-[0.03]" />

      <header className="sticky top-0 z-40 glass">
        <div className="px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {view !== "index" ? (
              <button
                type="button"
                onClick={goIndex}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sh-muted hover:text-sh-saffron transition-colors shrink-0"
              >
                <ChevronLeft size={16} />
                {t("menu.chapters")}
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-sh-saffron pulse-dot shrink-0" />
                <span className="font-display text-xl md:text-2xl tracking-wide">SHALIMAR</span>
              </Link>
            )}
            {showPrices && (
              <span className="text-[9px] uppercase tracking-[0.2em] text-sh-bg bg-sh-saffron px-2 py-0.5 font-semibold shrink-0">
                QR
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setAllergenOpen(true)}
              className="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-sh-muted hover:text-sh-chili border border-sh-border hover:border-sh-chili px-2.5 py-1.5 transition-colors"
            >
              {t("menu.allergenTitle")}
            </button>
            <LanguageSwitcher compact />
            <Link
              to="/"
              className="hidden md:inline text-[10px] uppercase tracking-[0.18em] text-sh-muted hover:text-sh-saffron transition-colors"
            >
              {t("menu.backHome")}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "index" ? (
          <motion.div
            key="index"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
          >
            <MenuIndex
              sections={sections}
              showPrices={showPrices}
              onOpen={goSection}
              onAllergens={() => setAllergenOpen(true)}
              t={t}
            />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease }}
          >
            <CategoryPage
              section={activeSection}
              index={activeIndex}
              total={sections.length}
              showPrices={showPrices}
              lang={lang}
              t={t}
              onPrev={goPrev}
              onNext={goNext}
              onIndex={goIndex}
              hasNext={activeIndex < sections.length - 1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AllergenModal open={allergenOpen} onClose={() => setAllergenOpen(false)} lang={lang} t={t} />
    </div>
  );
}

function MenuIndex({ sections, showPrices, onOpen, onAllergens, t }) {
  const featured = sections.find((s) => s.id === "fixedMenus");
  const regular = sections.filter((s) => s.id !== "fixedMenus");

  return (
    <>
      <section className="relative h-[30vh] sm:h-[34vh] md:h-[36vh] overflow-hidden flex items-end">
        <MenuImage src={IMG.spices} className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-sh-bg/70 to-black/40" />
        <EmberField count={10} />
        <div className="relative z-10 w-full px-5 md:px-10 lg:px-14 pb-8 pt-14">
          <p className="font-editorial italic text-sh-saffron text-xl mb-1">शालिमार</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter leading-[0.85]">
            {showPrices ? t("menu.qrTitle") : t("menu.title")}
          </h1>
          <p className="mt-2 max-w-md text-sh-muted text-sm">{t("menu.pickChapter")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-sh-saffron border border-sh-saffron/40 px-2.5 py-1">
              {t("menu.halalBadge")}
            </span>
            <button
              type="button"
              onClick={onAllergens}
              className="text-[10px] uppercase tracking-[0.18em] text-sh-muted hover:text-sh-chili transition-colors"
            >
              {t("menu.allergenTitle")} →
            </button>
          </div>
        </div>
      </section>

      {featured && (
        <section className="px-5 md:px-10 lg:px-14 py-7 md:py-9">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-sh-chili mb-1.5">{t("menu.featured")}</p>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
                {t("menu.categories.fixedMenus")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpen("fixedMenus")}
              className="text-[10px] uppercase tracking-[0.2em] text-sh-saffron inline-flex items-center gap-1"
            >
              {t("menu.open")} →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen("fixedMenus")}
                className="relative aspect-[5/4] overflow-hidden text-start group ring-1 ring-white/10 hover:ring-sh-saffron/50 transition-all"
              >
                <MenuImage
                  src={SECTION_IMAGES.fixedMenus}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                <div className="absolute inset-0 p-3.5 md:p-4 flex flex-col justify-end">
                  <span className="text-[10px] text-sh-saffron tracking-[0.2em]">0{i + 1}</span>
                  <h3 className="font-display text-lg md:text-xl uppercase tracking-tight leading-tight group-hover:text-sh-saffron transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-sh-text/70 mt-1 line-clamp-1">
                    {item.includes?.length || 0} {t("menu.includes").toLowerCase()}
                  </p>
                  {showPrices && (
                    <p className="font-display text-xl text-sh-saffron mt-1">{formatPrice(item.price)}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 md:px-10 lg:px-14 pb-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-sh-saffron mb-4">
          {t("menu.chapters")} · {regular.length}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {regular.map((section, i) => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => onOpen(section.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.5, ease }}
              className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden text-start ring-1 ring-white/10 hover:ring-sh-saffron/50 transition-all touch-manipulation active:scale-[0.98]"
            >
              <MenuImage
                src={SECTION_IMAGES[section.id] || IMG.spices}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${ACCENTS[section.id] || "from-black/80"} via-black/25 to-transparent`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-sh-saffron">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight leading-none mt-1 group-hover:text-sh-saffron transition-colors">
                  {t(`menu.categories.${section.id}`)}
                </h3>
                <p className="mt-1.5 text-[11px] text-sh-text/65 uppercase tracking-[0.12em]">
                  {section.items.length} {t("menu.dishes")}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryPage({
  section,
  index,
  total,
  showPrices,
  lang,
  t,
  onPrev,
  onNext,
  onIndex,
  hasNext,
}) {
  if (!section) return null;
  const img = SECTION_IMAGES[section.id] || IMG.spices;
  const accent = ACCENTS[section.id] || "from-black/80";

  return (
    <div className="pb-24">
      <section className="relative h-[24vh] sm:h-[28vh] md:h-[30vh] overflow-hidden">
        <MenuImage src={img} className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className={`absolute inset-0 bg-gradient-to-t ${accent} to-sh-bg`} />
        <div className="absolute inset-0 bg-gradient-to-t from-sh-bg via-transparent to-black/35" />
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-5 md:px-10 lg:px-14 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-sh-saffron mb-1">
            {t("menu.chapter")} {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter leading-[0.9]">
            {t(`menu.categories.${section.id}`)}
          </h1>
          {section.noteKey && (
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-sh-muted">{t(section.noteKey)}</p>
          )}
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-14 pt-6 md:pt-8">
        {section.isSetMenu ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {section.items.map((item) => (
              <article
                key={item.id}
                className="border border-sh-border bg-sh-surface/60 p-5 hover:border-sh-saffron/40 transition-colors h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-2xl uppercase tracking-tight">{item.name}</h3>
                  {showPrices && (
                    <span className="font-display text-2xl text-sh-saffron shrink-0">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
                {getItemDesc(item, lang) && (
                  <p className="text-sm text-sh-muted mb-3">{getItemDesc(item, lang)}</p>
                )}
                <ul className="space-y-1.5">
                  {item.includes?.map((line) => (
                    <li key={line} className="text-sm text-sh-text/85 flex gap-2">
                      <span className="text-sh-saffron shrink-0">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
            {section.items.map((item) => {
              const desc = getItemDesc(item, lang);
              return (
                <li
                  key={item.id}
                  className="py-3 border-b border-sh-border/60 flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg md:text-xl uppercase tracking-tight group-hover:text-sh-saffron transition-colors">
                        {item.name}
                      </h3>
                      {item.spicy && (
                        <span className="text-[9px] uppercase tracking-[0.14em] text-sh-chili border border-sh-chili/40 px-1.5 py-0.5">
                          {t("menu.spicy")}
                        </span>
                      )}
                    </div>
                    {desc ? (
                      <p className="text-sm text-sh-muted mt-0.5 leading-snug">{desc}</p>
                    ) : null}
                  </div>
                  {showPrices && (
                    <span className="font-display text-lg text-sh-saffron shrink-0 tabular-nums pt-0.5">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-sh-border bg-sh-bg/92 backdrop-blur-xl safe-bottom-nav">
        <div className="px-3 sm:px-4 md:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-2 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-sh-muted hover:text-sh-saffron transition-colors min-w-[4.5rem] min-h-[44px] touch-manipulation"
          >
            <ArrowLeft size={16} />
            <span className="truncate">{index === 0 ? t("menu.chapters") : t("menu.prev")}</span>
          </button>
          <button
            type="button"
            onClick={onIndex}
            className="text-[10px] uppercase tracking-[0.18em] text-sh-saffron border border-sh-saffron/40 px-3 sm:px-4 py-2.5 hover:bg-sh-saffron hover:text-sh-bg transition-colors min-h-[44px] touch-manipulation"
          >
            {t("menu.index")}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="inline-flex items-center justify-end gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-sh-muted hover:text-sh-saffron transition-colors disabled:opacity-30 disabled:pointer-events-none min-w-[4.5rem] min-h-[44px] touch-manipulation"
          >
            {t("menu.next")}
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>
    </div>
  );
}

function AllergenModal({ open, onClose, lang, t }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-end md:items-center justify-center p-0 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-sh-surface border border-sh-border p-6 md:p-10"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-sh-chili font-semibold mb-2">
                  {t("menu.allergenTitle")}
                </p>
                <p className="text-[11px] text-sh-muted">{t("menu.allergenReg")}</p>
              </div>
              <button type="button" onClick={onClose} className="text-sh-muted hover:text-sh-text text-xl">
                ×
              </button>
            </div>
            <p className="text-sm leading-relaxed text-sh-text/90 mb-6">{t("menu.allergenIntro")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
              {ALLERGENS.map((a) => (
                <li key={a.id} className="flex gap-2 text-sm text-sh-muted">
                  <span className="text-sh-saffron mt-1">◆</span>
                  <span>{lang === "it" ? a.it : a.en}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-[0.2em] text-sh-saffron">{t("menu.management")}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
