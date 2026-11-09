import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbNode, pageMetadata, pageNode, projectNode } from "@/lib/seo";
import { flagship, otherProjects } from "@/data/projects";

const description =
  "Projects by Parth Khansali: GEHU Connect, a campus app used by roughly a thousand students, the macOS network bonding tool Netwich, and three builds in progress.";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description,
  path: "/projects",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/projects" },
];

export default function ProjectsPage() {
  const completed = otherProjects.filter((project) => project.tier === "completed");
  const ongoing = otherProjects.filter((project) => project.tier === "ongoing");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/projects",
              name: "Work — Parth Khansali",
              description,
              type: "CollectionPage",
            }),
            breadcrumbNode(trail),
            ...([flagship, ...otherProjects].map((project) => projectNode(project))),
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
            <span aria-current="page">Work</span>
          </nav>

          <p className="tag tag--dim">Index — five projects</p>
          <h1 className="display display--page" style={{ marginTop: "0.6rem" }}>
            Work<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            One shipped product with real users, one finished macOS app, three builds
            still moving. Each entry says what stage it is actually at.
          </p>
        </div>
      </div>

      {/* The flagship gets the printed treatment, here as on the homepage. */}
      <section className="folio">
        <div className="shell">
          <div className="folio__strip">
            <span>Flagship</span>
            <span>{flagship.status}</span>
            <span>{flagship.kind}</span>
          </div>

          <div className="folio__grid">
            <div>
              <h2 className="folio__title">{flagship.name}</h2>
              <p className="folio__kicker">The one with users.</p>
              <p className="body-copy">{flagship.summary}</p>
              <div className="chip-list" style={{ marginTop: "1.25rem" }}>
                {flagship.stack.slice(0, 6).map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: "1.5rem" }}>
                <Link className="link" href={`/projects/${flagship.slug}`}>
                  How GEHU Connect is built →
                </Link>
              </p>
            </div>

            <aside className="folio__figure">
              <p className="reading">{flagship.reading?.value}</p>
              <p className="tag">{flagship.reading?.unit} using the deployed app</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">Completed</p>
              <h2>Finished, released, documented.</h2>
            </div>
            <p className="section-note">
              A project only counts as done here when it is out and someone could use it
              without me in the room.
            </p>
          </div>

          <div className="work">
            {completed.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="work-card work-card--full"
              >
                <div className="work-card__top">
                  <span className="work-card__index">02</span>
                  <h3 className="work-card__name">{project.name}</h3>
                  <span className="work-card__kind">
                    {project.kind}
                    <br />
                    {project.status}
                  </span>
                </div>

                {project.media ? (
                  <span className="work-card__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.media.src}
                      srcSet={project.media.srcSet}
                      sizes="(max-width: 900px) 100vw, 700px"
                      alt={project.media.alt}
                      width={project.media.width}
                      height={project.media.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ) : null}

                <p className="work-card__blurb">{project.summary}</p>

                <div className="work-card__foot">
                  <div className="chip-list">
                    {project.stack.slice(0, 4).map((item) => (
                      <span className="chip chip--instrument" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">In progress</p>
              <h2>Still moving.</h2>
            </div>
            <p className="section-note">
              Hackathon builds and research tools that are not finished. They are listed
              because the work is real, not because the result is.
            </p>
          </div>

          <div className="trail">
            {ongoing.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="trail-row trail-row--link"
              >
                <span className="trail-row__name">{project.name}</span>
                <span className="trail-row__what">{project.summary}</span>
                <span className="trail-row__meta">
                  <span className="chip chip--instrument">{project.kind}</span>
                  <span className="chip chip--person">{project.status}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
