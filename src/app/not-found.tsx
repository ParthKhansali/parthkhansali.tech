import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="shell not-found">
      <p className="measured">404</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
        This page is not here.
      </h1>
      <p className="body-copy">
        The link may be older than the site, or I may have moved something without
        leaving a forwarding address. These still work:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link className="btn btn--primary" href="/">
          Home
        </Link>
        <Link className="btn" href="/projects">
          Work
        </Link>
        <Link className="btn" href="/resume">
          Resume
        </Link>
      </div>
    </div>
  );
}
