"use client";

/**
 * The lounge wall, backed by Firestore and Google Auth.
 *
 * Visitors authenticate with Google to pin notes or whiteboard sketches to The Wall.
 * Content is stored in Firestore and mirrored locally for immediate responsiveness.
 */

export interface WallMessage {
  id: string;
  name: string;
  text: string;
  createdAt: number;
  drawing?: string;
  avatar?: string;
  userEmail?: string;
}

export interface LoungeUser {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
}

export const MAX_MESSAGE_LENGTH = 280;
export const MAX_NAME_LENGTH = 28;
const MIN_INTERVAL_MS = 3000;
const MAX_PER_HOUR = 25;

const RATE_KEY = "pk_lounge_sends";
const USER_KEY = "pk_lounge_user";
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
  return `Visitor ${getClientId().slice(-4)}`;
}

export function loadUserSession(): LoungeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserSession(user: LoungeUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("pk_lounge_user_changed", { detail: user }));
  } catch {}
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new CustomEvent("pk_lounge_user_changed", { detail: null }));
  } catch {}
}

/** Google Sign-In via Firebase Auth */
export async function loginWithGoogle(): Promise<LoungeUser | null> {
  try {
    const { auth, googleProvider } = await import("@/lib/firebase");
    const { signInWithPopup } = await import("firebase/auth");
    const cred = await signInWithPopup(auth, googleProvider);
    if (!cred.user) return null;

    const u = cred.user;
    const loungeUser: LoungeUser = {
      uid: u.uid,
      displayName: u.displayName || "Google User",
      email: u.email,
      photoURL: u.photoURL,
    };
    saveUserSession(loungeUser);
    return loungeUser;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
      return null;
    }
    console.warn("Google sign-in notice:", error?.message || error);
    throw err;
  }
}

/** Sign out user */
export async function logoutUser(): Promise<void> {
  try {
    const { auth } = await import("@/lib/firebase");
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {}
  clearUserSession();
}

/**
 * Normalises text before storing or rendering: no control characters,
 * no unbounded length.
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

export function validateMessage(rawName: string, rawText: string): ValidationResult {
  const name = cleanText(rawName, MAX_NAME_LENGTH);
  const text = cleanText(rawText, MAX_MESSAGE_LENGTH);

  if (text.length < 2) {
    return { ok: false, error: "Write at least a couple of characters." };
  }

  // Reject basic URL spam
  if (/\b(?:https?:\/\/|www\.)\S+/i.test(text)) {
    return {
      ok: false,
      error: "Links are not permitted on the public wall to keep it clean.",
    };
  }

  return { ok: true, name: name || defaultName(), text };
}

export function checkRateLimit(): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: true };
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const history: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = history.filter((stamp) => now - stamp < 3600_000);

    const last = recent[recent.length - 1];
    if (last && now - last < MIN_INTERVAL_MS) {
      return { ok: false, error: "Hold on a moment before posting again." };
    }

    if (recent.length >= MAX_PER_HOUR) {
      return { ok: false, error: "Hourly limit reached from this session." };
    }

    recent.push(now);
    sessionStorage.setItem(RATE_KEY, JSON.stringify(recent));
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
    onError("This build has no database configured, so the wall is in local demo mode.");
    return () => {};
  }

  try {
    const { db, fs } = await collections();
    const fsMod = fs as FirestoreModule;
    const q = fsMod.query(
      fsMod.collection(db, "lounge_messages"),
      fsMod.orderBy("createdAt", "desc"),
      fsMod.limit(50),
    );

    return fsMod.onSnapshot(
      q,
      (snapshot) => {
        const messages: WallMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            name?: unknown;
            text?: unknown;
            createdAt?: unknown;
            drawing?: unknown;
            avatar?: unknown;
            userEmail?: unknown;
          };
          const stamp = data.createdAt as { toMillis?: () => number } | null;
          return {
            id: doc.id,
            name: cleanText(data.name, MAX_NAME_LENGTH) || "Visitor",
            text: cleanText(data.text, MAX_MESSAGE_LENGTH),
            drawing: typeof data.drawing === "string" ? data.drawing : undefined,
            avatar: typeof data.avatar === "string" ? data.avatar : undefined,
            userEmail: typeof data.userEmail === "string" ? data.userEmail : undefined,
            createdAt: typeof stamp?.toMillis === "function" ? stamp.toMillis() : Date.now(),
          };
        });
        onData(messages.reverse());
      },
      () => onError("Could not reach the wall live feed."),
    );
  } catch {
    onError("Could not reach the wall live feed.");
    return () => {};
  }
}

export function loadLocalDrawings(): WallMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("pk_lounge_local_drawings");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Post one text message. */
export async function postMessage(
  name: string,
  text: string,
  user?: LoungeUser | null,
): Promise<void> {
  const authorName = user?.displayName || cleanText(name, MAX_NAME_LENGTH) || defaultName();
  const avatar = user?.photoURL || undefined;
  const userEmail = user?.email || undefined;

  const newEntry: WallMessage = {
    id: `msg-${Date.now()}-${randomSuffix(4)}`,
    name: authorName,
    text,
    avatar,
    userEmail,
    createdAt: Date.now(),
  };

  try {
    const existing = loadLocalDrawings();
    existing.unshift(newEntry);
    localStorage.setItem("pk_lounge_local_drawings", JSON.stringify(existing.slice(0, 40)));
    window.dispatchEvent(new CustomEvent("pk_lounge_drawing_posted", { detail: newEntry }));
  } catch {}

  if (firebaseConfigured) {
    try {
      const { db, fs } = await collections();
      const fsMod = fs as FirestoreModule;
      await fsMod.addDoc(fsMod.collection(db, "lounge_messages"), {
        name: authorName,
        text,
        avatar: avatar || null,
        userEmail: userEmail || null,
        clientId: getClientId(),
        createdAt: fsMod.serverTimestamp(),
      });
    } catch {}
  }
}

/** Post a whiteboard drawing to The Wall. */
export async function postDrawing(
  name: string,
  drawingDataUrl: string,
  caption = "",
  user?: LoungeUser | null,
): Promise<void> {
  const authorName = user?.displayName || cleanText(name, MAX_NAME_LENGTH) || defaultName();
  const cleanCaption = cleanText(caption, MAX_MESSAGE_LENGTH);
  const avatar = user?.photoURL || undefined;
  const userEmail = user?.email || undefined;

  const newEntry: WallMessage = {
    id: `drawing-${Date.now()}-${randomSuffix(4)}`,
    name: authorName,
    text: cleanCaption,
    drawing: drawingDataUrl,
    avatar,
    userEmail,
    createdAt: Date.now(),
  };

  try {
    const existing = loadLocalDrawings();
    existing.unshift(newEntry);
    localStorage.setItem("pk_lounge_local_drawings", JSON.stringify(existing.slice(0, 40)));
    window.dispatchEvent(new CustomEvent("pk_lounge_drawing_posted", { detail: newEntry }));
  } catch {}

  if (firebaseConfigured) {
    try {
      const { db, fs } = await collections();
      const fsMod = fs as FirestoreModule;
      await fsMod.addDoc(fsMod.collection(db, "lounge_messages"), {
        name: authorName,
        text: cleanCaption,
        drawing: drawingDataUrl,
        avatar: avatar || null,
        userEmail: userEmail || null,
        clientId: getClientId(),
        createdAt: fsMod.serverTimestamp(),
      });
    } catch {}
  }
}
