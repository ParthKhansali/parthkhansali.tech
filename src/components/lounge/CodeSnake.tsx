"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { recordBest, useStoredNumber } from "@/lib/useStoredValue";

const CELLS = 18;
const LOGICAL = 360;
const CELL = LOGICAL / CELLS;

type Point = { x: number; y: number };
type Phase = "ready" | "playing" | "paused" | "over";

const START_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];

const opposite = (a: Point, b: Point) => a.x + b.x === 0 && a.y + b.y === 0;

export default function CodeSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef<Point[]>(START_SNAKE);
  const direction = useRef<Point>({ x: 1, y: 0 });
  const queued = useRef<Point | null>(null);
  const food = useRef<Point>({ x: 12, y: 9 });
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const best = useStoredNumber("pk_snake_best");
  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const placeFood = useCallback(() => {
    const taken = new Set(snake.current.map((part) => `${part.x},${part.y}`));
    let next: Point;
    do {
      next = {
        x: Math.floor(Math.random() * CELLS),
        y: Math.floor(Math.random() * CELLS),
      };
    } while (taken.has(`${next.x},${next.y}`));
    food.current = next;
  }, []);

  const reset = useCallback(() => {
    snake.current = START_SNAKE.map((part) => ({ ...part }));
    direction.current = { x: 1, y: 0 };
    queued.current = null;
    scoreRef.current = 0;
    setScore(0);
    placeFood();
    setPhase("playing");
  }, [placeFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#08080c";
    ctx.fillRect(0, 0, LOGICAL, LOGICAL);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < CELLS; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, LOGICAL);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(LOGICAL, i * CELL);
      ctx.stroke();
    }

    ctx.fillStyle = "#f0517c";
    ctx.fillRect(food.current.x * CELL + 3, food.current.y * CELL + 3, CELL - 6, CELL - 6);

    snake.current.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? "#f5f5f8" : "rgba(245, 245, 248, 0.45)";
      ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  // One game loop: advance on a fixed tick so speed does not depend on refresh rate.
  useEffect(() => {
    draw();
    let raf = 0;
    let last = 0;
    let accumulator = 0;

    const step = (time: number) => {
      raf = requestAnimationFrame(step);
      if (phaseRef.current !== "playing") {
        last = time;
        return;
      }
      if (!last) last = time;
      accumulator += time - last;
      last = time;

      const interval = Math.max(70, 140 - scoreRef.current * 4);
      if (accumulator < interval) return;
      accumulator = 0;

      if (queued.current && !opposite(queued.current, direction.current)) {
        direction.current = queued.current;
      }
      queued.current = null;

      const head = snake.current[0];
      const next = {
        x: head.x + direction.current.x,
        y: head.y + direction.current.y,
      };

      const hitWall =
        next.x < 0 || next.y < 0 || next.x >= CELLS || next.y >= CELLS;
      const hitSelf = snake.current.some(
        (part, index) => index !== snake.current.length - 1 && part.x === next.x && part.y === next.y,
      );

      if (hitWall || hitSelf) {
        phaseRef.current = "over";
        setPhase("over");
        recordBest("pk_snake_best", scoreRef.current);
        return;
      }

      snake.current = [next, ...snake.current];

      if (next.x === food.current.x && next.y === food.current.y) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        placeFood();
      } else {
        snake.current.pop();
      }

      draw();
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [draw, placeFood]);

  const turn = useCallback((delta: Point) => {
    if (phaseRef.current === "ready") {
      setPhase("playing");
    }
    if (phaseRef.current !== "playing") return;
    if (opposite(delta, direction.current)) return;
    queued.current = delta;
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const map: Record<string, Point> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };
    const next = map[event.key] ?? map[event.key.toLowerCase()];
    if (next) {
      event.preventDefault();
      turn(next);
    }
    if (event.key === " ") {
      event.preventDefault();
      setPhase((current) => (current === "playing" ? "paused" : "playing"));
    }
  };

  const touchStart = useRef<Point | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    turn(
      Math.abs(dx) > Math.abs(dy)
        ? { x: Math.sign(dx), y: 0 }
        : { x: 0, y: Math.sign(dy) },
    );
  };

  return (
    <div className="stage">
      <div className="stage-bar">
        <div>
          <p className="label">Code Snake</p>
          <p className="score">score {score}</p>
        </div>
        <p className="measured" style={{ fontSize: "0.75rem" }}>
          best {best}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={LOGICAL}
        height={LOGICAL}
        tabIndex={0}
        role="application"
        aria-label="Code Snake. Arrow keys or WASD to steer, space to pause. On a phone, swipe to steer."
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      <div className="stage-bar">
        <span className="form-note" aria-live="polite">
          {phase === "ready" ? "Swipe or press an arrow to start." : null}
          {phase === "playing" ? "Steer with arrows, WASD or swipes." : null}
          {phase === "paused" ? "Paused. Space or tap start." : null}
          {phase === "over" ? `Game over at ${score}.` : null}
        </span>
        <button
          className="btn btn--quiet"
          type="button"
          onClick={() => {
            if (phase === "playing") setPhase("paused");
            else if (phase === "paused") setPhase("playing");
            else reset();
          }}
        >
          {phase === "playing" ? "Pause" : phase === "paused" ? "Resume" : "Start"}
        </button>
      </div>
    </div>
  );
}
