"use client";

import { useEffect, useRef, useState } from "react";

export interface ExperienceItem {
  title: string;
  org: string;
  period: string;
  detail: string;
  tags: string[];
  tone?: string;
}

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressHeadRef = useRef<HTMLSpanElement>(null);
  const [activeDots, setActiveDots] = useState<boolean[]>(() => items.map(() => false));
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let animId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const calculateTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start progressing when container top enters 65% of viewport
      const startPoint = windowHeight * 0.65;
      const totalHeight = rect.height;

      const scrolledDistance = startPoint - rect.top;
      targetProgress = Math.min(1, Math.max(0, scrolledDistance / totalHeight));
    };

    const updateFrame = () => {
      // Butter-smooth lerp (damping factor 0.12)
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleY(${currentProgress})`;
      }

      if (progressHeadRef.current) {
        progressHeadRef.current.style.top = `${(currentProgress * 100).toFixed(2)}%`;
        progressHeadRef.current.style.opacity = currentProgress > 0.015 ? "1" : "0";
      }

      // Check which dots are reached
      if (containerRef.current) {
        const totalHeight = containerRef.current.offsetHeight;
        const currentY = currentProgress * totalHeight;

        setActiveDots(
          items.map((_, idx) => {
            const dotEl = dotRefs.current[idx];
            if (!dotEl || !containerRef.current) return false;
            const dotTop = dotEl.offsetTop;
            return currentY >= dotTop - 12;
          })
        );
      }

      animId = requestAnimationFrame(updateFrame);
    };

    const onScrollOrResize = () => {
      calculateTarget();
    };

    calculateTarget();
    animId = requestAnimationFrame(updateFrame);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [items]);

  return (
    <div ref={containerRef} className="timeline-wrapper">
      {/* Scroll-driven progression line track */}
      <div className="timeline-track" aria-hidden="true">
        <div
          ref={progressLineRef}
          className="timeline-progress"
          style={{ transformOrigin: "top center", transform: "scaleY(0)" }}
        />
        <span
          ref={progressHeadRef}
          className="timeline-progress__head"
          style={{ opacity: 0 }}
        />
      </div>

      <ol className="timeline">
        {items.map((item, idx) => {
          const isReached = activeDots[idx];
          return (
            <li key={`${item.title}-${item.period}`} className="timeline__item">
              <span
                ref={(el) => {
                  dotRefs.current[idx] = el;
                }}
                className={`timeline__dot ${isReached ? "is-reached" : ""}`}
                aria-hidden="true"
              />

              <div className="timeline__card card">
                <div className="timeline__meta">
                  <span className="timeline__period">{item.period}</span>
                  <span className="timeline__sep" aria-hidden="true">·</span>
                  <span className="timeline__org">{item.org}</span>
                </div>

                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__detail">{item.detail}</p>

                <div className="chip-list">
                  {item.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
