"use client";

import { useRef } from "react";

/**
 * One pointer listener for a whole grid of cards.
 *
 * Each card gets the pointer position in its own coordinates as `--spot-x` /
 * `--spot-y`, which the stylesheet turns into a soft cyan spotlight. Delegation
 * keeps it to a single listener no matter how many cards there are, and the
 * whole thing is inert on touch and with reduced motion.
 */
export default function SpotlightGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const target = (event.target as HTMLElement).closest<HTMLElement>(
          "[data-spotlight]",
        );
        if (!target) return;

        const x = event.clientX;
        const y = event.clientY;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const box = target.getBoundingClientRect();
          target.style.setProperty("--spot-x", `${x - box.left}px`);
          target.style.setProperty("--spot-y", `${y - box.top}px`);
        });
      }}
    >
      {children}
    </div>
  );
}
