import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageMetadata, pageNode } from "@/lib/seo";
import { notes } from "@/data/notes";

const description =
  "Engineering notes by Parth Khansali: socket bugs solved in Netwich and campus caching/upload patterns built for GEHU Connect.";

export const metadata: Metadata = pageMetadata({
  title: "Engineering Notes & Bug Postmortems",
  description,
  path: "/notes",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
];

export default function NotesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/notes",
              name: "Engineering Notes & Bug Postmortems | Parth Khansali",
              description,
              type: "CollectionPage",
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
            <span aria-current="page">Notes</span>
          </nav>

          <p className="tag tag--dim">Engineering Log</p>
          <h1 className="display display--page" style={{ marginTop: "0.6rem" }}>
            Engineering Notes<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p className="lede" style={{ marginTop: "0.9rem", maxWidth: "60ch" }}>
            Short write-ups on real bugs, networking bottlenecks, and tradeoffs debugged while building GEHU Connect and Netwich.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="notes-grid">
            {notes.map((note) => (
              <Link key={note.slug} href={`/notes/${note.slug}/`} className="card note-card">
                <div className="note-card__meta">
                  <span className="tag">{note.projectName}</span>
                  <span className="measured" style={{ fontSize: "0.75rem" }}>
                    {note.published} · {note.readingTime}
                  </span>
                </div>
                <h2 className="note-card__title">{note.title}</h2>
                <p className="note-card__summary">{note.summary}</p>
                <div className="chip-list" style={{ marginTop: "auto", paddingTop: "1rem" }}>
                  {note.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

