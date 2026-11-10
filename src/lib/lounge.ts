"use client";

/**
 * The lounge wall, backed by Firestore and Google Auth.
 *
 * Visitors authenticate with Google to pin notes or whiteboard sketches to The Wall.
 * Content is stored in Firestore and mirrored locally for immediate responsiveness.
 */

import { firebaseConfig } from "@/lib/firebaseConfig";

export interface WallMessage {
  id: string;
  name: string;
  text: string;
  createdAt: number;
  drawing?: string;
  avatar?: string;
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
const REDIRECT_FLAG = "pk_lounge_google_redirect";

/** True when the build actually has a Firebase project configured. */
export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
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

function userFromFirebase(u: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): LoungeUser {
  return {
    uid: u.uid,
    displayName: u.displayName || "Google User",
    email: u.email,
    photoURL: u.photoURL,
  };
}

export function formatGoogleAuthError(err: unknown): string {
  const error = err as { code?: string; message?: string };
  const code = error?.code || "";
  const host = typeof window !== "undefined" ? window.location.hostname : "this domain";

  if (code === "auth/unauthorized-domain") {
    return `Domain "${host}" is not authorized in Firebase Authentication -> Authorized domains.`;
  }
  if (code === "auth/popup-blocked") {
    return "Popup was blocked by the browser. Allow popups or retry with redirect.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Sign-in window closed before finishing. Allow popups for this site and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error while contacting Google Sign-in. Check your connection and retry.";
  }
  if (code === "auth/invalid-api-key" || code === "auth/missing-config") {
    return "Firebase authentication is missing configuration for this deployment.";
  }
  return error?.message
    ? `Google Sign-in failed (${code || "error"}): ${error.message}`
    : "Google authentication could not be completed. Please try again.";
}

/** Finish any pending redirect-based Google Sign-In on page load. */
export async function completeGoogleRedirect(): Promise<{
  user: LoungeUser | null;
  wasRedirect: boolean;
}> {
  if (!firebaseConfigured || typeof window === "undefined") {
    return { user: null, wasRedirect: false };
  }
  let wasRedirect = false;
  try {
    wasRedirect = sessionStorage.getItem(REDIRECT_FLAG) === "1";
    sessionStorage.removeItem(REDIRECT_FLAG);
  } catch {}

  try {
    const [{ auth }, { getRedirectResult }] = await Promise.all([
      import("@/lib/firebase"),
      import("firebase/auth"),
    ]);
    const cred = await getRedirectResult(auth);
    if (cred?.user) {
      const loungeUser = userFromFirebase(cred.user);
      saveUserSession(loungeUser);
      return { user: loungeUser, wasRedirect: true };
    }
  } catch (err) {
    console.warn("Google redirect sign-in notice:", err);
  }
  return { user: null, wasRedirect };
}

/** Google Sign-In via Firebase Auth (popup with automatic redirect fallback). */
export async function loginWithGoogle(): Promise<LoungeUser | null> {
  if (!firebaseConfigured) {
    throw Object.assign(new Error("Missing Firebase configuration."), {
      code: "auth/missing-config",
    });
  }

  try {
    const [{ auth, googleProvider }, { signInWithPopup, signInWithRedirect }] =
      await Promise.all([import("@/lib/firebase"), import("firebase/auth")]);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (!cred.user) return null;
      const loungeUser = userFromFirebase(cred.user);
      saveUserSession(loungeUser);
      return loungeUser;
    } catch (popupErr: unknown) {
      const pErr = popupErr as { code?: string };
      if (
        pErr?.code === "auth/popup-blocked" ||
        pErr?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        try {
          sessionStorage.setItem(REDIRECT_FLAG, "1");
        } catch {}
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw popupErr;
    }
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error?.code === "auth/cancelled-popup-request") {
      return null;
    }
    console.warn("Google sign-in notice:", error?.code || error?.message || error);
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
          };
          const stamp = data.createdAt as { toMillis?: () => number } | null;
          return {
            id: doc.id,
            name: cleanText(data.name, MAX_NAME_LENGTH) || "Visitor",
            text: cleanText(data.text, MAX_MESSAGE_LENGTH),
            drawing: typeof data.drawing === "string" ? data.drawing : undefined,
            avatar: typeof data.avatar === "string" ? data.avatar : undefined,
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

function saveLocalPin(entry: WallMessage): void {
  try {
    const existing = loadLocalDrawings();
    const filtered = existing.filter((item) => item.id !== entry.id);
    filtered.unshift(entry);
    localStorage.setItem("pk_lounge_local_drawings", JSON.stringify(filtered.slice(0, 40)));
    window.dispatchEvent(new CustomEvent("pk_lounge_drawing_posted", { detail: entry }));
  } catch {}
}

/** Post one text message. */
export async function postMessage(
  name: string,
  text: string,
  user?: LoungeUser | null,
): Promise<WallMessage> {
  const authorName =
    cleanText(user?.displayName || name, MAX_NAME_LENGTH) || defaultName();
  const rawAvatar = user?.photoURL || "";
  const avatar =
    rawAvatar.startsWith("https://") ? rawAvatar.slice(0, 512) : undefined;
  let remoteId: string | null = null;

  if (firebaseConfigured) {
    try {
      const { db, fs } = await collections();
      const fsMod = fs as FirestoreModule;
      const clientId = getClientId();
      try {
        const ref = await fsMod.addDoc(fsMod.collection(db, "lounge_messages"), {
          name: authorName,
          text,
          clientId,
          createdAt: fsMod.serverTimestamp(),
          ...(user?.uid ? { uid: user.uid } : {}),
          ...(avatar ? { avatar } : {}),
        });
        remoteId = ref.id;
      } catch {
        const fallbackRef = await fsMod.addDoc(
          fsMod.collection(db, "lounge_messages"),
          {
            name: cleanText(authorName, 24) || "Visitor",
            text: cleanText(text, MAX_MESSAGE_LENGTH),
            clientId,
            createdAt: fsMod.serverTimestamp(),
          },
        );
        remoteId = fallbackRef.id;
      }
    } catch (err) {
      console.warn("Firestore message write skipped:", err);
    }
  }

  const newEntry: WallMessage = {
    id: remoteId || `msg-${Date.now()}-${randomSuffix(4)}`,
    name: authorName,
    text,
    avatar,
    createdAt: Date.now(),
  };

  saveLocalPin(newEntry);
  return newEntry;
}

/** Post a whiteboard drawing to The Wall. */
export async function postDrawing(
  name: string,
  drawingDataUrl: string,
  caption = "",
  user?: LoungeUser | null,
): Promise<WallMessage> {
  const authorName =
    cleanText(user?.displayName || name, MAX_NAME_LENGTH) || defaultName();
  const cleanCaption = cleanText(caption, MAX_MESSAGE_LENGTH);
  const rawAvatar = user?.photoURL || "";
  const avatar =
    rawAvatar.startsWith("https://") ? rawAvatar.slice(0, 512) : undefined;
  let remoteId: string | null = null;

  if (firebaseConfigured) {
    try {
      const { db, fs } = await collections();
      const fsMod = fs as FirestoreModule;
      const ref = await fsMod.addDoc(fsMod.collection(db, "lounge_messages"), {
        name: authorName,
        text: cleanCaption,
        drawing: drawingDataUrl,
        clientId: getClientId(),
        createdAt: fsMod.serverTimestamp(),
        ...(user?.uid ? { uid: user.uid } : {}),
        ...(avatar ? { avatar } : {}),
      });
      remoteId = ref.id;
    } catch (err) {
      console.warn("Firestore drawing write skipped:", err);
    }
  }

  const newEntry: WallMessage = {
    id: remoteId || `drawing-${Date.now()}-${randomSuffix(4)}`,
    name: authorName,
    text: cleanCaption,
    drawing: drawingDataUrl,
    avatar,
    createdAt: Date.now(),
  };

  saveLocalPin(newEntry);
  return newEntry;
}
