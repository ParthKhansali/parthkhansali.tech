import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { homeGraph, pageMetadata } from "@/lib/seo";
import { siteConfig, socialLinks } from "@/data/site";
import { flagship, otherProjects } from "@/data/projects";
import { education, leadership, hackathons } from "@/data/resume";

const description =
  "Parth Khansali is a computer science student at Graphic Era Hill University in Dehradun, India, and the developer of GEHU Connect, a campus app used by roughly a thousand students.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Parth Khansali — computer science student and software developer",
    description,
    path: "/",
  }),
  // The template in the root layout would repeat the name.
  title: { absolute: "Parth Khansali — computer science student and software developer" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="section" style={{ paddingBlockStart: "clamp(2.5rem, 6vw, 4rem)" }}>
        <div className="shell">
          <div className="hero-grid">
            <div>
              <h1 className="display">Parth Khansali</h1>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Computer science student in Dehradun. I build software, then keep it
                running once real people start using it.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginTop: "1.75rem",
                }}
              >
                <a className="btn btn--primary" href="#work">
                  See the work
                </a>
                <Link className="btn" href="/resume">
                  Read the resume
                </Link>
                <a className="btn btn--quiet" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* The signature: the flagship shown as a record, not a screenshot. */}
            <aside className="panel" aria-labelledby="flagship-reading">
              <div className="panel-head">
                <span className="label">Flagship</span>
                <span className="chip chip--ok">{flagship.status}</span>
              </div>
              <div className="panel-body">
                <p className="label">{flagship.name}</p>
                <p className="reading" id="flagship-reading" style={{ marginTop: "0.4rem" }}>
                  ~1,000
                </p>
                <p className="label" style={{ marginTop: "0.35rem" }}>
                  students using it at Graphic Era Hill University
                </p>

                <dl
                  style={{
                    display: "grid",
                    gap: "0.5rem",
                    marginTop: "1.25rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--rule)",
                  }}
                >
                  {[
                    ["Client", "React Native, Expo"],
                    ["API", "Spring Boot, Java"],
                    ["Media", "Cloudflare R2"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <dt className="label">{label}</dt>
                      <dd className="measured" style={{ margin: 0 }}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Flagship                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="band band--deep section" id="flagship">
        <div className="shell">
          <div className="section-head">
            <h2>The one that is actually in people&apos;s hands</h2>
            <p className="section-note">
              Most side projects end at a demo. This one did not, and that changed
              what the work was about.
            </p>
          </div>

          <div className="feature-grid">
            <div>
              <h3 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)" }}>
                {flagship.name}
              </h3>
              <p className="body-copy" style={{ marginTop: "0.85rem" }}>
                {flagship.body[0]}
              </p>
              <p className="body-copy">{flagship.body[2]}</p>

              <div className="chip-list" style={{ marginTop: "1.25rem" }}>
                {flagship.stack.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <p style={{ marginTop: "1.5rem" }}>
                <Link className="link" href={`/projects/${flagship.slug}`}>
                  How GEHU Connect is built
                </Link>
              </p>
            </div>

            <div className="panels">
              {flagship.details.map((detail) => (
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
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Work index                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="section" id="work">
        <div className="shell">
          <div className="section-head">
            <h2>Everything else I&apos;m building</h2>
            <p className="section-note">
              Completed work and things still moving. The status line tells you which
              is which.
            </p>
          </div>

          <div className="trail">
            {otherProjects.map((project) => (
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

          <p style={{ marginTop: "1.5rem" }}>
            <Link className="link" href="/projects">
              All projects, in one place
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* About                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="band band--deep section" id="about">
        <div className="shell">
          <div className="section-head">
            <h2>How I work</h2>
            <p className="section-note">
              The short version, because nobody needs a third paragraph about passion.
            </p>
          </div>

          <div className="feature-grid">
            <div className="prose">
              <p>
                I am a computer science student at Graphic Era Hill University. Most of
                what I know came from taking an idea far enough that it broke, then
                finding out why. GEHU Connect is the clearest example: a React Native
                app and a Spring Boot API that roughly a thousand students now depend
                on.
              </p>
              <p>
                I like problems where the interesting part is not the feature but the
                constraint. A campus network that has to survive a bad connection.
                A Mac app that has to make two interfaces behave like one. A sensor
                reading smaller than a pixel that still has to be trusted.
              </p>
              <p>
                I also run the university&apos;s Model United Nations club, which is
                the same job in a different costume: plan the thing, keep the schedule,
                and stay calm when something breaks ten minutes before it starts.
              </p>
            </div>

            <div className="panels">
              <div className="panel-body">
                <p className="label">Currently</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)" }}>
                  Building GEHU Connect, and finishing three hackathon projects in the
                  open.
                </p>
              </div>
              <div className="panel-body">
                <p className="label">Studying</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)" }}>
                  {siteConfig.education.degree}, {siteConfig.education.period}.
                </p>
              </div>
              <div className="panel-body">
                <p className="label">Open to</p>
                <p style={{ marginTop: "0.3rem", color: "var(--ink-2)" }}>
                  Software engineering internships and problems that are deeper than
                  they look.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Journey                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="section" id="journey">
        <div className="shell">
          <div className="section-head">
            <h2>The record</h2>
            <p className="section-note">
              Dates, places and roles. The resume page has the long version.
            </p>
          </div>

          <div className="trail">
            {[
              { ...education[0], kind: "Academics" },
              { ...leadership[0], kind: "Leadership" },
              { ...hackathons[0], kind: "Hackathons" },
              { ...leadership[1], kind: "Leadership" },
            ].map((entry) => (
              <div className="trail-row" key={`${entry.title}-${entry.period}`}>
                <span className="measured" style={{ fontSize: "0.8125rem" }}>
                  {entry.period}
                </span>
                <span>
                  <span className="trail-row__name">{entry.title}</span>
                  <span
                    className="trail-row__what"
                    style={{ display: "block", marginTop: "0.15rem" }}
                  >
                    {entry.org}
                  </span>
                </span>
                <span className="trail-row__meta">
                  <span className="chip chip--person">{entry.kind}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="band band--deep section" id="contact">
        <div className="shell">
          <div className="contact-grid">
            <div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.5rem)" }}>
                If you have a problem worth an afternoon, send it over.
              </h2>
              <p className="body-copy" style={{ marginTop: "0.85rem" }}>
                Email is the fastest way to reach me. I read everything, even when I
                take a while to reply.
              </p>
            </div>

            <div>
              <a className="btn btn--primary" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem 1.25rem",
                  marginTop: "1.25rem",
                }}
              >
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className="link"
                      href={link.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
