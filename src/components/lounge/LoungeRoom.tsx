"use client";

import { useEffect, useRef, useState } from "react";
import { IconPin } from "@/components/ui/Icons";
import {
  MAX_MESSAGE_LENGTH,
  checkRateLimit,
  cleanText,
  firebaseConfigured,
  loadLocalDrawings,
  loadUserSession,
  loginWithGoogle,
  logoutUser,
  postMessage,
  subscribeToWall,
  validateMessage,
  type LoungeUser,
  type WallMessage,
} from "@/lib/lounge";

type Status = "loading" | "live" | "error" | "unconfigured";

function formatTime(stamp: number) {
  if (!stamp) return "";
  const date = new Date(stamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LoungeRoom() {
  const [status, setStatus] = useState<Status>(
    firebaseConfigured ? "loading" : "unconfigured",
  );
  const [statusNote, setStatusNote] = useState("");
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [user, setUser] = useState<LoungeUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  // Monitor Google Auth state
  useEffect(() => {
    queueMicrotask(() => {
      const saved = loadUserSession();
      if (saved) setUser(saved);
    });

    // Listen to Firebase auth changes if available
    let unsubscribeAuth: (() => void) | undefined;
    import("@/lib/firebase").then(({ auth }) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const u: LoungeUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || "Google User",
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            };
            setUser(u);
          }
        });
      });
    }).catch(() => {});

    const onUserChanged = (e: Event) => {
      const custom = e as CustomEvent<LoungeUser | null>;
      setUser(custom.detail);
    };

    window.addEventListener("pk_lounge_user_changed", onUserChanged);
    return () => {
      unsubscribeAuth?.();
      window.removeEventListener("pk_lounge_user_changed", onUserChanged);
    };
  }, []);

  useEffect(() => {
    mounted.current = true;

    // Load locally saved whiteboard drawings
    const local = loadLocalDrawings();
    if (local.length > 0) {
      queueMicrotask(() => {
        if (!mounted.current) return;
        setMessages(local);
        if (!firebaseConfigured) {
          setStatus("live");
        }
      });
    }

    let unsubscribe: (() => void) | undefined;

    subscribeToWall(
      (incoming) => {
        if (!mounted.current) return;
        const localDrawings = loadLocalDrawings();
        const ids = new Set(incoming.map((m) => m.id));
        const combined = [...incoming, ...localDrawings.filter((m) => !ids.has(m.id))].sort(
          (a, b) => a.createdAt - b.createdAt
        );
        setMessages(combined);
        setStatus("live");
        setStatusNote("");
      },
      (message) => {
        if (!mounted.current) return;
        const localDrawings = loadLocalDrawings();
        if (localDrawings.length > 0) {
          setMessages(localDrawings);
          setStatus("live");
          setStatusNote("");
        } else {
          setStatus(firebaseConfigured ? "error" : "unconfigured");
          setStatusNote(message);
        }
      },
    ).then((fn) => {
      unsubscribe = fn;
    });

    const onNewDrawing = (e: Event) => {
      const custom = e as CustomEvent<WallMessage>;
      if (custom.detail) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          if (ids.has(custom.detail.id)) return prev;
          return [...prev, custom.detail];
        });
      }
    };

    window.addEventListener("pk_lounge_drawing_posted", onNewDrawing);

    return () => {
      mounted.current = false;
      unsubscribe?.();
      window.removeEventListener("pk_lounge_drawing_posted", onNewDrawing);
    };
  }, []);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  async function handleGoogleSignIn() {
    setError("");
    setAuthLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
      }
    } catch {
      setError("Google authentication could not be completed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await logoutUser();
    setUser(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    // If user is not signed in with Google, trigger Google Auth
    if (!user) {
      await handleGoogleSignIn();
      return;
    }

    const checked = validateMessage(user.displayName, text);
    if (!checked.ok) {
      setError(checked.error);
      return;
    }

    const rate = checkRateLimit();
    if (!rate.ok) {
      setError(rate.error);
      return;
    }

    setSending(true);
    try {
      await postMessage(user.displayName, checked.text, user);
      setText("");
    } catch {
      setError("That did not send. The wall may be read-only, or you are offline.");
    } finally {
      if (mounted.current) setSending(false);
    }
  }

  return (
    <div className="wall" id="wall">
      <div className="stage-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="wall-pulse-dot" aria-hidden="true" />
          <span className="status-line">
            {status === "loading" ? "Connecting to the wall..." : null}
            {status === "live" ? "The Wall Remembers: Real-time visitor log" : null}
            {status === "error" ? "Wall offline (viewing cached pins)" : null}
            {status === "unconfigured" ? "Local sandbox mode" : null}
          </span>
        </div>
        <span className="measured" style={{ fontSize: "0.75rem" }}>
          {messages.length.toString().padStart(2, "0")} pins
        </span>
      </div>

      {statusNote ? (
        <p className="form-note" role="status">
          {statusNote}
        </p>
      ) : null}

      <div
        className="wall__log"
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="The Wall visitor contributions"
      >
        {status === "loading" && messages.length === 0 ? (
          <div className="wall__empty">Loading pins from the wall...</div>
        ) : null}

        {messages.length === 0 && status !== "loading" ? (
          <div className="wall__empty">
            Nothing pinned here yet. Sign in and leave the first note or sketch!
          </div>
        ) : null}

        {messages.map((message) => (
          <article className="wall__message" key={message.id}>
            <div className="wall__meta">
              <div className="wall__author-badge">
                {message.avatar ? (
                  <img
                    src={message.avatar}
                    alt=""
                    className="wall__avatar-img"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="wall__avatar-placeholder" aria-hidden="true">
                    {(message.name || "V")[0].toUpperCase()}
                  </span>
                )}
                <span className="wall__author">{message.name || "Visitor"}</span>
              </div>
              <span className="measured" style={{ fontSize: "0.6875rem" }}>
                {formatTime(message.createdAt)}
              </span>
            </div>

            {message.drawing && (
              <div className="wall__drawing-frame">
                <img
                  src={message.drawing}
                  alt={`Sketch by ${message.name || "Visitor"}`}
                  className="wall__drawing-img"
                  loading="lazy"
                />
              </div>
            )}

            {message.text && <p className="wall__text">{message.text}</p>}
          </article>
        ))}
      </div>

      {/* Google Authentication Box & Post Form */}
      {!user ? (
        <div className="wall-auth-banner">
          <div className="wall-auth-banner__copy">
            <span className="wall-auth-banner__tag">THE WALL REMEMBERS</span>
            <p className="wall-auth-banner__lead">
              Sign in with Google to pin notes or whiteboard drawings on the visitor wall.
            </p>
          </div>
          <button
            type="button"
            className="btn btn--primary wall-auth-banner__btn"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{authLoading ? "Connecting..." : "Sign in with Google"}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="wall-post-form">
          <div className="wall-auth-status">
            <div className="wall-auth-status__user">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="wall-auth-status__avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="wall-auth-status__fallback">{user.displayName[0]}</span>
              )}
              <div>
                <span className="wall-auth-status__name">{user.displayName}</span>
                <span className="wall-auth-status__email">{user.email || "Verified Visitor"}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--small wall-auth-status__signout"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>

          <div className="field" style={{ marginTop: "0.5rem" }}>
            <label htmlFor="wall-text" className="sr-only">
              Message to pin on the wall
            </label>
            <textarea
              id="wall-text"
              className="input"
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              placeholder={`Leave a note as ${user.displayName}... (or draw on the Whiteboard above)`}
              rows={2}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={sending}
              style={{ resize: "vertical", minHeight: "4rem" }}
            />
            <p className="form-note">
              {cleanText(text, MAX_MESSAGE_LENGTH).length}/{MAX_MESSAGE_LENGTH} characters.
              Pinned permanently to The Wall with your profile.
            </p>
          </div>

          {error && (
            <p className="form-note" role="alert" style={{ color: "var(--bad)" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="btn btn--primary" type="submit" disabled={sending || !text.trim()}>
              <IconPin size={14} />
              <span>{sending ? "Pinning..." : "Pin note to The Wall"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
