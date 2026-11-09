"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a number the first time it scrolls into view.
 *
 * The final value is what the server renders, so it is correct in the HTML for
 * crawlers and for anyone without JavaScript. The animation only rewinds a
 * purely decorative copy of it, and it is skipped entirely for reduced motion.
 */
export default function CountUp({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1100);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-US")}
    </span>
  );
}
