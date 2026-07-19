import { motion } from "framer-motion";

/** Soft floating ember particles — atmosphere only, no badges */
export default function EmberField({ count = 18, className = "" }) {
  const embers = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    size: 2 + (i % 4),
    delay: (i % 10) * 0.45,
    duration: 6 + (i % 7),
    color: i % 3 === 0 ? "#E8A317" : i % 3 === 1 ? "#D9401A" : "#F0C14A",
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {embers.map((e) => (
        <motion.span
          key={e.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: e.left,
            bottom: "-5%",
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, (e.id % 2 === 0 ? 1 : -1) * (12 + (e.id % 20))],
            opacity: [0, 0.85, 0.85, 0],
            scale: [0.6, 1.2, 0.8],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
