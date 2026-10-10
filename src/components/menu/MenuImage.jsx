import { useEffect, useState } from "react";
import { IMG } from "../../lib/images";

/** Reliable cover image with graceful fallback */
export default function MenuImage({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = src && !failed ? src : IMG.spices;

  return (
    <img
      key={src || "fallback"}
      src={resolved}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
