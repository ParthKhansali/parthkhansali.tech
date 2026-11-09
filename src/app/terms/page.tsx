import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, pageNode } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms of Use for parthkhansali.com: intellectual property, acceptable use, and visitor wall guidelines.",
  path: "/terms",
});

export default function TermsPage() {
  const jsonLd = pageNode({
    path: "/terms",
    name: "Terms of Use",
    description: "Terms of Use for parthkhansali.com",
    type: "WebPage",
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="shell shell--narrow" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "5rem" }}>
        <div className="crumbs">
          <Link href="/">Home</Link>
          <span className="crumbs__sep">/</span>
          <span>Legal</span>
          <span className="crumbs__sep">/</span>
          <span>Terms of Use</span>
        </div>

        <header className="page-head" style={{ marginBottom: "2.5rem" }}>
          <p className="eyebrow">Legal</p>
          <h1 className="display display--hero" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Terms of Use
          </h1>
          <p className="lead" style={{ marginTop: "0.5rem", color: "var(--fg-dim)" }}>
            Last updated: May 2026
          </p>
        </header>

        <article className="prose-block" style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: "1.7", color: "var(--fg)" }}>
          <section>
            <p style={{ fontSize: "1.1rem" }}>
              By accessing and using parthkhansali.com, you agree to the following terms and conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Acceptance of Terms
            </h2>
            <p>
              By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree, please discontinue using this website.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Intellectual Property
            </h2>
            <p>
              All content on this website, including but not limited to project architecture, design assets, and written articles, is the intellectual property of Parth Khansali unless otherwise noted or licensed under open-source terms. Open-source repositories remain governed by their respective licenses (e.g. MIT).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Restrictions on Use
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>You agree not to:</p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Use this website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any infrastructure or database collections</li>
              <li>Impersonate another person on The Wall</li>
              <li>Post harmful, offensive, or malicious content on The Wall</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              User Generated Content (The Wall)
            </h2>
            <p>
              The Wall feature allows visitors to pin notes and whiteboard drawings. By submitting content, you grant parthkhansali.com a non-exclusive license to display that content on the website. You are responsible for ensuring your submissions do not infringe on third-party rights. We reserve the right to remove any submission at our sole discretion.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Disclaimer &amp; Limitation of Liability
            </h2>
            <p>
              This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Parth Khansali shall not be liable for any indirect or consequential damages arising from the use of this website.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Contact
            </h2>
            <p>
              If you have any questions about these terms, feel free to reach out:
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
                {siteConfig.email}
              </a>
            </p>
          </section>

          <footer style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", display: "flex", gap: "1.5rem", fontSize: "0.95rem" }}>
            <Link href="/" style={{ color: "var(--accent)" }}>← Back to Home</Link>
            <Link href="/privacy" style={{ color: "var(--fg-dim)" }}>Privacy Policy →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
