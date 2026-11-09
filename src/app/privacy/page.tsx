import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, pageNode } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for parthkhansali.tech: details on authentication for The Wall, data collection, and rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const jsonLd = pageNode({
    path: "/privacy",
    name: "Privacy Policy",
    description: "Privacy Policy for parthkhansali.tech",
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
          <span>Privacy Policy</span>
        </div>

        <header className="page-head" style={{ marginBottom: "2.5rem" }}>
          <p className="eyebrow">Legal</p>
          <h1 className="display display--hero" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Privacy Policy
          </h1>
          <p className="lead" style={{ marginTop: "0.5rem", color: "var(--fg-dim)" }}>
            Last updated: May 2026
          </p>
        </header>

        <article className="prose-block" style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: "1.7", color: "var(--fg)" }}>
          <section>
            <p style={{ fontSize: "1.1rem" }}>
              Your privacy matters. This policy explains exactly what data parthkhansali.tech collects, why it is collected, and how you can control it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              What We Collect
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)" }}>Authentication</h3>
                <p>
                  When you sign in to The Wall feature, we receive your name, email, and avatar from your Google account via Firebase Auth. We do not access your contacts, files, or any other Google account data.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)" }}>Contact Inquiries</h3>
                <p>
                  When you send a message through the contact form or direct mail, we collect your name, email address, and message content solely to respond to your inquiry.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)" }}>Wall Content</h3>
                <p>
                  If you pin a note or whiteboard sketch on the visitor Wall, the content you create (text, drawings) is stored along with your display name and avatar.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              How We Use Your Data
            </h2>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>To authenticate you on The Wall so you can leave notes and sketches</li>
              <li>To respond to messages you send through contact channels</li>
              <li>To display your contributions on the visitor Wall</li>
              <li>To prevent spam, abuse, and automated bot submissions</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Third-Party Services
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)" }}>Firebase (Google Cloud)</h3>
                <p>Handles Google OAuth authentication and Firestore database storage. Your data is stored securely on Google Cloud infrastructure.</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent)" }}>Vercel</h3>
                <p>Hosts this website and may collect anonymous server performance metrics.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Data Retention &amp; Your Rights
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>
              Wall contributions remain visible unless you request removal. You have the right at any time to:
            </p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Request a copy of your stored data</li>
              <li>Request deletion of your data and Wall contributions</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>
              Contact
            </h2>
            <p>
              If you have any questions about this privacy policy or wish to request data removal, email me directly at:
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
                {siteConfig.email}
              </a>
            </p>
          </section>

          <footer style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", display: "flex", gap: "1.5rem", fontSize: "0.95rem" }}>
            <Link href="/" style={{ color: "var(--accent)" }}>← Back to Home</Link>
            <Link href="/terms" style={{ color: "var(--fg-dim)" }}>Terms of Use →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
