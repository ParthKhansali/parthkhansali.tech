"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type LoungeUser,
  type WallMessage,
  loadUserSession,
  loadLocalDrawings,
  subscribeToWall,
} from "@/lib/lounge";
import { SEEDED_PINS, type WallPin } from "@/data/wallPins";
import WallGallery from "@/components/wall/WallGallery";
import WallPinModal from "@/components/wall/WallPinModal";
import RetroCrtStation from "@/components/lounge/RetroCrtStation";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageNode } from "@/lib/seo";

export default function LoungePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<LoungeUser | null>(null);
  const [livePins, setLivePins] = useState<WallPin[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore user session on mount
  useEffect(() => {
    setCurrentUser(loadUserSession());

    // Listen to Firebase auth changes if available
    import("@/lib/firebase")
      .then(({ auth }) => {
        import("firebase/auth").then(({ onAuthStateChanged }) => {
          onAuthStateChanged(auth, (u) => {
            if (u) {
              setCurrentUser({
                uid: u.uid,
                displayName: u.displayName || "Google User",
                email: u.email,
                photoURL: u.photoURL,
              });
            }
          });
        });
      })
      .catch(() => {});
  }, []);

  // Merge live / local Firestore messages with seeded pins
  useEffect(() => {
    const local = loadLocalDrawings();

    const convertToPin = (msg: WallMessage, index: number): WallPin => {
      const cleanTag = msg.text.startsWith("#")
        ? msg.text.slice(1).split(" ")[0].replace(/[^a-zA-Z]/g, "")
        : msg.drawing
        ? "Sketch"
        : "Visitor";

      const displayText = msg.text.startsWith("#")
        ? msg.text.replace(/^#[a-zA-Z]+\s*·\s*/, "")
        : msg.text;

      return {
        id: msg.id,
        name: msg.name,
        role: "Visitor",
        avatar: msg.avatar || "",
        text: displayText,
        drawing: msg.drawing,
        tag: cleanTag,
        createdAt: msg.createdAt || Date.now(),
        likes: Math.floor(Math.random() * 8) + 4,
        rotation: (index % 2 === 0 ? 1 : -1) * (0.8 + (index % 3) * 0.4),
      };
    };

    const initialLive = local.map(convertToPin);
    setLivePins(initialLive);

    // Subscribe to live Firestore updates
    let unsubscribe: (() => void) | undefined;
    subscribeToWall(
      (incoming) => {
        const converted = incoming.map(convertToPin);
        const existingIds = new Set(converted.map((p) => p.id));
        const combined = [...converted, ...initialLive.filter((p) => !existingIds.has(p.id))];
        setLivePins(combined);
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

    const local = loadLocalDrawings();
    setLivePins((prev) => {
      const newItems = local.map((msg, index) => ({
        id: msg.id,
        name: msg.name,
        role: "Visitor",
        avatar: msg.avatar || "",
        text: msg.text,
        drawing: msg.drawing,
        tag: msg.drawing ? "Sketch" : "Visitor",
        createdAt: msg.createdAt || Date.now(),
        likes: 1,
        rotation: (index % 2 === 0 ? 1 : -1) * 1.2,
      }));
      const seen = new Set(prev.map((p) => p.id));
      return [...newItems.filter((p) => !seen.has(p.id)), ...prev];
    });
  };

  // Combine seeded pins with live user contributions
  const allPins = [...livePins, ...SEEDED_PINS];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/lounge",
              name: "Lounge: Visitor Hub & Retro Terminal - Parth Khansali",
              description:
                "The Lounge: community visitor board for notes and sketches, plus a retro CRT station with arcade mini-games, live chat, and lofi beats.",
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
                Leave notes, sketches, reviews, or project feedback. Below the board, power up the retro CRT station to launch arcade games, chat live, or jam to lofi beats.
              </p>
            </div>

            {/* Glowing CTA Button */}
            <div className="wall-cta-wrap">
              <button
                type="button"
                className="btn btn--primary wall-pin-cta-btn"
                onClick={() => setModalOpen(true)}
              >
                <span className="wall-pin-cta-icon" aria-hidden="true">✏️</span>
                <span>Pin Something</span>
              </button>
              <p className="wall-cta-subnote">No password needed · Google Sign-in available</p>
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
