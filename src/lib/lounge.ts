"use client";

/**
 * The lounge wall, backed by Firestore.
 *
 * The previous implementation kept messages in a module-level array inside a
 * Next.js route handler. On Vercel every request can land on a different
 * instance, so a message posted by one visitor was invisible to the next and
 * vanished when the function was recycled. This uses the Firebase project the
 * site already depends on, so messages actually persist and arrive live.
 *
 * Abuse controls live here (length caps, content rules, a client-side rate
 * limit) because there is no server write path to enforce them on. The
 * companion `firestore.rules` file in the repo is the real boundary; these
 * checks keep honest visitors out of trouble and make casual spam pointless.
 */

export interface WallMessage {
  id: string;
  name: string;
  text: string;
  createdAt: number;
}

export const MAX_MESSAGE_LENGTH = 280;
export const MAX_NAME_LENGTH = 24;
const MIN_INTERVAL_MS = 4000;
const MAX_PER_HOUR = 20;

const RATE_KEY = "pk_lounge_sends";
const NAME_KEY = "pk_lounge_name";
const ID_KEY = "pk_lounge_id";

/** True when the build actually has a Firebase project configured. */
export const firebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);

function randomSuffix(length = 4) {
  return Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, length);
}

export function getClientId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = localStorage.getItem(ID_KEY);
    if (existing) return existing;
    const created = `guest-${Date.now().toString(36)}-${randomSuffix(5)}`;
    localStorage.setItem(ID_KEY, created);
    return created;
  } catch {
    return `guest-${randomSuffix(8)}`;
  }
}

export function defaultName(): string {
  return `Guest ${getClientId().slice(-4)}`;
}

export function loadName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function saveName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name.slice(0, MAX_NAME_LENGTH));
  } catch {
    /* storage is optional */
  }
}

/**
 * Normalises anything that arrives from the collection before it is rendered.
 * React escapes text on its own, so this is about shape, not XSS: no control
 * characters, no gigantic runs of whitespace, no unbounded length.
 */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export type ValidationResult = { ok: true; name: string; text: string } | { ok: false; error: string };

/** Rules a message has to pass before it is allowed to leave the browser. */
export function validateMessage(rawName: string, rawText: string): ValidationResult {
  const name = cleanText(rawName, MAX_NAME_LENGTH);
  const text = cleanText(rawText, MAX_MESSAGE_LENGTH);

  if (text.length < 2) {
    return { ok: false, error: "Write at least a couple of characters." };
  }
  if (/(https?:\/\/|www\.)/i.test(text)) {
    return { ok: false, error: "Links are not allowed on the wall." };
  }
  if (/(.)\1{9,}/.test(text)) {
    return { ok: false, error: "That looks like noise rather than a message." };
  }

  return { ok: true, name: name || defaultName(), text };
}

/** Token bucket kept in localStorage. Honest clients only, by design. */
export function checkRateLimit(): { ok: true } | { ok: false; error: string } {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_KEY);
    const history: number[] = raw ? JSON.parse(raw) : [];
    const recent = history.filter((stamp) => now - stamp < 60 * 60 * 1000);

    if (recent.length && now - recent[recent.length - 1] < MIN_INTERVAL_MS) {
      return { ok: false, error: "Give it a few seconds between messages." };
    }
    if (recent.length >= MAX_PER_HOUR) {
      return { ok: false, error: "You have posted a lot in the last hour. Try again later." };
    }

    recent.push(now);
    localStorage.setItem(RATE_KEY, JSON.stringify(recent));
    return { ok: true };
  } catch {
    return { ok: true };
  }
}

type FirestoreModule = typeof import("firebase/firestore");

async function collections() {
  const [{ db }, fs] = await Promise.all([
    import("@/lib/firebase"),
    import("firebase/firestore"),
  ]);
  return { db, fs };
}

/** Subscribe to the newest messages. Returns an unsubscribe function. */
export async function subscribeToWall(
  onData: (messages: WallMessage[]) => void,
  onError: (message: string) => void,
): Promise<() => void> {
  if (!firebaseConfigured) {
    onError("This build has no database configured, so the wall is offline.");
    return () => {};
  }

  try {
    const { db, fs } = await collections();
    const fsMod = fs as FirestoreModule;
    const q = fsMod.query(
      fsMod.collection(db, "lounge_messages"),
      fsMod.orderBy("createdAt", "desc"),
      fsMod.limit(40),
    );

    return fsMod.onSnapshot(
      q,
      (snapshot) => {
        const messages: WallMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data() as { name?: unknown; text?: unknown; createdAt?: unknown };
          const stamp = data.createdAt as { toMillis?: () => number } | null;
          return {
            id: doc.id,
            name: cleanText(data.name, MAX_NAME_LENGTH) || "Guest",
            text: cleanText(data.text, MAX_MESSAGE_LENGTH),
            createdAt: typeof stamp?.toMillis === "function" ? stamp.toMillis() : 0,
          };
        });
        onData(messages.reverse());
      },
      () => onError("Could not reach the wall. It may be read-only right now."),
    );
  } catch {
    onError("Could not reach the wall. It may be read-only right now.");
    return () => {};
  }
}

/** Post one message. Throws with a readable reason on failure. */
export async function postMessage(name: string, text: string): Promise<void> {
  const { db, fs } = await collections();
  const fsMod = fs as FirestoreModule;

  await fsMod.addDoc(fsMod.collection(db, "lounge_messages"), {
    name,
    text,
    clientId: getClientId(),
    createdAt: fsMod.serverTimestamp(),
  });
}
