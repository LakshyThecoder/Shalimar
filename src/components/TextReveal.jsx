import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1];

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%", rotateX: 28, opacity: 0 }}
        animate={inView ? { y: 0, rotateX: 0, opacity: 1 } : {}}
        transition={{ duration: 1.05, delay, ease }}
        style={{ transformOrigin: "bottom", perspective: 1000 }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function FadeUp({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
