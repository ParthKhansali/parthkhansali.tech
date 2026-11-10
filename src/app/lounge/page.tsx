"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  type LoungeUser,
  type WallMessage,
  completeGoogleRedirect,
  loadUserSession,
  loadLocalDrawings,
  saveUserSession,
  subscribeToWall,
} from "@/lib/lounge";
import { HOST_NOTES, type WallPin } from "@/data/wallPins";
import WallGallery from "@/components/wall/WallGallery";
import WallPinModal from "@/components/wall/WallPinModal";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageNode } from "@/lib/seo";
import { IconPen } from "@/components/ui/Icons";

const RetroCrtStation = dynamic(() => import("@/components/lounge/RetroCrtStation"), {
  ssr: false,
  loading: () => (
    <div className="crt-station-wrapper" aria-busy="true">
      <div className="crt-cabinet" style={{ minHeight: "620px", display: "grid", placeItems: "center" }}>
        <p className="tag tag--dim">Booting CRT-94 Workstation...</p>
      </div>
    </div>
  ),
});

function msgToWallPin(msg: WallMessage, index: number): WallPin {
  const cleanTag = msg.text.startsWith("#")
    ? msg.text.slice(1).split(" ")[0].replace(/[^a-zA-Z]/g, "")
    : msg.drawing
    ? "Sketch"
    : "Visitor";

  const displayText = msg.text.startsWith("#")
    ? msg.text.replace(/^#[a-zA-Z]+\s*(?:·\s*)?/, "")
    : msg.text;

  return {
    id: msg.id,
    name: msg.name,
    role: "Visitor",
    avatar: msg.avatar || "",
    text: displayText || (msg.drawing ? "Whiteboard sketch" : ""),
    drawing: msg.drawing,
    tag: cleanTag || (msg.drawing ? "Sketch" : "Visitor"),
    createdAt: msg.createdAt || Date.now(),
    likes: 1,
    rotation: (index % 2 === 0 ? 1 : -1) * (0.6 + (index % 3) * 0.35),
  };
}

export default function LoungePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<LoungeUser | null>(null);
  const [livePins, setLivePins] = useState<WallPin[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore user session and complete redirect-based Google sign-in if returning
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      const saved = loadUserSession();
      if (saved && active) setCurrentUser(saved);
    });

    completeGoogleRedirect().then(({ user, wasRedirect }) => {
      if (!active) return;
      if (user) setCurrentUser(user);
      if (wasRedirect) setModalOpen(true);
    });

    // Listen to Firebase auth changes if available
    import("@/lib/firebase")
      .then(({ auth }) => {
        import("firebase/auth").then(({ onAuthStateChanged }) => {
          onAuthStateChanged(auth, (u) => {
            if (u && active) {
              const mapped: LoungeUser = {
                uid: u.uid,
                displayName: u.displayName || "Google User",
                email: u.email,
                photoURL: u.photoURL,
              };
              setCurrentUser(mapped);
              saveUserSession(mapped);
            }
          });
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Merge live / local Firestore messages with seeded pins
  useEffect(() => {
    const initialLive = loadLocalDrawings().map(msgToWallPin);
    if (initialLive.length > 0) {
      queueMicrotask(() => setLivePins(initialLive));
    }

    // Subscribe to live Firestore updates
    let unsubscribe: (() => void) | undefined;
    subscribeToWall(
      (incoming) => {
        const converted = incoming.map(msgToWallPin);
        const existingIds = new Set(converted.map((p) => p.id));
        const localOnly = loadLocalDrawings()
          .map(msgToWallPin)
          .filter((p) => !existingIds.has(p.id));
        setLivePins([...converted, ...localOnly]);
      },
      () => {}
    ).then((fn) => {
      unsubscribe = fn;
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handlePinSuccess = () => {
    setToastMessage("Pinned to the Lounge! Your contribution is live.");
    setTimeout(() => setToastMessage(null), 4000);

    const local = loadLocalDrawings().map(msgToWallPin);
    setLivePins((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      return [...local.filter((p) => !seen.has(p.id)), ...prev];
    });
  };

  // Combine live visitor submissions first with clearly labeled host notes/sketches
  const allPins = [...livePins, ...HOST_NOTES];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/lounge",
              name: "The Lounge: Visitor Wall & Retro CRT Station - Parth Khansali",
              description:
                "The Lounge: community visitor board for Google-authenticated notes and sketches, plus a retro CRT station with arcade mini-games, chatroom, and lofi audio.",
            }),
            breadcrumbNode([
              { name: "Home", path: "/" },
              { name: "Lounge", path: "/lounge" },
            ]),
          ],
        }}
      />

      <div className="page-head">
        <div className="shell">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="crumbs__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Lounge</span>
          </nav>

          <div className="wall-header-row">
            <div>
              <div className="wall-header-badge">
                <span className="wall-header-pulse" aria-hidden="true" />
                <span>VISITOR HUB // DEHRADUN</span>
              </div>
              <h1 className="display display--page">The Lounge</h1>
              <p className="lede" style={{ marginTop: "0.85rem", maxWidth: "62ch" }}>
                Leave a note or whiteboard sketch below, or power up the retro CRT station for Snake, Pong, reflex tests, and lofi tracks.
              </p>
            </div>

            {/* Glowing CTA Button */}
            <div className="wall-cta-wrap">
              <button
                type="button"
                className="btn btn--primary wall-pin-cta-btn"
                onClick={() => setModalOpen(true)}
              >
                <IconPen size={16} className="wall-pin-cta-icon" />
                <span>Pin Something</span>
              </button>
              <p className="wall-cta-subnote">Google Sign-in required to post on The Wall</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="wall-toast" role="status" aria-live="polite">
          <span className="wall-toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: The Main Visitor Wall Gallery */}
      <section className="section" style={{ paddingBlockStart: "1.5rem" }}>
        <div className="shell">
          <WallGallery pins={allPins} />
        </div>
      </section>

      {/* SECTION 2: The Retro Glitch CRT Station */}
      <section className="section" id="terminal" style={{ paddingBlockStart: "3rem" }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="section-label">Retro Lounge Terminal</p>
              <h2>The CRT Cyber Workstation</h2>
            </div>
            <p className="section-note">
              Click any desktop app icon to launch arcade mini-games, drop into the chatroom, vibe to lofi beats, or stream the midnight cinema.
            </p>
          </div>

          <RetroCrtStation />
        </div>
      </section>

      {/* Interactive Modal Drawer for Notes & Drawings */}
      <WallPinModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentUser={currentUser}
        onUserLogin={(user) => setCurrentUser(user)}
        onPinSuccess={handlePinSuccess}
      />
    </>
  );
}
