"use client";

import { useEffect } from "react";

export default function SpotlightCardListener() {
  useEffect(() => {
    let ticking = false;
    let targetCard: HTMLElement | null = null;
    let clientX = 0;
    let clientY = 0;
    let currentMagneticBtn: HTMLElement | null = null;

    const updateSpotlight = () => {
      if (targetCard) {
        const rect = targetCard.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        targetCard.style.setProperty("--spotlight-x", `${x}px`);
        targetCard.style.setProperty("--spotlight-y", `${y}px`);
      }
      ticking = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;

      // 1. Spotlight border tracking
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        ".card, .skill-tile, .project-card, .award-card, .stat-card, .misc-card, .connect__card, .timeline__card, .work-card, .folio, .trail-row"
      );

      if (card) {
        targetCard = card;
        if (!ticking) {
          window.requestAnimationFrame(updateSpotlight);
          ticking = true;
        }
      }

      // 2. Magnetic button pull physics from awrs.me
      const magneticTarget = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        ".btn, .mobile-nav-trigger, .nav-search-btn, .whiteboard-btn, .awrs-reachout-btn, .awrs-icon-btn, [data-magnetic]"
      );

      if (magneticTarget) {
        currentMagneticBtn = magneticTarget;
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.24;
        const deltaY = (e.clientY - centerY) * 0.24;

        magneticTarget.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
        magneticTarget.style.transition = "transform 0.12s ease-out";
      } else if (currentMagneticBtn) {
        currentMagneticBtn.style.transform = "translate3d(0, 0, 0)";
        currentMagneticBtn.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
        currentMagneticBtn = null;
      }
    };

    const handlePointerLeave = () => {
      if (currentMagneticBtn) {
        currentMagneticBtn.style.transform = "translate3d(0, 0, 0)";
        currentMagneticBtn.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
        currentMagneticBtn = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return null;
}
