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
    title: `${project.name}: ${project.kind}`,
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
              name: `${project.name}: ${project.kind}`,
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
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1.5rem 3rem",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p className="tag tag--dim">{project.kind}</p>
              <h1 className="display display--page" style={{ marginTop: "0.6rem" }}>
                {project.name}
              </h1>
              <p className="lede" style={{ marginTop: "0.9rem" }}>
                {project.summary}
              </p>
            </div>

            {project.reading ? (
              <div style={{ flex: "0 0 auto" }}>
                <p className="reading">{project.reading.value}</p>
                <p className="tag tag--dim">
                  {project.reading.unit}: {project.reading.note}
                </p>
              </div>
            ) : null}
          </div>

          <div className="chip-list" style={{ marginTop: "1.35rem" }}>
            <span className="chip chip--person">{project.status}</span>
            {project.stack.map((item) => (
              <span className="chip chip--instrument" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {project.media ? (
        <div className="shell">
          <figure className="detail-media">
            <div className="detail-media__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.media.src}
                srcSet={project.media.srcSet}
                sizes="(max-width: 900px) 100vw, 1180px"
                alt={project.media.alt}
                width={project.media.width}
                height={project.media.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>{project.media.caption}</span>
              <span aria-hidden="true">{project.stack[0]}</span>
            </figcaption>
          </figure>
        </div>
      ) : null}

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
                    gap: "0.6rem",
                    marginTop: "1.5rem",
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
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="tag tag--dim">How it works</p>
              <dl className="spec spec--dark" style={{ marginTop: "0.75rem" }}>
                {project.details.map((detail) => (
                  <div className="spec__row" key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">Keep reading</p>
              <h2>Other work.</h2>
            </div>
            <p className="section-note">
              Five projects in total, each with the constraints that shaped it.
            </p>
          </div>

          <div className="trail">
            <Link className="trail-row trail-row--link" href="/projects">
              <span className="trail-row__name">All work</span>
              <span className="trail-row__what">
                The full index, with each project&apos;s stage spelled out.
              </span>
              <span className="trail-row__meta">
                <span className="chip chip--person">Index</span>
              </span>
            </Link>

            {projects
              .filter((item) => item.slug !== project.slug)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.slug}
                  className="trail-row trail-row--link"
                  href={`/projects/${item.slug}`}
                >
                  <span className="trail-row__name">{item.name}</span>
                  <span className="trail-row__what">{item.summary}</span>
                  <span className="trail-row__meta">
                    <span className="chip chip--instrument">{item.status}</span>
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
