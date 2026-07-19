import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function RatingsBand() {
  const { t } = useTranslation();

  const items = [
    { value: "4.2", label: "Tripadvisor" },
    { value: "28+", label: "Reviews" },
    { value: "100%", label: t("menu.halalBadge") },
    { value: "Zone 5", label: "Milano" },
  ];

  return (
    <section className="relative border-y border-sh-border bg-sh-surface/90 overflow-hidden">
      <div className="absolute inset-0 indian-glow opacity-45" />
      <div className="relative px-6 md:px-12 lg:px-16 py-9 md:py-11 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.value + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-start md:border-s md:border-sh-border/80 md:ps-8 first:md:border-0 first:md:ps-0"
          >
            <div className="font-display text-4xl md:text-5xl text-sh-saffron tracking-tight uppercase">
              {item.value}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-sh-muted">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
