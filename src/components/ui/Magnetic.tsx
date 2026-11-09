"use client";

import { useRef } from "react";

/**
 * Pulls its child toward the pointer, a few pixels, like a magnet.
 *
 * Decorative only: the element keeps its real position for layout, focus and
 * clicks. Skipped entirely for touch pointers and for visitors who asked for
 * less motion.
 */
export default function Magnetic({
  children,
  strength = 12,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const release = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || event.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const box = el.getBoundingClientRect();
        const x = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
        const y = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
        el.style.setProperty("--mx", `${(x * strength).toFixed(2)}px`);
        el.style.setProperty("--my", `${(y * strength).toFixed(2)}px`);
      }}
      onPointerLeave={release}
      onBlur={release}
    >
      {children}
    </span>
  );
}
