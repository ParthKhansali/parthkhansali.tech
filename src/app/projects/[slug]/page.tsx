import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageMetadata, pageNode, projectNode } from "@/lib/seo";
import { getProject, projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

type PageProps = { params: Promise<{ slug: string }> };

/** Every project page is statically generated at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMetadata({
    title: `${project.name} — ${project.kind}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/projects" },
    { name: project.name, path: `/projects/${project.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: `/projects/${project.slug}`,
              name: `${project.name} — ${project.kind}`,
              description: project.summary,
              // Reference the project node rather than nesting a second copy of
              // it: same @id, one entity.
              about: [{ "@id": `${siteConfig.url}/projects/${project.slug}#project` }],
            }),
            breadcrumbNode(trail),
            projectNode(project),
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
            <Link href="/projects">Work</Link>
            <span className="crumbs__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{project.name}</span>
          </nav>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "0.75rem 2rem",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                className="display"
                style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)" }}
              >
                {project.name}
              </h1>
              <p className="lede" style={{ marginTop: "0.85rem" }}>
                {project.summary}
              </p>
            </div>

            {project.reading ? (
              <div className="panel" style={{ padding: "1rem 1.25rem" }}>
                <p className="label">Measured</p>
                <p className="reading" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
                  {project.reading.value}
                </p>
                <p className="label">
                  {project.reading.unit} — {project.reading.note}
                </p>
              </div>
            ) : null}
          </div>

          <div
            className="chip-list"
            style={{ marginTop: "1.5rem", alignItems: "center" }}
          >
            <span className="chip chip--person">{project.status}</span>
            <span className="chip chip--instrument">{project.kind}</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="feature-grid">
            <div className="prose">
              {project.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {project.links.length ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      className="btn"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <div className="panels">
                {project.details.map((detail) => (
                  <div className="panel-body" key={detail.label}>
                    <p className="label">{detail.label}</p>
                    <p
                      style={{
                        marginTop: "0.3rem",
                        color: "var(--ink-2)",
                        fontSize: "0.9375rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {detail.text}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1.75rem" }}>
                <p className="label">Stack</p>
                <div className="chip-list" style={{ marginTop: "0.5rem" }}>
                  {project.stack.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Other projects"
            style={{
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--rule)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem 2rem",
            }}
          >
            <Link className="link" href="/projects">
              All work
            </Link>
            {projects
              .filter((item) => item.slug !== project.slug)
              .slice(0, 3)
              .map((item) => (
                <Link key={item.slug} className="link" href={`/projects/${item.slug}`}>
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>
      </section>
    </>
  );
}
