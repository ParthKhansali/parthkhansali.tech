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

          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>
            Work
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            One shipped product with real users, one finished macOS app, three builds
            still moving. Each entry says what stage it is actually at.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <h2 className="label" style={{ marginBottom: "1rem" }}>
            Flagship
          </h2>

          <Link
            href={`/projects/${flagship.slug}`}
            className="panel"
            style={{ display: "block", padding: "clamp(1.25rem, 3vw, 1.75rem)" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "0.5rem 1.5rem",
              }}
            >
              <h3 style={{ fontSize: "clamp(1.5rem, 3.2vw, 2rem)" }}>{flagship.name}</h3>
              <span className="chip chip--ok">{flagship.status}</span>
            </div>
            <p className="body-copy" style={{ marginTop: "0.75rem" }}>
              {flagship.summary}
            </p>
            <div className="chip-list" style={{ marginTop: "1rem" }}>
              {flagship.stack.slice(0, 5).map((item) => (
                <span className="chip chip--instrument" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </Link>

          <h2 className="label" style={{ margin: "2.75rem 0 1rem" }}>
            Completed
          </h2>
          <div className="trail">
            {completed.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="trail-row trail-row--link"
              >
                <span className="trail-row__name">{project.name}</span>
                <span className="trail-row__what">{project.summary}</span>
                <span className="trail-row__meta">
                  <span className="chip chip--instrument">{project.kind}</span>
                </span>
              </Link>
            ))}
          </div>

          <h2 className="label" style={{ margin: "2.75rem 0 1rem" }}>
            In progress
          </h2>
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
