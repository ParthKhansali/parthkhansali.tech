import React from "react";

// Deterministic particles generated with varied coordinates, sizes, opacities and durations
const PARTICLES = [
  { id: 1, x: 8, y: 14, size: 2, opacity: 0.28, duration: 9, delay: 0 },
  { id: 2, x: 22, y: 38, size: 1.5, opacity: 0.18, duration: 12, delay: 1.2 },
  { id: 3, x: 35, y: 8, size: 2.5, opacity: 0.35, duration: 14, delay: 0.5 },
  { id: 4, x: 48, y: 62, size: 1.8, opacity: 0.22, duration: 10, delay: 2.1 },
  { id: 5, x: 63, y: 25, size: 2.2, opacity: 0.3, duration: 11, delay: 1.7 },
  { id: 6, x: 78, y: 76, size: 1.4, opacity: 0.15, duration: 13, delay: 0.8 },
  { id: 7, x: 91, y: 19, size: 2.4, opacity: 0.32, duration: 9.5, delay: 2.4 },
  { id: 8, x: 14, y: 84, size: 1.6, opacity: 0.2, duration: 11.5, delay: 1.0 },
  { id: 9, x: 28, y: 55, size: 2.8, opacity: 0.38, duration: 15, delay: 3.1 },
  { id: 10, x: 42, y: 89, size: 1.2, opacity: 0.14, duration: 8.5, delay: 0.2 },
  { id: 11, x: 56, y: 44, size: 2, opacity: 0.25, duration: 10.5, delay: 1.9 },
  { id: 12, x: 71, y: 12, size: 1.7, opacity: 0.28, duration: 13.5, delay: 2.8 },
  { id: 13, x: 85, y: 58, size: 2.6, opacity: 0.34, duration: 12, delay: 0.4 },
  { id: 14, x: 94, y: 82, size: 1.5, opacity: 0.19, duration: 14.5, delay: 2.2 },
  { id: 15, x: 5, y: 48, size: 2.1, opacity: 0.27, duration: 11, delay: 3.5 },
  { id: 16, x: 19, y: 22, size: 1.4, opacity: 0.16, duration: 9.8, delay: 1.1 },
  { id: 17, x: 39, y: 73, size: 2.3, opacity: 0.31, duration: 12.8, delay: 0.6 },
  { id: 18, x: 52, y: 16, size: 1.9, opacity: 0.24, duration: 10.2, delay: 2.5 },
  { id: 19, x: 67, y: 88, size: 1.3, opacity: 0.17, duration: 8.8, delay: 1.4 },
  { id: 20, x: 82, y: 33, size: 2.7, opacity: 0.36, duration: 13.2, delay: 0.9 },
  { id: 21, x: 96, y: 49, size: 1.8, opacity: 0.21, duration: 11.2, delay: 3.0 },
  { id: 22, x: 11, y: 68, size: 2.2, opacity: 0.29, duration: 14.2, delay: 1.8 },
  { id: 23, x: 31, y: 92, size: 1.6, opacity: 0.18, duration: 9.2, delay: 0.3 },
  { id: 24, x: 45, y: 31, size: 2.5, opacity: 0.33, duration: 12.5, delay: 2.7 },
  { id: 25, x: 60, y: 70, size: 1.5, opacity: 0.2, duration: 10.8, delay: 1.3 },
  { id: 26, x: 74, y: 47, size: 2.1, opacity: 0.26, duration: 13.8, delay: 0.7 },
  { id: 27, x: 88, y: 95, size: 1.7, opacity: 0.23, duration: 11.8, delay: 2.0 },
  { id: 28, x: 2, y: 79, size: 2.4, opacity: 0.3, duration: 14.8, delay: 3.3 },
];

/**
 * Ambient floating particle field inspired by Tajmirul's portfolio.
 * Deterministic positioning renders immediately without hydration shift.
 */
export default function ParticleBackground() {
  return (
    <div className="particle-container" aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
