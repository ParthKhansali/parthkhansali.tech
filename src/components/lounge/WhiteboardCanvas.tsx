"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { loadUserSession, loginWithGoogle, postDrawing } from "@/lib/lounge";
import {
  IconBrush,
  IconDownload,
  IconEraser,
  IconHighlighter,
  IconPalette,
  IconPen,
  IconPin,
  IconTrash,
  IconUndo,
} from "@/components/ui/Icons";

type ToolType = "pen" | "marker" | "highlighter" | "eraser";

interface Point {
  x: number;
  y: number;
}

const COLORS = [
  { name: "Neon Emerald", hex: "#00ef4e" },
  { name: "Cyber Cyan", hex: "#06b6d4" },
  { name: "Electric Amber", hex: "#fbbf24" },
  { name: "Hot Rose", hex: "#f43f5e" },
  { name: "Ultra Violet", hex: "#a855f7" },
  { name: "Pure White", hex: "#ffffff" },
];

const STROKE_SIZES = [
  { label: "Fine", value: 2 },
  { label: "Medium", value: 5 },
  { label: "Thick", value: 12 },
];

export default function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const [activeColor, setActiveColor] = useState<string>("#00ef4e");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [canUndo, setCanUndo] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postNotice, setPostNotice] = useState<string | null>(null);

  // History stack for Undo
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  // Save canvas state to history
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(data);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    setCanUndo(true);
  }, []);

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const targetW = rect.width;
      const targetH = Math.min(520, Math.max(380, window.innerHeight * 0.55));

      // Save content before resize if exists
      const ctx = canvas.getContext("2d");
      let tempCanvas: HTMLCanvasElement | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = Math.floor(targetW * dpr);
      canvas.height = Math.floor(targetH * dpr);
      canvas.style.width = `${targetW}px`;
      canvas.style.height = `${targetH}px`;

      if (ctx) {
        ctx.scale(dpr, dpr);
        if (tempCanvas) {
          ctx.drawImage(
            tempCanvas,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height,
            0,
            0,
            targetW,
            targetH
          );
        } else {
          // Initial background fill
          ctx.fillStyle = "#0c0c10";
          ctx.fillRect(0, 0, targetW, targetH);
          pushHistory();
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [pushHistory]);

  // Pointer event handlers
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = getCanvasCoords(e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentPoint = getCanvasCoords(e);
    const lastPoint = lastPointRef.current;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 3;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = activeColor;

      if (activeTool === "highlighter") {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = strokeWidth * 4;
      } else if (activeTool === "marker") {
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = strokeWidth * 1.8;
      } else {
        ctx.globalAlpha = 1;
        ctx.lineWidth = strokeWidth;
      }

      // Smooth curve using midpoint quadratic bezier
      const midPoint = {
        x: (lastPoint.x + currentPoint.x) / 2,
        y: (lastPoint.y + currentPoint.y) / 2,
      };

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
      ctx.stroke();
    }

    ctx.restore();
    lastPointRef.current = currentPoint;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already lost
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
    pushHistory();
  };

  // Undo
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pop the current state
    historyRef.current.pop();
    const previousState = historyRef.current[historyRef.current.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }
    setCanUndo(historyRef.current.length > 1);
  };

  // Clear Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.fillStyle = "#0c0c10";
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    pushHistory();
  };

  // Export / Download PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `parth-lounge-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Post drawing directly to The Wall with Google Authentication
  const handlePostToWall = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setPosting(true);
    setPostNotice(null);

    try {
      let currentUser = loadUserSession();
      if (!currentUser) {
        setPostNotice("Connecting with Google to pin on The Wall...");
        currentUser = await loginWithGoogle();
        if (!currentUser) {
          setPostNotice("Sign-in with Google is required to pin on The Wall.");
          setTimeout(() => setPostNotice(null), 4000);
          setPosting(false);
          return;
        }
      }

      const dataUrl = canvas.toDataURL("image/webp", 0.85);
      await postDrawing(currentUser.displayName, dataUrl, "Whiteboard sketch", currentUser);
      setPostNotice(`Pinned as ${currentUser.displayName}! Check it out on The Wall below.`);
      setTimeout(() => setPostNotice(null), 5000);

      const wallEl = document.getElementById("wall");
      if (wallEl) {
        wallEl.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setPostNotice("Could not post drawing. Try Export PNG instead.");
      setTimeout(() => setPostNotice(null), 4000);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="whiteboard-wrap">
      {/* Interactive Controls Bar */}
      <div className="whiteboard-toolbar">
        {/* Tool Selectors */}
        <div className="whiteboard-group">
          <button
            type="button"
            className={`whiteboard-btn ${activeTool === "pen" ? "is-active" : ""}`}
            onClick={() => setActiveTool("pen")}
            title="Fine Pen"
            aria-label="Fine Pen tool"
          >
            <IconPen size={14} />
            <span>Pen</span>
          </button>
          <button
            type="button"
            className={`whiteboard-btn ${activeTool === "marker" ? "is-active" : ""}`}
            onClick={() => setActiveTool("marker")}
            title="Marker Brush"
            aria-label="Marker Brush tool"
          >
            <IconBrush size={14} />
            <span>Marker</span>
          </button>
          <button
            type="button"
            className={`whiteboard-btn ${activeTool === "highlighter" ? "is-active" : ""}`}
            onClick={() => setActiveTool("highlighter")}
            title="Translucent Highlighter"
            aria-label="Highlighter tool"
          >
            <IconHighlighter size={14} />
            <span>Highlight</span>
          </button>
          <button
            type="button"
            className={`whiteboard-btn ${activeTool === "eraser" ? "is-active" : ""}`}
            onClick={() => setActiveTool("eraser")}
            title="Eraser"
            aria-label="Eraser tool"
          >
            <IconEraser size={14} />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette */}
        <div className="whiteboard-group whiteboard-colors">
          {COLORS.map((color) => (
            <button
              key={color.hex}
              type="button"
              className={`color-swatch ${activeColor === color.hex && activeTool !== "eraser" ? "is-active" : ""}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => {
                setActiveColor(color.hex);
                if (activeTool === "eraser") setActiveTool("pen");
              }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>

        {/* Stroke Size Selector */}
        <div className="whiteboard-group">
          {STROKE_SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              className={`whiteboard-btn whiteboard-btn--sm ${strokeWidth === size.value ? "is-active" : ""}`}
              onClick={() => setStrokeWidth(size.value)}
              title={`${size.label} stroke`}
            >
              <span
                className="stroke-dot"
                style={{ width: `${size.value + 3}px`, height: `${size.value + 3}px` }}
              />
              <span className="stroke-label">{size.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Undo, Clear, Save */}
        <div className="whiteboard-group whiteboard-actions">
          <button
            type="button"
            className="whiteboard-btn whiteboard-btn--icon"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo last stroke"
            aria-label="Undo stroke"
          >
            <IconUndo size={14} />
            <span>Undo</span>
          </button>
          <button
            type="button"
            className="whiteboard-btn whiteboard-btn--icon"
            onClick={handleClear}
            title="Clear whiteboard"
            aria-label="Clear canvas"
          >
            <IconTrash size={14} />
            <span>Clear</span>
          </button>
          <button
            type="button"
            className="whiteboard-btn whiteboard-btn--save"
            onClick={handleDownload}
            title="Download drawing as PNG"
            aria-label="Download sketch"
          >
            <IconDownload size={14} />
            <span>Export PNG</span>
          </button>
          <button
            type="button"
            className="whiteboard-btn whiteboard-btn--post"
            onClick={handlePostToWall}
            disabled={posting}
            title="Post this sketch to The Wall below"
            aria-label="Post sketch to wall"
          >
            <IconPin size={14} />
            <span>{posting ? "Posting..." : "Post to Wall"}</span>
          </button>
        </div>
      </div>

      {postNotice && (
        <div className="whiteboard-notice" role="status">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <IconPalette size={14} />
            <span>{postNotice}</span>
          </span>
        </div>
      )}

      {/* Drawing Canvas Frame */}
      <div ref={containerRef} className="whiteboard-frame card">
        <canvas
          ref={canvasRef}
          className="whiteboard-surface"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          style={{ touchAction: "none" }}
        />
        <div className="whiteboard-cue" aria-hidden="true">
          <span>Draw or sketch freely</span>
          <span>· Touch & stylus supported</span>
        </div>
      </div>
    </div>
  );
}

