import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import SpotlightGrid from "@/components/ui/SpotlightGrid";
import CursorPreview from "@/components/ui/CursorPreview";
import ClockCard from "@/components/ui/ClockCard";
import CountUp from "@/components/ui/CountUp";
import { homeGraph, pageMetadata } from "@/lib/seo";
import { siteConfig, socialLinks } from "@/data/site";
import { flagship, otherProjects } from "@/data/projects";
import { education, hackathons, leadership } from "@/data/resume";

const description =
  "Parth Khansali is a computer science student at Graphic Era Hill University in Dehradun, India, and the developer of GEHU Connect, a campus app used by roughly a thousand students.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Parth Khansali — computer science student and software developer",
    description,
    path: "/",
  }),
  title: { absolute: "Parth Khansali — computer science student and software developer" },
};

const ribbonA = [
  "Problem solver",
  "Product minded",
  "Mobile first",
  "Ships and maintains",
  "Full-stack",
  "Documentation",
];

const ribbonB = [
  "React Native",
  "Spring Boot",
  "Swift 6",
  "Geospatial data",
  "Optical tracking",
  "Model United Nations",
];

const stats = [
  { value: 5, label: "Projects built", prefix: "" },
  { value: 1, label: "In daily use", prefix: "" },
  { value: 3, label: "Still in progress", prefix: "" },
  { value: 1000, label: "Students on GEHU Connect", prefix: "~" },
];

const skills = [
  { name: "Java", abbr: "Ja" },
  { name: "Python", abbr: "Py" },
  { name: "TypeScript", abbr: "TS" },
  { name: "JavaScript", abbr: "JS" },
  { name: "React Native", abbr: "RN" },
  { name: "Expo", abbr: "Ex" },
  { name: "Spring Boot", abbr: "SB" },
  { name: "Next.js", abbr: "Nx" },
  { name: "Node.js", abbr: "No" },
  { name: "MySQL", abbr: "My" },
  { name: "MongoDB", abbr: "Mo" },
  { name: "Git", abbr: "Gi" },
];

const experience = [
  {
    ...leadership[0],
    tags: ["Leadership", "Conference ops", "Delegates"],
    tone: "rose",
  },
  {
    ...leadership[1],
    tags: ["Hosting", "Event logistics"],
    tone: "lime",
  },
  {
    ...leadership[2],
    tags: ["Outreach", "Public speaking"],
    tone: "sky",
  },
  {
    ...hackathons[0],
    tags: ["Rapid builds", "Deployed demos"],
    tone: "amber",
  },
];

const awards = [
  {
    title: "Director General",
    org: "Graphic Era MUN Club",
    period: "2024 — present",
    detail:
      "Runs the university's Model United Nations club: conference planning, delegate management and the logistics that keep a two-day event on schedule.",
  },
  {
    title: "Fifteen schools and counting",
    org: "School outreach programme",
    period: "2025",
    detail:
      "Ran MUN seminars, mock sessions and workshops in more than fifteen schools across Dehradun, most of them in rooms with no projector.",
  },
  {
    title: "Three hackathon sprints",
    org: "Hackaholic → iQOO Pune",
    period: "2025 — 2026",
    detail:
      "Scope a build, cut it down to what can ship, and get a working deployed demo out inside the time limit. Twice that meant removing features.",
  },
];

/** The plate shown where a project has no screenshot of its own. */
function FocalPlanePlate() {
  return (
    <div className="plate">
      <svg
        viewBox="0 0 480 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A simulated focal plane: a grid of sensor pixels with one blurred star image and its sub-pixel centroid marked."
      >
        <defs>
          <radialGradient id="centroid-blob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f04e7a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f04e7a" stopOpacity="0" />
          </radialGradient>
          <pattern id="fpa-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="480" height="300" fill="url(#fpa-grid)" />
        <circle cx="253" cy="146" r="64" fill="url(#centroid-blob)" />
        <circle cx="253" cy="146" r="2.5" fill="#f4f4f7" />

        <g stroke="rgba(244,244,247,0.5)" strokeWidth="1">
          <line x1="253" y1="98" x2="253" y2="194" strokeDasharray="3 4" />
          <line x1="205" y1="146" x2="301" y2="146" strokeDasharray="3 4" />
        </g>

        <g fill="#8a8a99" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.6">
          <text x="22" y="26">FPA 1024 × 1024</text>
          <text x="22" y="284">SUB-PIXEL CENTROID</text>
          <text x="342" y="284">σ = 0.18 px</text>
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

      {/* Hero ----------------------------------------------------------- */}
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="shell hero__inner">
          <p className="hero__hi">Hi, I&apos;m</p>
          <h1 className="hero__name">Parth Khansali</h1>
          <p className="hero__role">
            Computer science student <span aria-hidden="true">·</span> Software developer
          </p>

          <div className="hero__meta">
            <span className="pill">
              <span className="pulse" aria-hidden="true" />
              Open to internships
            </span>
            <span className="pill pill--quiet">Dehradun, India</span>
            <span className="pill pill--quiet">B.Tech CSE · 2024—2028</span>
          </div>
        </div>

        <a className="hero__cue" href="#about">
          Scroll <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* Crossed ribbons ------------------------------------------------ */}
      <div className="ribbons">
        <Marquee items={ribbonA} className="marquee--solid" />
        <Marquee items={ribbonB} className="marquee--ghost" />
      </div>

      {/* About ---------------------------------------------------------- */}
      <section className="section" id="about">
        <div className="shell">
          <p className="section-label">About Me</p>

          <div className="bento">
            <article className="card bio-card reveal">
              <div className="bio-card__head">
                <span className="avatar" aria-hidden="true">
                  PH
                </span>
                <div>
                  <h2 className="bio-card__name">{siteConfig.name}</h2>
                  <p className="card-role">Software developer · Dehradun</p>
                </div>
              </div>

              <p className="bio-card__text">
                I&apos;m a computer science student who builds software and then keeps
                it running once real people start using it. My work sits across a React
                Native client, a Spring Boot API and the storage in between.
              </p>
              <p className="bio-card__text">
                {flagship.name} is the clearest example: a campus app now used by roughly
                a thousand students. The interesting part was never the feature list — it
                was the bad campus network, the upload failures and the sign-up flow.
              </p>
              <p className="bio-card__text">
                I also run the university&apos;s Model United Nations club, which is the
                same job in a different costume: plan the thing, keep the schedule, stay
                calm when something breaks ten minutes before it starts.
              </p>

              <div className="chip-list">
                <span className="chip">Problem solving</span>
                <span className="chip">Full-stack</span>
                <span className="chip">MUN</span>
              </div>

              <p className="card-meta">Based in Dehradun · open to remote</p>
            </article>

            <article className="card edu-card reveal">
              <p className="card-kicker">Education</p>
              <h3 className="edu-card__school">{education[0].org.split(",")[0]}</h3>
              <p className="edu-card__degree">{siteConfig.education.degree}</p>
              <p className="edu-card__courses">
                Data structures, algorithms, databases and networks.
              </p>
              <p className="card-meta">2024 — 2028 · CGPA 7.6</p>
            </article>

            <article className="card quote-card reveal">
              <p className="quote">“Real artists ship.”</p>
              <p className="card-meta">Steve Jobs</p>
            </article>

            <article className="card vision-card reveal">
              <p className="card-kicker">Have a vision?</p>
              <h3 className="vision-card__title">Let&apos;s build it together.</h3>
              <Magnetic strength={6}>
                <Link className="btn btn--dark" href="/resume">
                  Resume <span aria-hidden="true">↗</span>
                </Link>
              </Magnetic>
            </article>

            <ClockCard />

            <div className="stats-row">
              {stats.map((stat) => (
                <div className="card stat-card" key={stat.label}>
                  <p className="stat-card__value">
                    <CountUp value={stat.value} prefix={stat.prefix} />
                  </p>
                  <p className="stat-card__label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience ----------------------------------------------------- */}
      <section className="section" id="experience">
        <div className="shell">
          <p className="section-label">Experience</p>

          <ol className="timeline">
            {experience.map((entry) => (
              <li
                className="timeline__item reveal"
                key={`${entry.title}-${entry.period}`}
              >
                <span
                  className={`timeline__dot timeline__dot--${entry.tone}`}
                  aria-hidden="true"
                />
                <div className="timeline__card">
                  <p className="timeline__date">{entry.period}</p>
                  <h3 className="timeline__title">{entry.title}</h3>
                  <p className="timeline__org">{entry.org}</p>
                  <p className="timeline__detail">{entry.detail}</p>
                  <div className="chip-list">
                    {entry.tags.map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Skills --------------------------------------------------------- */}
      <section className="section" id="skills">
        <div className="shell">
          <p className="section-label">Skills</p>

          <ul className="skill-grid">
            {skills.map((skill) => (
              <li className="skill-tile reveal" key={skill.name}>
                <span className="skill-tile__abbr" aria-hidden="true">
                  {skill.abbr}
                </span>
                <span className="skill-tile__name">{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured projects ---------------------------------------------- */}
      <section className="section" id="work">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="section-label">Featured Projects</p>
              <h2>Four builds, four different problems.</h2>
            </div>
            <Link className="link section-head__link" href="/projects">
              View all projects <span aria-hidden="true">→</span>
            </Link>
          </div>

          <CursorPreview>
            <SpotlightGrid className="work">
              {otherProjects.map((project, index) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="work-card reveal"
                  data-spotlight
                  data-preview={project.media?.src}
                >
                  <div className="work-card__meta">
                    <span className="work-card__index">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <span>{project.kind}</span>
                  </div>

                  {project.media ? (
                    <span className="work-card__media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.media.src}
                        srcSet={project.media.srcSet}
                        sizes="(max-width: 900px) 100vw, 590px"
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

                  <div className="work-card__head">
                    <h3 className="work-card__name">{project.name}</h3>
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>

                  <p className="work-card__blurb">{project.summary}</p>

                  <div className="work-card__foot">
                    <div className="chip-list">
                      {project.stack.slice(0, 4).map((item) => (
                        <span className="chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="chip chip--status">{project.status}</span>
                  </div>
                </Link>
              ))}
            </SpotlightGrid>
          </CursorPreview>
        </div>
      </section>

      {/* Achievements --------------------------------------------------- */}
      <section className="section" id="achievements">
        <div className="shell">
          <p className="section-label">Achievements</p>

          <div className="award-grid">
            {awards.map((award, index) => (
              <article className="card award-card reveal" key={award.title}>
                <span className="award-card__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="award-card__title">{award.title}</h3>
                <p className="award-card__meta">
                  {award.org} · {award.period}
                </p>
                <p className="award-card__detail">{award.detail}</p>
              </article>
            ))}
          </div>

          <p className="award-foot">
            <Link className="link" href="/resume">
              The full record, with dates, is on the resume{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* Misc ----------------------------------------------------------- */}
      <section className="section" id="misc">
        <div className="shell">
          <p className="section-label">Misc</p>

          <article className="misc-card reveal">
            <div className="misc-card__body">
              <h2 className="misc-card__title">Wanna leave your mark?</h2>
              <p className="misc-card__text">
                The lounge has three small browser games and a public wall. No account,
                no leaderboard theatre. Notes left there stay up.
              </p>
            </div>
            <div className="misc-card__actions">
              <Link className="btn btn--primary" href="/lounge">
                Visit the lounge <span aria-hidden="true">↗</span>
              </Link>
              <Link className="btn" href="/lounge#wall">
                Pin something
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Connect -------------------------------------------------------- */}
      <section className="connect" id="contact">
        <div className="shell">
          <div className="connect__card reveal">
            <div className="connect__glow" aria-hidden="true" />

            <p className="section-label section-label--light">Ready to Connect?</p>
            <h2 className="connect__title">
              From idea to <em>impact.</em>
            </h2>
            <p className="connect__sub">Let&apos;s build something real.</p>

            <div className="connect__actions">
              <Magnetic>
                <a className="btn btn--light" href={`mailto:${siteConfig.email}`}>
                  Get in touch <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
              <Link className="btn btn--ghost" href="/resume">
                Resume
              </Link>
            </div>

            <p className="connect__note">
              Open to software engineering internships · email is fastest
            </p>

            <div className="connect__links">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
