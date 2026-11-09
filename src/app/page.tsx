import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Marquee from "@/components/ui/Marquee";
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

const roles = [
  "Campus software",
  "React Native",
  "Spring Boot",
  "macOS · Swift",
  "Geospatial data",
  "Optical tracking",
  "Model United Nations",
  "Dehradun, India",
];

const record = [
  { ...education[0], kind: "Academics" },
  { ...leadership[0], kind: "Leadership" },
  { ...hackathons[0], kind: "Hackathons" },
  { ...leadership[1], kind: "Leadership" },
];

/** The plate shown where a project has no screenshot of its own. */
function FocalPlanePlate() {
  return (
    <div className="plate">
      <svg
        viewBox="0 0 480 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A simulated focal plane: a grid of sensor pixels with one blurred star image and the centroid marked below pixel resolution."
      >
        <defs>
          <radialGradient id="centroid-blob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d23" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff4d23" stopOpacity="0" />
          </radialGradient>
          <pattern id="fpa-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(244,239,230,0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="480" height="300" fill="url(#fpa-grid)" />
        <circle cx="253" cy="146" r="66" fill="url(#centroid-blob)" />
        <circle cx="253" cy="146" r="2.5" fill="#f4efe6" />

        <g stroke="rgba(244,239,230,0.5)" strokeWidth="1">
          <line x1="253" y1="96" x2="253" y2="196" strokeDasharray="3 4" />
          <line x1="203" y1="146" x2="303" y2="146" strokeDasharray="3 4" />
        </g>

        <g
          fill="#76716a"
          fontFamily="var(--font-mono)"
          fontSize="8"
          letterSpacing="1.6"
        >
          <text x="24" y="28">FPA 1024 × 1024</text>
          <text x="24" y="282">SUB-PIXEL CENTROID</text>
          <text x="330" y="282">σ = 0.18 px</text>
        </g>
      </svg>
      <span className="plate__caption">Simulated focal plane</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      {/* ---------------------------------------------------------------- */}
      {/* Masthead                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="masthead">
        <div className="shell">
          <div className="masthead__meta">
            <p className="tag">
              <span className="pulse" aria-hidden="true" />
              Open to internships
            </p>
            <p className="tag tag--dim">
              Dehradun, India · 30.31°N 78.03°E
            </p>
            <p className="tag tag--dim">B.Tech CSE · 2024—2028</p>
          </div>

          <div className="masthead__body">
            <h1 className="masthead__name">
              <span className="line">Parth</span>
              <span className="line line--accent">
                Khansali<span className="dot">.</span>
              </span>
            </h1>

            <div className="masthead__id">
              <figure className="idcard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/shots/parth-640.jpg"
                  srcSet="/shots/parth-320.jpg 320w, /shots/parth-640.jpg 640w"
                  sizes="(max-width: 980px) 96px, 264px"
                  alt="Parth Khansali"
                  width={640}
                  height={640}
                  fetchPriority="high"
                />
                <figcaption>Fig. 01 — the author</figcaption>
              </figure>

              <div className="masthead__now">
                <p className="tag tag--dim">Currently</p>
                <p className="masthead__nowtext">
                  Building <strong>{flagship.name}</strong> — the campus app, now at
                  roughly a thousand students.
                </p>
              </div>
            </div>
          </div>

          <div className="masthead__foot">
            <p className="masthead__lede">
              Computer science student in Dehradun. I build software, then keep it
              running once real people start using it.
            </p>

            <div className="masthead__actions">
              <a className="btn btn--primary" href="#work">
                See the work
              </a>
              <Link className="btn" href="/resume">
                Read the resume
              </Link>
              <a className="link" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <Marquee items={roles} />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The flagship, printed                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="folio" id="flagship">
        <div className="shell">
          <div className="folio__strip">
            <span>01 — Flagship</span>
            <span>Deployed · ~1,000 students</span>
            <span>Graphic Era Hill University</span>
          </div>

          <div className="folio__grid">
            <div>
              <h2 className="folio__title">{flagship.name}</h2>
              <p className="folio__kicker">The one with users.</p>

              <p className="body-copy">{flagship.body[0]}</p>
              <p className="body-copy">{flagship.body[2]}</p>

              <dl className="spec">
                {flagship.details.map((detail) => (
                  <div className="spec__row" key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.text}</dd>
                  </div>
                ))}
              </dl>

              <div className="chip-list" style={{ marginTop: "1.35rem" }}>
                {flagship.stack.map((item) => (
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

            <aside className="folio__figure" aria-label="GEHU Connect, measured">
              <p className="reading">{flagship.reading?.value}</p>
              <p className="tag">{flagship.reading?.unit} using the deployed app</p>
              <p className="folio__note">
                A React Native client and a Spring Boot API, in daily use on a campus
                network that is not always kind. Adoption is the interesting part; the
                feature list was never the hard bit.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Work                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="section" id="work">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">02 — Selected work</p>
              <h2>Four builds, four different problems.</h2>
            </div>
            <p className="section-note">
              One released macOS app and three projects still moving. Each card says
              which is which, because a demo is not a product.
            </p>
          </div>

          <div className="work">
            {otherProjects.map((project, index) => {
              const wide = index % 4 === 0 || index % 4 === 3;

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className={`work-card ${wide ? "work-card--wide" : "work-card--narrow"}`}
                >
                  <div className="work-card__top">
                    <span className="work-card__index">
                      {String(index + 2).padStart(2, "0")}
                    </span>
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
                        sizes="(max-width: 900px) 100vw, 640px"
                        alt={project.media.alt}
                        width={project.media.width}
                        height={project.media.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  ) : (
                    <FocalPlanePlate />
                  )}

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
              );
            })}
          </div>

          <p style={{ marginTop: "2rem" }}>
            <Link className="link" href="/projects">
              All projects, in one place →
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How I work                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="section band" id="about">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">03 — How I work</p>
              <h2>The interesting part is never the feature.</h2>
            </div>
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
                constraint. A campus network that has to survive a bad connection. A Mac
                app that has to make two interfaces behave like one. A sensor reading
                smaller than a pixel that still has to be trusted.
              </p>
              <p>
                I also run the university&apos;s Model United Nations club, which is the
                same job in a different costume: plan the thing, keep the schedule, and
                stay calm when something breaks ten minutes before it starts.
              </p>
            </div>

            <dl className="spec spec--dark">
              <div className="spec__row">
                <dt>Role</dt>
                <dd>Student, and the person who ships it</dd>
              </div>
              <div className="spec__row">
                <dt>Based</dt>
                <dd>Dehradun, India · GMT+5:30</dd>
              </div>
              <div className="spec__row">
                <dt>Studying</dt>
                <dd>
                  {siteConfig.education.degree}, {siteConfig.education.period}
                </dd>
              </div>
              <div className="spec__row">
                <dt>Running</dt>
                <dd>Graphic Era MUN Club, as Director General</dd>
              </div>
              <div className="spec__row">
                <dt>Open to</dt>
                <dd>Software engineering internships, and problems deeper than they look</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Record                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="section" id="journey">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="tag tag--dim">04 — Record</p>
              <h2>Dates, places, and what I was doing there.</h2>
            </div>
            <p className="section-note">
              The long version, with the full detail, is on the resume page.
            </p>
          </div>

          <div className="trail timeline">
            {record.map((entry) => (
              <div className="trail-row" key={`${entry.title}-${entry.period}`}>
                <span className="measured">{entry.period}</span>
                <span>
                  <span className="trail-row__name">{entry.title}</span>
                  <span
                    className="trail-row__what"
                    style={{ display: "block", marginTop: "0.2rem" }}
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
      {/* Contact                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="cta" id="contact">
        <div className="shell">
          <p className="tag">05 — Contact</p>
          <h2 className="cta__title">Got a problem worth an afternoon?</h2>

          <a className="cta__email" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>

          <div className="cta__row">
            <div className="cta__links">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="form-note">
              Email is fastest; I read everything, even when I take a while to reply.
              The <Link href="/lounge">lounge</Link> is open if you would rather leave a
              note in public.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
