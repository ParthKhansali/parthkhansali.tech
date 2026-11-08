"use client";

import { useEffect, useRef, useState } from "react";
import { recordBest, useStoredNumber } from "@/lib/useStoredValue";

type Phase = "idle" | "waiting" | "go" | "result" | "early";

export default function LatencyReflex() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState(0);
  const best = useStoredNumber("pk_reflex_best");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const arm = () => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("waiting");
    const delay = 900 + Math.random() * 2200;
    timer.current = setTimeout(() => {
      startedAt.current = performance.now();
      setPhase("go");
    }, delay);
  };

  const hit = () => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      arm();
      return;
    }
    if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const elapsed = Math.round(performance.now() - startedAt.current);
      setResult(elapsed);
      setPhase("result");
      recordBest("pk_reflex_best", elapsed);
    }
  };

  const label =
    phase === "idle"
      ? "Tap to begin"
      : phase === "waiting"
        ? "Wait for the colour"
        : phase === "go"
          ? "Tap now"
          : phase === "early"
            ? "Too early"
            : `${result} ms`;

  const hint =
    phase === "idle"
      ? "The panel turns blue, then you tap. That gap is your reaction time."
      : phase === "waiting"
        ? "Do not tap yet."
        : phase === "go"
          ? "Now."
          : phase === "early"
            ? "You tapped before it changed. Tap to try again."
            : `Best ${best} ms. Tap to run it again.`;

  return (
    <div className="stage">
      <div className="stage-bar">
        <div>
          <p className="label">Latency Reflex</p>
          <p className="score">{best ? `best ${best} ms` : "no reading yet"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={hit}
        aria-label={label}
        style={{
          width: "100%",
          minHeight: "11rem",
          display: "grid",
          placeItems: "center",
          gap: "0.35rem",
          padding: "1.25rem",
          border: "1px solid var(--rule-2)",
          borderRadius: "6px",
          background:
            phase === "go"
              ? "var(--cool-soft)"
              : phase === "early"
                ? "var(--bad-soft)"
                : "var(--paper-3)",
          color: "var(--ink)",
          transition: "background-color 120ms cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <span
          className={phase === "result" ? "reading" : "person"}
          style={{ fontSize: phase === "result" ? "clamp(2rem, 5vw, 2.75rem)" : "1.125rem" }}
        >
          {label}
        </span>
        <span className="form-note" style={{ textAlign: "center", maxWidth: "28ch" }}>
          {hint}
        </span>
      </button>
    </div>
  );
}
