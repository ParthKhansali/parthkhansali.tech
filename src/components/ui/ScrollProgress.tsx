"use client";

import { useEffect, useRef } from "react";

/**
 * Side scroll progress indicator borrowed from Tajmirul's portfolio.
 * A fixed pill capsule on the right side of the screen that smoothly tracks
 * how far down the page the visitor has scrolled.
 */
export default function ScrollProgress() {
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      frame = 0;
      if (!thumbRef.current) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;
      thumbRef.current.style.transform = `translateY(-${(100 - progress).toFixed(2)}%)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="side-scrollbar" aria-hidden="true">
      <div className="side-scrollbar__thumb" ref={thumbRef} />
    </div>
  );
}
