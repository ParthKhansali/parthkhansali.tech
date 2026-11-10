"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  type LoungeUser,
  loginWithGoogle,
  postMessage,
  postDrawing,
  checkRateLimit,
  cleanText,
  MAX_MESSAGE_LENGTH,
} from "@/lib/lounge";
import {
  IconBrush,
  IconEraser,
  IconPen,
  IconPin,
  IconTrash,
  IconUndo,
} from "@/components/ui/Icons";

interface WallPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: LoungeUser | null;
  onUserLogin: (user: LoungeUser) => void;
  onPinSuccess: () => void;
}

const TAG_OPTIONS = [
  "General",
  "Review",
  "Architecture",
  "Campus",
  "Shoutout",
  "Question",
];

const COLORS = [
  { name: "Neon Emerald", hex: "#00ef4e" },
  { name: "Cyber Cyan", hex: "#00cbf0" },
  { name: "Electric Amber", hex: "#fbbf24" },
  { name: "Hot Rose", hex: "#f43f5e" },
  { name: "Ultra Violet", hex: "#a855f7" },
  { name: "Pure White", hex: "#ffffff" },
];

export default function WallPinModal({
  isOpen,
  onClose,
  currentUser,
  onUserLogin,
  onPinSuccess,
}: WallPinModalProps) {
  const [activeTab, setActiveTab] = useState<"note" | "draw">("note");
  const [noteText, setNoteText] = useState("");
  const [selectedTag, setSelectedTag] = useState("General");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<"pen" | "marker" | "eraser">("pen");
  const [activeColor, setActiveColor] = useState<string>("#00ef4e");
  const strokeWidth = 4;
  const [canUndo, setCanUndo] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Canvas resize and setup when opening draw tab
  useEffect(() => {
    if (!isOpen || activeTab !== "draw") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const timer = setTimeout(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width || 480);
      const h = Math.floor(rect.height || 280);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "#0e1015";
        ctx.fillRect(0, 0, w, h);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab]);

  // Push state to undo history
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 15) historyRef.current.shift();
    setCanUndo(true);
  }, []);

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prev = historyRef.current.pop();
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      setCanUndo(historyRef.current.length > 0);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    pushHistory();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#0e1015";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
  };

  // Drawing event handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pushHistory();
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.strokeStyle = "#0e1015";
      ctx.lineWidth = strokeWidth * 4;
    } else if (activeTool === "marker") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth * 2.2;
      ctx.globalAlpha = 0.6;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;
    }

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  // Google Sign-In
  const handleGoogleAuth = async () => {
    setError(null);
    setAuthLoading(true);
    try {
      const u = await loginWithGoogle();
      if (u) {
        onUserLogin(u);
      }
    } catch {
      setError("Google authentication could not be completed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      await handleGoogleAuth();
      return;
    }

    const rate = checkRateLimit();
    if (!rate.ok) {
      setError(rate.error);
      return;
    }

    setSubmitting(true);
    try {
      if (activeTab === "note") {
        const clean = cleanText(noteText, MAX_MESSAGE_LENGTH);
        if (clean.length < 3) {
          setError("Write at least a few words for your note.");
          setSubmitting(false);
          return;
        }
        await postMessage(currentUser.displayName, `#${selectedTag} · ${clean}`, currentUser);
      } else {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/webp", 0.88);
        await postDrawing(
          currentUser.displayName,
          dataUrl,
          `#${selectedTag} Whiteboard sketch`,
          currentUser
        );
      }

      onPinSuccess();
      onClose();
      setNoteText("");
    } catch {
      setError("Could not post pin right now. The wall may be read-only.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="awrs-modal-backdrop" onClick={onClose}>
      <div
        className="wall-modal-card card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pin Something on The Wall"
      >
        {/* Header */}
        <div className="wall-modal-head">
          <div>
            <span className="wall-modal-tag">THE WALL REMEMBERS</span>
            <h2 className="wall-modal-title">Pin Something</h2>
          </div>
          <button
            type="button"
            className="awrs-search-clear"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="wall-modal-tabs">
          <button
            type="button"
            className={`wall-modal-tab ${activeTab === "note" ? "is-active" : ""}`}
            onClick={() => setActiveTab("note")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Write a Note</span>
          </button>

          <button
            type="button"
            className={`wall-modal-tab ${activeTab === "draw" ? "is-active" : ""}`}
            onClick={() => setActiveTab("draw")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span>Draw Something</span>
          </button>
        </div>

        {/* Authentication Notice if not signed in */}
        {!currentUser && (
          <div className="wall-modal-auth">
            <p className="wall-modal-auth-desc">
              Sign in with Google so your pin carries your avatar and verified author name.
            </p>
            <button
              type="button"
              className="btn btn--primary wall-google-btn"
              onClick={handleGoogleAuth}
              disabled={authLoading}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>{authLoading ? "Connecting..." : "Continue with Google to Pin"}</span>
            </button>
          </div>
        )}

        {/* User Identity pill if signed in */}
        {currentUser && (
          <div className="wall-modal-user">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="" className="wall-modal-user-avatar" referrerPolicy="no-referrer" />
            ) : (
              <span className="wall-modal-user-avatar fallback">{currentUser.displayName[0]}</span>
            )}
            <div className="wall-modal-user-info">
              <span className="wall-modal-user-name">{currentUser.displayName}</span>
              <span className="wall-modal-user-email">{currentUser.email}</span>
            </div>
          </div>
        )}

        {/* Tag selection pills */}
        <div className="wall-modal-tags">
          <span className="wall-modal-tags-label">Tag:</span>
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`wall-tag-pill ${selectedTag === tag ? "is-selected" : ""}`}
              onClick={() => setSelectedTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Note Editor Tab */}
        {activeTab === "note" && (
          <div className="wall-modal-note-body">
            <textarea
              className="wall-modal-textarea"
              placeholder={
                currentUser
                  ? `Write a review, thought, or note as ${currentUser.displayName}...`
                  : "Write your note or review here..."
              }
              value={noteText}
              onChange={(e) => setNoteText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <div className="wall-modal-counter">
              <span>{cleanText(noteText, MAX_MESSAGE_LENGTH).length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
          </div>
        )}

        {/* Whiteboard Drawing Canvas Tab */}
        {activeTab === "draw" && (
          <div className="wall-modal-draw-body">
            <div className="wall-draw-tools">
              <div className="wall-draw-group">
                <button
                  type="button"
                  className={`wall-tool-btn ${activeTool === "pen" ? "is-active" : ""}`}
                  onClick={() => setActiveTool("pen")}
                >
                  <IconPen size={13} />
                  <span>Pen</span>
                </button>
                <button
                  type="button"
                  className={`wall-tool-btn ${activeTool === "marker" ? "is-active" : ""}`}
                  onClick={() => setActiveTool("marker")}
                >
                  <IconBrush size={13} />
                  <span>Marker</span>
                </button>
                <button
                  type="button"
                  className={`wall-tool-btn ${activeTool === "eraser" ? "is-active" : ""}`}
                  onClick={() => setActiveTool("eraser")}
                >
                  <IconEraser size={13} />
                  <span>Eraser</span>
                </button>
              </div>

              <div className="wall-draw-colors">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`wall-color-dot ${activeColor === c.hex && activeTool !== "eraser" ? "is-active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => {
                      setActiveColor(c.hex);
                      if (activeTool === "eraser") setActiveTool("pen");
                    }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="wall-draw-actions">
                <button
                  type="button"
                  className="wall-tool-btn"
                  onClick={handleUndo}
                  disabled={!canUndo}
                >
                  <IconUndo size={13} />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  className="wall-tool-btn"
                  onClick={handleClear}
                >
                  <IconTrash size={13} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="wall-modal-canvas-frame">
              <canvas
                ref={canvasRef}
                className="wall-modal-canvas"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                style={{ touchAction: "none" }}
              />
            </div>
          </div>
        )}

        {error && <p className="wall-modal-error">{error}</p>}

        {/* Footer Actions */}
        <div className="wall-modal-foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={submitting || (activeTab === "note" && !noteText.trim())}
          >
            <IconPin size={14} />
            <span>{submitting ? "Pinning..." : activeTab === "note" ? "Pin Note" : "Pin Sketch"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

