import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import ClockCard from "@/components/ui/ClockCard";
import CountUp from "@/components/ui/CountUp";
import HeroAsciiReveal from "@/components/ui/HeroAsciiReveal";
import ExperienceTimeline from "@/components/ui/ExperienceTimeline";
import ProjectsShowcase from "@/components/ui/ProjectsShowcase";
import { homeGraph, pageMetadata } from "@/lib/seo";
import { siteConfig, socialLinks, withBasePath } from "@/data/site";
import { projects, flagship } from "@/data/projects";
import { education, hackathons, leadership } from "@/data/resume";

const description =
  "Parth Khansali is a computer science student at Graphic Era Hill University in Dehradun, India, and the developer of GEHU Connect, a campus app used by roughly a thousand students.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Parth Khansali: Computer Science Student & Software Developer",
    description,
    path: "/",
    type: "profile",
  }),
  title: { absolute: "Parth Khansali: Computer Science Student & Software Developer" },
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
    tone: "green",
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
    period: "2024 to present",
    detail:
      "Runs the university Model United Nations club: conference planning, delegate management and the logistics that keep a two-day event on schedule.",
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
    org: "Hackaholic to iQOO Pune",
    period: "2025 to 2026",
    detail:
      "Scope a build, cut it down to what can ship, and get a working deployed demo out inside the time limit. Twice that meant removing features.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      {/* Hero ----------------------------------------------------------- */}
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <HeroAsciiReveal />
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
            <span className="pill pill--quiet">B.Tech CSE · 2024 to 2028</span>
          </div>
        </div>

        <a className="hero__cue" href="#about" aria-label="Scroll to about section">
          <span>Explore</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hero__cue-arrow"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
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
                <Image
                  src={withBasePath("/profile.jpg")}
                  alt="Parth Khansali"
                  width={56}
                  height={56}
                  className="avatar avatar--photo"
                />
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
                a thousand students. The interesting part was never the feature list: it
                was the bad campus network, the upload failures and the sign-up flow.
              </p>
              <p className="bio-card__text">
                I also run the university Model United Nations club, which is the
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
              <p className="card-meta">2024 to 2028 · CGPA 7.6</p>
            </article>

            <article className="card quote-card reveal">
              <p className="quote">
                &ldquo;Loss does not deter me and victory does not praise me, I seek more.&rdquo;
              </p>
              <p className="card-meta">Personal Creed</p>
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
          <ExperienceTimeline items={experience} />
        </div>
      </section>

      {/* Skills --------------------------------------------------------- */}
      <section className="section" id="skills">
        <div className="shell">
          <p className="section-label">Skills & Stack</p>

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
              <p className="section-label">Selected Projects</p>
              <h2>Five builds, from real users to core systems.</h2>
            </div>
            <Link className="link section-head__link" href="/projects">
              View all project details <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ProjectsShowcase projects={projects} />
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
                  _{String(index + 1).padStart(2, "0")}
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
          <p className="section-label">The Lounge</p>

          <article className="misc-card reveal">
            <div className="misc-card__body">
              <h2 className="misc-card__title">Wanna leave your mark?</h2>
              <p className="misc-card__text">
                The lounge has a community visitor board for notes and sketches, plus a retro CRT workstation with arcade games, live chat, and lofi beats.
              </p>
            </div>
            <div className="misc-card__actions">
              <Link className="btn btn--primary" href="/lounge">
                Visit the lounge <span aria-hidden="true">↗</span>
              </Link>
              <Link className="btn" href="/lounge">
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

            <p className="section-label section-label--light" style={{ justifyContent: "center" }}>
              Ready to Connect?
            </p>
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
