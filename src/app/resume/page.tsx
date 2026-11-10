import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import PrintButton from "@/components/ui/PrintButton";
import { breadcrumbNode, pageMetadata, pageNode } from "@/lib/seo";
import { siteConfig } from "@/data/site";
import { flagship, otherProjects } from "@/data/projects";
import {
  certifications,
  education,
  hackathons,
  leadership,
  skills,
} from "@/data/resume";

const description =
  "Resume of Parth Khansali: B.Tech computer science student at Graphic Era Hill University, developer of GEHU Connect, Director General of the Graphic Era MUN Club.";

export const metadata: Metadata = pageMetadata({
  title: "Resume",
  description,
  path: "/resume",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Resume", path: "/resume" },
];

function CVList({
  entries,
}: {
  entries: { title: string; org: string; period: string; detail: string }[];
}) {
  return (
    <div>
      {entries.map((entry) => (
        <div className="cv-entry" key={`${entry.title}-${entry.period}`}>
          <div className="cv-entry__top">
            <span className="cv-entry__title">{entry.title}</span>
            <span className="measured" style={{ fontSize: "0.75rem" }}>
              {entry.period}
            </span>
          </div>
          <p className="cv-entry__org">{entry.org}</p>
          <p className="cv-entry__detail">{entry.detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function ResumePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            pageNode({
              path: "/resume",
              name: "Resume: Parth Khansali",
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
            <span aria-current="page">Resume</span>
          </nav>

          <h1 className="display display--page">Parth Khansali</h1>
          <p className="lede" style={{ marginTop: "0.85rem" }}>
            Computer science student and software developer in Dehradun, India.
            Developer of GEHU Connect.
          </p>

          <div
            className="no-print"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}
          >
            <a
              className="btn btn--primary"
              href={siteConfig.resumePath}
              download="Parth Khansali Resume.pdf"
              type="application/pdf"
            >
              Download PDF
            </a>
            <PrintButton />
            <a className="btn" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      <div className="shell">
        <section className="cv-section" style={{ borderTop: 0 }}>
          <h2 className="label">Profile</h2>
          <p className="body-copy" style={{ marginTop: 0 }}>
            Computer science undergraduate who ships. I built and deployed GEHU
            Connect, a React Native and Spring Boot campus app now used by roughly a
            thousand students at Graphic Era Hill University. Comfortable across a
            mobile client, a Java backend, and the cloud storage in between. I also
            run the university&apos;s Model United Nations club.
          </p>
        </section>

        <section className="cv-section">
          <h2 className="label">Education</h2>
          <CVList entries={education} />
        </section>

        <section className="cv-section">
          <h2 className="label">Projects</h2>
          <div>
            {[flagship, ...otherProjects].map((project) => (
              <div className="cv-entry" key={project.slug}>
                <div className="cv-entry__top">
                  <Link className="cv-entry__title link" href={`/projects/${project.slug}`}>
                    {project.name}
                  </Link>
                </div>
                <p className="cv-entry__org">
                  {project.kind}: {project.status}
                </p>
                <p className="cv-entry__detail">{project.summary}</p>
                <p className="measured" style={{ marginTop: "0.3rem", fontSize: "0.75rem" }}>
                  {project.stack.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2 className="label">Leadership</h2>
          <CVList entries={leadership} />
        </section>

        <section className="cv-section">
          <h2 className="label">Hackathons</h2>
          <CVList entries={hackathons} />
        </section>

        <section className="cv-section">
          <h2 className="label">Skills</h2>
          <div className="skill-groups">
            {skills.map((group) => (
              <div key={group.label}>
                <p className="label">{group.label}</p>
                <div className="skill-group__items">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" style={{ paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <h2 className="label">Certifications</h2>
          <div className="skill-group__items">
            {certifications.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
