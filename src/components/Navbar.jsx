import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LINKS = [
    { label: t("nav.story"), href: "#story" },
    { label: t("nav.menu"), href: "/menu" },
    { label: t("nav.visit"), href: "#visit" },
    { label: t("nav.reviews"), href: "#reviews" },
  ];

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-2.5 sm:py-3" : "bg-transparent py-3.5 sm:py-5"
      }`}
    >
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 flex items-center justify-between gap-2 sm:gap-4">
        <a href="#top" className="flex items-center gap-2 group min-w-0">
          <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sh-saffron pulse-dot shrink-0" />
          <span className="font-display text-xl sm:text-2xl md:text-[26px] tracking-wide truncate">SHALIMAR</span>
          <span className="hidden lg:inline font-editorial italic text-sh-saffron text-sm -ms-1">
            शालिमार
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 lg:gap-9">
          {LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm uppercase tracking-[0.18em] text-sh-text/90 hover:text-sh-saffron transition-colors relative after:absolute after:start-0 after:-bottom-1 after:h-px after:w-0 hover:after:w-full after:bg-sh-saffron after:transition-all after:duration-300"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm uppercase tracking-[0.18em] text-sh-text/90 hover:text-sh-saffron transition-colors relative after:absolute after:start-0 after:-bottom-1 after:h-px after:w-0 hover:after:w-full after:bg-sh-saffron after:transition-all after:duration-300"
              >
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher compact />
          <a
            href="#reserve"
            className="hidden md:inline-flex items-center gap-2 bg-sh-chili text-white px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold hover:translate-y-[-2px] hover:bg-[#e84a22] transition-all duration-300"
          >
            {t("nav.reserve")}
            <span className="text-base leading-none">→</span>
          </a>
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 -me-2 text-sh-text"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-4 flex flex-col gap-4 glass border-t border-sh-border">
          {LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl uppercase tracking-wide"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl uppercase tracking-wide"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href="#reserve"
            onClick={() => setOpen(false)}
            className="bg-sh-chili text-white px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center"
          >
            {t("nav.reserveTable")}
          </a>
        </div>
      </div>
    </header>
  );
}
