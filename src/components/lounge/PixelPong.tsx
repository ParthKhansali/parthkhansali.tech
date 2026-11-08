"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 360;
const PADDLE_H = 10;
const PADDLE_W = 72;
const BALL_R = 5;
const LIVES = 3;

export default function PixelPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleX = useRef((W - PADDLE_W) / 2);
  const ball = useRef({ x: W / 2, y: H / 2, vx: 190, vy: -190 });
  const [running, setRunning] = useState(false);
  const [returns, setReturns] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const resetBall = useCallback((direction = -1) => {
    const speed = 190;
    ball.current = {
      x: W / 2,
      y: H * 0.62,
      vx: (Math.random() > 0.5 ? 1 : -1) * speed * 0.7,
      vy: speed * direction,
    };
  }, []);

  const restart = () => {
    resetBall();
    setReturns(0);
    setLives(LIVES);
    setRunning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let last = 0;

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const delta = last ? Math.min(32, time - last) / 1000 : 0;
      last = time;

      if (runningRef.current) {
        const b = ball.current;
        b.x += b.vx * delta;
        b.y += b.vy * delta;

        if (b.x < BALL_R) {
          b.x = BALL_R;
          b.vx = Math.abs(b.vx);
        }
        if (b.x > W - BALL_R) {
          b.x = W - BALL_R;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y < BALL_R) {
          b.y = BALL_R;
          b.vy = Math.abs(b.vy);
        }

        // Paddle contact
        const paddleY = H - PADDLE_H - 6;
        if (
          b.vy > 0 &&
          b.y + BALL_R >= paddleY &&
          b.y + BALL_R <= paddleY + PADDLE_H + 6 &&
          b.x >= paddleX.current - BALL_R &&
          b.x <= paddleX.current + PADDLE_W + BALL_R
        ) {
          b.y = paddleY - BALL_R;
          b.vy = -Math.abs(b.vy) * 1.04;
          const offset = (b.x - (paddleX.current + PADDLE_W / 2)) / (PADDLE_W / 2);
          b.vx += offset * 90;
          b.vx = Math.max(-280, Math.min(280, b.vx));
          setReturns((value) => value + 1);
        }

        if (b.y > H + BALL_R) {
          setLives((current) => {
            const next = current - 1;
            if (next <= 0) {
              runningRef.current = false;
              setRunning(false);
            }
            return Math.max(0, next);
          });
          resetBall();
        }
      }

      ctx.fillStyle = "#0b0e12";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(120, 140, 170, 0.12)";
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(0, H - 40);
      ctx.lineTo(W, H - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f0b04a";
      ctx.fillRect(paddleX.current, H - PADDLE_H - 6, PADDLE_W, PADDLE_H);

      ctx.fillStyle = "#6fb3ff";
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [resetBall]);

  const movePaddle = (clientX: number, target: HTMLCanvasElement) => {
    const rect = target.getBoundingClientRect();
    const scale = W / rect.width;
    const x = (clientX - rect.left) * scale;
    paddleX.current = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = 26;
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      event.preventDefault();
      paddleX.current = Math.max(0, paddleX.current - step);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      event.preventDefault();
      paddleX.current = Math.min(W - PADDLE_W, paddleX.current + step);
    }
  };

  return (
    <div className="stage">
      <div className="stage-bar">
        <div>
          <p className="label">Pixel Pong</p>
          <p className="score">returns {returns}</p>
        </div>
        <p className="measured" style={{ fontSize: "0.75rem" }}>
          lives {lives}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        tabIndex={0}
        role="application"
        aria-label="Pixel Pong. Drag anywhere on the board to move the paddle, or use left and right arrows."
        onPointerMove={(event) => movePaddle(event.clientX, event.currentTarget)}
        onPointerDown={(event) => movePaddle(event.clientX, event.currentTarget)}
        onKeyDown={onKeyDown}
      />

      <div className="stage-bar">
        <span className="form-note" aria-live="polite">
          {!running
            ? lives <= 0
              ? `Out at ${returns} returns.`
              : "Drag the board to move the paddle."
            : "Drag or use arrow keys."}
        </span>
        <button className="btn btn--quiet" type="button" onClick={restart}>
          {running ? "Restart" : "Start"}
        </button>
      </div>
    </div>
  );
}
