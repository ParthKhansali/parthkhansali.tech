"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAX_MESSAGE_LENGTH,
  checkRateLimit,
  cleanText,
  firebaseConfigured,
  postMessage,
  saveName,
  subscribeToWall,
  validateMessage,
  type WallMessage,
} from "@/lib/lounge";
import { useStoredValue } from "@/lib/useStoredValue";

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
  const storedName = useStoredValue("pk_lounge_name");
  const [draftName, setDraftName] = useState<string | null>(null);
  const name = draftName ?? storedName;
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    let unsubscribe: (() => void) | undefined;

    subscribeToWall(
      (incoming) => {
        if (!mounted.current) return;
        setMessages(incoming);
        setStatus("live");
        setStatusNote("");
      },
      (message) => {
        if (!mounted.current) return;
        setStatus(firebaseConfigured ? "error" : "unconfigured");
        setStatusNote(message);
      },
    ).then((fn) => {
      unsubscribe = fn;
    });

    return () => {
      mounted.current = false;
      unsubscribe?.();
    };
  }, []);

  // Keep the newest message in view without hijacking the page scroll.
  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (status === "unconfigured" || status === "error") {
      setError("The wall cannot accept messages from this build right now.");
      return;
    }

    const checked = validateMessage(name, text);
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
      await postMessage(checked.name, checked.text);
      saveName(checked.name);
      setDraftName(checked.name);
      setText("");
    } catch {
      setError("That did not send. The wall may be read-only, or you are offline.");
    } finally {
      if (mounted.current) setSending(false);
    }
  }

  const disabled = status === "unconfigured" || status === "error";

  return (
    <div className="wall">
      <div className="stage-bar">
        <span className="status-line">
          {status === "loading" ? "Connecting to the wall…" : null}
          {status === "live" ? "Live. Messages arrive as they are posted." : null}
          {status === "error" ? "Wall unavailable." : null}
          {status === "unconfigured" ? "No database in this build." : null}
        </span>
        <span className="measured" style={{ fontSize: "0.75rem" }}>
          {messages.length.toString().padStart(2, "0")} messages
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
        aria-label="Lounge wall messages"
      >
        {status === "loading" ? (
          <div className="wall__empty">Loading the last few messages…</div>
        ) : null}

        {status !== "loading" && messages.length === 0 ? (
          <div className="wall__empty">
            Nothing here yet. Say something and it will be the first thing anyone
            reads.
          </div>
        ) : null}

        {messages.map((message) => (
          <article className="wall__message" key={message.id}>
            <div className="wall__meta">
              <span className="wall__author">{message.name || "Guest"}</span>
              <span className="measured" style={{ fontSize: "0.6875rem" }}>
                {formatTime(message.createdAt)}
              </span>
            </div>
            <p className="wall__text">{message.text}</p>
          </article>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="wall-name">
            <span>Name</span>
          </label>
          <input
            id="wall-name"
            className="input"
            value={name}
            onChange={(event) => setDraftName(event.target.value.slice(0, 24))}
            placeholder="Name, or leave it blank"
            maxLength={24}
            autoComplete="nickname"
            disabled={disabled}
          />
        </div>

        <div className="field" style={{ marginTop: "0.75rem" }}>
          <label htmlFor="wall-text">
            <span>Message</span>
          </label>
          <textarea
            id="wall-text"
            className="input"
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            placeholder="What are you building, or what broke today?"
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={disabled}
            style={{ resize: "vertical", minHeight: "5rem" }}
          />
          <p className="form-note">
            {cleanText(text, MAX_MESSAGE_LENGTH).length}/{MAX_MESSAGE_LENGTH} characters.
            Public and permanent — so no links, and nothing private.
          </p>
        </div>

        {error ? (
          <p className="form-note" role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button className="btn btn--primary" type="submit" disabled={sending || disabled}>
            {sending ? "Sending…" : "Post to the wall"}
          </button>
        </div>
      </form>
    </div>
  );
}
