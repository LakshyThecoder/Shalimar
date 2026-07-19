import { useState } from "react";
import { IMG } from "../../lib/images";

/** Reliable cover image with graceful fallback */
export default function MenuImage({ src, alt = "", className = "" }) {
  const [current, setCurrent] = useState(src);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (current !== IMG.spices) setCurrent(IMG.spices);
      }}
    />
  );
}
