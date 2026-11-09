"use client";

import { useEffect, useRef } from "react";

/**
 * A small floating screenshot that follows the pointer while it is over an
 * element carrying `data-preview="/shots/…jpg"`.
 *
 * Desktop pointers only, driven by refs and a single rAF so it never re-renders
 * the page. The panel is aria-hidden: it repeats imagery that is already in the
 * card, so it adds nothing for a screen reader.
 */
export default function CursorPreview({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = scope.current;
    const box = panel.current;
    const img = picture.current;
    if (!root || !box || !img) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const place = () => {
      frame = 0;
      box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-preview]",
      );
      if (!target) return;
      const src = target.dataset.preview;
      if (!src) return;
      if (img.getAttribute("src") !== src) img.src = src;
      box.dataset.visible = "true";
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX + 26;
      y = event.clientY + 26;
      if (!frame) frame = requestAnimationFrame(place);
    };

    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget as HTMLElement | null;
      if (next?.closest("[data-preview]")) return;
      box.dataset.visible = "false";
    };

    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerout", onOut);

    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerout", onOut);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={scope} className="preview-scope">
      {children}
      <div ref={panel} className="cursor-preview" data-visible="false" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={picture}
          alt=""
          decoding="async"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        />
      </div>
    </div>
  );
}
