"use client";

import { useEffect, useId, useRef, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

let isTransitioning = false;

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);
  const btnRef = useRef<HTMLButtonElement>(null);
  const rawId = useId();
  const maskId = `theme-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const sync = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    sync();

    if (typeof window !== "undefined" && window.CSS && typeof window.CSS.registerProperty === "function") {
      try {
        window.CSS.registerProperty({
          name: "--reveal-r",
          syntax: "<length>",
          inherits: false,
          initialValue: "0px",
        });
      } catch {
        // Already registered
      }
    }

    const onThemeEvent = () => sync();
    window.addEventListener("pk-theme-change", onThemeEvent);
    return () => window.removeEventListener("pk-theme-change", onThemeEvent);
  }, []);

  const applyTheme = (nextDark: boolean) => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch {}
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", nextDark ? "#141416" : "#f6f8f7");
    }
    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent("pk-theme-change", { detail: { isDark: nextDark } }));
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;

    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let originX = e.clientX;
    let originY = e.clientY;
    if (!originX && !originY && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    if (!docWithVT.startViewTransition || reducedMotion) {
      applyTheme(nextDark);
      return;
    }

    isTransitioning = true;
    const endRadius =
      Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      ) + 80;

    root.style.setProperty("--reveal-x", `${originX}px`);
    root.style.setProperty("--reveal-y", `${originY}px`);
    root.style.setProperty("--reveal-feather", "80px");
    root.classList.add("theme-reveal");

    const transition = docWithVT.startViewTransition(() => {
      applyTheme(nextDark);
    });

    const supportsRegisterProperty =
      typeof window !== "undefined" &&
      window.CSS &&
      typeof window.CSS.registerProperty === "function";

    transition.ready
      .then(() => {
        if (supportsRegisterProperty) {
          root.animate(
            { ["--reveal-r" as string]: ["0px", `${endRadius}px`] },
            {
              duration: 720,
              easing: "cubic-bezier(0.32, 0.72, 0, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        } else {
          root.classList.add("fallback-clip");
          root.animate(
            {
              clipPath: [
                `circle(0px at ${originX}px ${originY}px)`,
                `circle(${endRadius}px at ${originX}px ${originY}px)`,
              ],
            },
            {
              duration: 650,
              easing: "cubic-bezier(0.32, 0.72, 0, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        }
      })
      .catch(() => {});

    transition.finished
      .catch(() => {})
      .finally(() => {
        root.classList.remove("theme-reveal", "fallback-clip");
        root.style.removeProperty("--reveal-x");
        root.style.removeProperty("--reveal-y");
        root.style.removeProperty("--reveal-feather");
        root.style.removeProperty("--reveal-r");
        isTransitioning = false;
      });
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleToggle}
      className={`theme-toggle-btn ${className}`.trim()}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <svg className="theme-toggle-svg" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="white" />
            <circle
              className="theme-mask-cutter"
              cx={isDark ? 19.47 : 31.92}
              cy={isDark ? 11.35 : 10.26}
              r={7.5}
              fill="black"
            />
          </mask>
        </defs>
        <circle
          className="theme-core-circle"
          cx="12"
          cy="12"
          r={isDark ? 8 : 4.5}
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g className="theme-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line className="theme-ray ray-0" x1="19.5" y1="12" x2="22" y2="12" />
          <line className="theme-ray ray-1" x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
          <line className="theme-ray ray-2" x1="12" y1="19.5" x2="12" y2="22" />
          <line className="theme-ray ray-3" x1="6.7" y1="17.3" x2="4.93" y2="19.07" />
          <line className="theme-ray ray-4" x1="4.5" y1="12" x2="2" y2="12" />
          <line className="theme-ray ray-5" x1="6.7" y1="6.7" x2="4.93" y2="4.93" />
          <line className="theme-ray ray-6" x1="12" y1="4.5" x2="12" y2="2" />
          <line className="theme-ray ray-7" x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
        </g>
      </svg>
    </button>
  );
}
