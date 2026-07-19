import { useTranslation } from "react-i18next";

export default function MarqueeStrip({ variant = "solid" }) {
  const { t } = useTranslation();
  const items = t("marquee.items", { returnObjects: true });
  const list = Array.isArray(items) ? items : [];
  const loop = [...list, ...list, ...list];

  return (
    <div
      className={`relative border-y border-sh-border overflow-hidden ${
        variant === "solid" ? "bg-sh-chili text-white" : "bg-sh-bg text-sh-text"
      }`}
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {loop.map((text, i) => (
          <span
            key={i}
            className="font-display text-5xl md:text-7xl uppercase tracking-tight px-8 py-5 flex items-center shrink-0"
          >
            {text}
            <span
              className={`mx-8 inline-block w-2.5 h-2.5 rounded-full ${
                variant === "solid" ? "bg-sh-turmeric" : "bg-sh-saffron"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
