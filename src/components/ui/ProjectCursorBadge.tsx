"use client";

import { useEffect, useRef } from "react";

export default function ProjectCursorBadge() {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let isVisible = false;
    let hasMoved = false;

    const badge = badgeRef.current;
    if (!badge) return;

    const onMove = (e: MouseEvent | PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!hasMoved) {
        currentX = targetX;
        currentY = targetY;
        hasMoved = true;
      }

      const target = e.target as HTMLElement | null;
      if (!target) {
        isVisible = false;
        badge.classList.remove("is-visible");
        return;
      }

      const isProjectTarget = Boolean(
        target.closest(
          ".project-card, [data-project-tile], .showcase-item, .showcase__tile, .work-card, .showcase-gehu, .showcase-orvess, .showcase-meghavyuha"
        )
      );

      if (isProjectTarget !== isVisible) {
        isVisible = isProjectTarget;
        if (isVisible) {
          badge.classList.add("is-visible");
        } else {
          badge.classList.remove("is-visible");
        }
      }
    };

    const onLeave = () => {
      isVisible = false;
      badge.classList.remove("is-visible");
    };

    const updatePosition = () => {
      // Smooth lerp (0.2 damping for fluid, latency-free gliding)
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      badge.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${
        isVisible ? 1 : 0.5
      })`;

      animId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    animId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={badgeRef} className="project-cursor-badge" aria-hidden="true">
      <div className="project-cursor-badge__ring">
        {/* Rotating Text Ring */}
        <div className="project-cursor-badge__text-spinner">
          <svg
            className="project-cursor-badge__text-svg"
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
          >
            <path
              id="badgeCirclePath"
              d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              fill="none"
            />
            <text className="project-cursor-badge__text">
              <textPath
                href="#badgeCirclePath"
                startOffset="0%"
                textLength="224"
                lengthAdjust="spacing"
              >
                OPEN TO EXPLORE • VIEW PROJECT •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Inner static dark core with glowing emerald eye */}
        <div className="project-cursor-badge__center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
