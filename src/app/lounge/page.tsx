import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageMetadata, pageNode } from "@/lib/seo";
import LoungeRoom from "@/components/lounge/LoungeRoom";
import CodeSnake from "@/components/lounge/CodeSnake";
import LatencyReflex from "@/components/lounge/LatencyReflex";
import PixelPong from "@/components/lounge/PixelPong";

const description =
  "The lounge: three small browser games and a public wall for anyone who wants to leave a note. No account, no tracking, no leaderboard theatre.";

export const metadata: Metadata = pageMetadata({
  title: "Lounge",
  description,
  path: "/lounge",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Lounge", path: "/lounge" },
];

export default function LoungePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/lounge",
              name: "Lounge — Parth Khansali",
              description,
            }),
            breadcrumbNode(trail),
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

          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>
            Lounge
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Three small games and a wall. Everything here runs in your browser and
            needs no account. The wall is public and permanent, so treat it like a
            noticeboard.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingBlockStart: "2rem" }}>
        <div className="shell">
          <div className="section-head">
            <h2>Games</h2>
            <p className="section-note">
              Built for a phone first: swipe, drag and tap. Keyboard works too if you
              are on a laptop.
            </p>
          </div>

          <div className="game-grid">
            <CodeSnake />
            <div className="panels" style={{ border: 0, borderRadius: 0 }}>
              <PixelPong />
              <LatencyReflex />
            </div>
          </div>
        </div>
      </section>

      <section className="band band--deep section">
        <div className="shell">
          <div className="section-head">
            <h2>The wall</h2>
            <p className="section-note">
              Leave a note about what you are building. Messages arrive live and stay
              up. No links, nothing private.
            </p>
          </div>

          <div className="feature-grid">
            <LoungeRoom />

            <div className="panels">
              <div className="panel-body">
                <p className="label">How it works</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)", fontSize: "0.9375rem" }}>
                  Messages are stored in the same Firebase project this site already
                  uses, so a note posted on your phone shows up on my laptop. No
                  polling, no fake presence counter.
                </p>
              </div>
              <div className="panel-body">
                <p className="label">House rules</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)", fontSize: "0.9375rem" }}>
                  No links, no spam, nothing you would not put on a whiteboard in a
                  lecture hall. Messages are capped at 280 characters and rate-limited.
                </p>
              </div>
              <div className="panel-body">
                <p className="label">Want to say something longer?</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)", fontSize: "0.9375rem" }}>
                  Email is better for anything that is not a one-liner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
