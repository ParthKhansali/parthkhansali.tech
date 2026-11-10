"use client";

import { useEffect, useRef } from "react";

const CODE_FRAGMENTS = [
  "0x7FFE_00_EF_4E_22_C5_5E",
  "def track_pat(sigma: 0.18):",
  "const ast = graphify.extract()",
  "FPA_1024x1024_SUBPIXEL_ACQ",
  "01010000 01000001 01010010",
  "GEHU_CONNECT_V2_ACTIVE_NODE",
  "30.3165°N 78.0322°E DEHRADUN",
  "LOSS_DOES_NOT_DETER_ME",
  "VICTORY_DOES_NOT_PRAISE_ME",
  "I_SEEK_MORE // CORE_CREED",
  "SPRING_BOOT_3.4 // POSTGRESQL",
  "CLOUDFLARE_R2 // TYPESCRIPT",
  "λ(x, y) => sqrt(dx*dx + dy*dy)",
  "ROTATING_MATRIX_AFFINE_2D",
  "PARTH_KHANSALI // CSE_2028",
  "STATUS: 200_OK // PTT_ACTIVE",
  "NETWICH_PACKET_TRACER_READY",
  "SIMULATION_ORVESS_PAT_RUNNING",
  "01010100 01001000 00100000",
  "[SYS_CORE] 64_THREADS_ALLOC",
  "AST_SUBGRAPH_QUERY_OPTIMAL",
  "BUFFER_FILL_RATIO: 0.042ms",
  "PUBLIC_KEY: ED25519_VERIFIED",
  "LATENCY: 11.4ms // RTT_STEADY",
  "PARTH_PORTFOLIO_V2 // BUILD",
];

const GLYPHS = "01010101010101<>/{}[];:+=~*#?&|^_λσπ∞";

interface ColumnStream {
  headY: number;
  speed: number;
  length: number;
  chars: string[];
  mutateTimer: number;
}

export default function HeroAsciiReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const heroEl = canvas.closest(".hero") as HTMLElement | null;
    if (!heroEl) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isDark = document.documentElement.classList.contains("dark");
    let isVisible = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse tracking with smooth lerping
    const mouse = { x: -1000, y: -1000 };
    const currentMouse = { x: -1000, y: -1000 };
    let isHovered = false;
    let hoverIntensity = 0;

    // Center coordinates & soft radius for hero text
    let center = { cx: 0, cy: 0, rx: 220, ry: 90 };

    const updateCenter = () => {
      const innerEl = heroEl.querySelector(".hero__inner");
      if (!innerEl) return;
      const heroRect = heroEl.getBoundingClientRect();
      const innerRect = innerEl.getBoundingClientRect();

      center = {
        cx: innerRect.left - heroRect.left + innerRect.width / 2,
        cy: innerRect.top - heroRect.top + innerRect.height / 2,
        // Organic elliptical halo radius
        rx: Math.max(160, innerRect.width / 2 + 28),
        ry: Math.max(80, innerRect.height / 2 + 16),
      };
    };

    const charWidth = 14;
    const rowHeight = 22;
    let columns: ColumnStream[] = [];

    const initStreams = () => {
      const colCount = Math.ceil(width / charWidth) + 2;
      const rowCount = Math.ceil(height / rowHeight) + 4;
      columns = [];

      for (let c = 0; c < colCount; c++) {
        const streamLength = 16 + Math.floor(Math.random() * 22);
        const chars: string[] = [];
        const frag = CODE_FRAGMENTS[c % CODE_FRAGMENTS.length];

        for (let r = 0; r < rowCount + streamLength; r++) {
          if (r < frag.length) {
            chars.push(frag[r]);
          } else {
            chars.push(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
          }
        }

        columns.push({
          headY: Math.random() * (height + streamLength * rowHeight),
          speed: 0.65 + Math.random() * 1.35,
          length: streamLength,
          chars,
          mutateTimer: Math.floor(Math.random() * 60),
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = heroEl.clientWidth;
      height = heroEl.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      updateCenter();
      initStreams();
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    heroEl.addEventListener("mousemove", onMouseMove);
    heroEl.addEventListener("mouseleave", onMouseLeave);

    const spotlightRadius = 340;

    const render = () => {
      // Smooth lerp for mouse and hover intensity
      currentMouse.x += (mouse.x - currentMouse.x) * 0.16;
      currentMouse.y += (mouse.y - currentMouse.y) * 0.16;

      const targetIntensity = isHovered ? 1 : 0;
      hoverIntensity += (targetIntensity - hoverIntensity) * 0.1;

      ctx.clearRect(0, 0, width, height);

      ctx.font = '12px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
      ctx.textBaseline = "middle";

      for (let c = 0; c < columns.length; c++) {
        const stream = columns[c];
        const x = c * charWidth + charWidth / 2;

        // Move stream downwards smoothly
        stream.headY += stream.speed;
        const totalSpan = height + stream.length * rowHeight;
        if (stream.headY > totalSpan) {
          stream.headY = 0;
        }

        // Random character mutation for matrix feel
        stream.mutateTimer++;
        if (stream.mutateTimer > 18) {
          stream.mutateTimer = 0;
          const randIdx = Math.floor(Math.random() * stream.chars.length);
          stream.chars[randIdx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }

        const headRow = Math.floor(stream.headY / rowHeight);

        // Draw the trailing stream of characters
        for (let i = 0; i < stream.length; i++) {
          const row = headRow - i;
          if (row < 0) continue;
          const y = row * rowHeight + rowHeight / 2;
          if (y > height + 20) continue;

          // Organic elliptical distance from the center text (Parth Khansali)
          const normDx = (x - center.cx) / center.rx;
          const normDy = (y - center.cy) / center.ry;
          const centerDist = Math.hypot(normDx, normDy);

          // Smooth cosine ease falloff: NO rectangular box!
          let centerFalloff = 1;
          if (centerDist < 1.0) {
            // Smoothly drop to 0 at center, soft feathering outward
            const t = Math.max(0, centerDist);
            centerFalloff = Math.sin((t * Math.PI) / 2);
            centerFalloff = centerFalloff * centerFalloff;
          }

          if (centerFalloff <= 0.02) continue;

          // Cursor spotlight proximity
          const cursorDist = Math.hypot(x - currentMouse.x, y - currentMouse.y);
          const inSpotlight = cursorDist < spotlightRadius;

          // Trail alpha calculation (head is brightest, trail fades)
          const trailFactor = 1 - i / stream.length;
          const baseAmbientAlpha = 0.08 + trailFactor * 0.12;

          let spotBoost = 0;
          if (inSpotlight) {
            const spotRatio = cursorDist / spotlightRadius;
            spotBoost = Math.max(0, Math.cos((spotRatio * Math.PI) / 2)) * hoverIntensity * 0.8;
          }

          const alpha = (baseAmbientAlpha + spotBoost) * centerFalloff;
          if (alpha < 0.015) continue;

          const char = stream.chars[row % stream.chars.length] || "0";

          if (i === 0 && (inSpotlight || Math.random() < 0.2)) {
            ctx.fillStyle = isDark
              ? `rgba(255, 255, 255, ${Math.min(1, alpha * 1.5)})`
              : `rgba(12, 42, 22, ${Math.min(0.85, alpha * 1.4)})`;
            ctx.shadowColor = isDark ? "rgba(0, 239, 78, 0.8)" : "rgba(0, 153, 52, 0.35)";
            ctx.shadowBlur = isDark ? 8 : 4;
          } else if (spotBoost > 0.35) {
            ctx.fillStyle = isDark
              ? `rgba(0, 239, 78, ${alpha})`
              : `rgba(0, 145, 48, ${Math.min(0.8, alpha)})`;
            ctx.shadowColor = isDark ? "rgba(0, 239, 78, 0.4)" : "transparent";
            ctx.shadowBlur = isDark ? 4 : 0;
          } else if (spotBoost > 0.1) {
            ctx.fillStyle = isDark
              ? `rgba(0, 203, 240, ${alpha * 0.9})`
              : `rgba(2, 132, 199, ${Math.min(0.75, alpha * 0.85)})`;
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = isDark
              ? `rgba(0, 239, 78, ${alpha * 0.75})`
              : `rgba(0, 130, 44, ${Math.min(0.45, alpha * 0.65)})`;
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, y);
        }
      }

      if (!reducedMotion && isVisible && !document.hidden) {
        animFrameId = requestAnimationFrame(render);
      } else {
        animFrameId = 0;
      }
    };

    const startLoop = () => {
      if (!animFrameId && !reducedMotion && isVisible && !document.hidden) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    };

    const onThemeChange = () => {
      isDark = document.documentElement.classList.contains("dark");
      if (reducedMotion) render();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = Boolean(entries[0]?.isIntersecting);
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    observer.observe(heroEl);

    window.addEventListener("pk-theme-change", onThemeChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reducedMotion) {
      render();
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pk-theme-change", onThemeChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      heroEl.removeEventListener("mousemove", onMouseMove);
      heroEl.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-ascii-canvas"
      aria-hidden="true"
    />
  );
}
