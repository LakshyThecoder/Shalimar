import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const t = e.target;
      if (!t || !ringRef.current) return;
      const hover = t.closest("a, button, input, select, textarea, [data-cursor-hover]");
      if (hover) {
        ringRef.current.classList.add("cursor-hover");
      } else {
        ringRef.current.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[150] w-9 h-9 rounded-full border border-sh-saffron/70 mix-blend-difference transition-[width,height,border-color,background-color] duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[151] w-1.5 h-1.5 rounded-full bg-sh-saffron mix-blend-difference"
      />
      <style>{`
        @media (hover: hover) { body, a, button { cursor: none !important; } }
        .cursor-ring.cursor-hover {
          width: 56px; height: 56px;
          margin-left: -10px; margin-top: -10px;
          background: rgba(232,163,23,0.18);
          border-color: rgba(240,193,74,0.9);
        }
      `}</style>
    </>
  );
}
