import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { articleNode, breadcrumbNode, pageMetadata, pageNode } from "@/lib/seo";
import { getNote, notes } from "@/data/notes";
import { projectUrl } from "@/data/projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  return pageMetadata({
    title: note.seoTitle,
    description: note.summary,
    path: `/notes/${note.slug}`,
    type: "article",
  });
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const notePath = `/notes/${note.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes" },
    { name: note.seoTitle, path: notePath },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: notePath,
              name: `${note.title} | Parth Khansali`,
              description: note.summary,
              dateModified: note.updated,
              about: [{ "@id": `${projectUrl(note.projectSlug)}#project` }],
            }),
            articleNode({
              path: notePath,
              headline: note.title,
              description: note.summary,
              datePublished: note.published,
              dateModified: note.updated,
              about: [{ "@id": `${projectUrl(note.projectSlug)}#project` }],
            }),
            breadcrumbNode(trail),
          ],
        }}
      />

      <div className="page-head">
        <div className="shell shell--narrow">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="crumbs__sep" aria-hidden="true">
              /
            </span>
            <Link href="/notes/">Notes</Link>
            <span className="crumbs__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{note.projectName}</span>
          </nav>

          <p className="tag tag--dim">
            {note.projectName} · Published {note.published} · {note.readingTime}
          </p>
          <h1 className="display display--page" style={{ marginTop: "0.65rem" }}>
            {note.title}
          </h1>
          <p className="lede" style={{ marginTop: "0.9rem" }}>
            {note.summary}
          </p>
          <div className="chip-list" style={{ marginTop: "1.25rem" }}>
            {note.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <article className="section">
        <div className="shell shell--narrow">
          <div className="note-sections">
            {note.sections.map((section) => (
              <section key={section.heading} className="note-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </section>
            ))}

            <aside className="card note-takeaway">
              <p className="card-kicker">Key takeaway</p>
              <p style={{ marginTop: "0.4rem", color: "var(--ink)" }}>{note.takeaway}</p>
            </aside>

            <div className="btn-row" style={{ marginTop: "1.5rem" }}>
              <Link className="btn btn--primary" href={`/projects/${note.projectSlug}/`}>
                View {note.projectName} case study →
              </Link>
              <Link className="btn" href="/notes/">
                All engineering notes
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

