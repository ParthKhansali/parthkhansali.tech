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
import { education } from "@/data/resume";
import {
  bugMuseumItems,
  heroContent,
  journeyBeats,
  leadershipTimeline,
  offDutyItems,
  recognitionCards,
  skillGroups,
  workbenchItems,
} from "@/data/portfolioContent";

const description =
  "Parth Khansali, CSE student in Dehradun (GEHU). Developer of GEHU Connect (~1,000 students) and Netwich for macOS. Work, notes, and leadership.";

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
  { value: 1, label: "Flagship with users", prefix: "" },
  { value: 3, label: "In progress", prefix: "" },
  { value: 1000, label: "Students on GEHU Connect", prefix: "~" },
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

          <p className="hero__intro">
            {heroContent.tagline} {heroContent.proofLine}
          </p>

          <div className="hero__actions">
            <Magnetic strength={5}>
              <a className="btn btn--primary" href="#work">
                View Work <span aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <a
              className="btn"
              href={siteConfig.links.github}
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>

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

      {/* About & Engineering Journey ------------------------------------ */}
      <section className="section" id="about">
        <div className="shell">
          <h2 className="section-label">About Me</h2>

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
                  <h3 className="bio-card__name">{siteConfig.name}</h3>
                  <p className="card-role">Software developer · Dehradun</p>
                </div>
              </div>

              <p className="bio-card__text">
                I&apos;m a computer science undergraduate at Graphic Era Hill University who builds software and keeps it running once real people depend on it.
              </p>
              <p className="bio-card__text">
                {flagship.name} is the clearest example: a campus app built with React Native, Java Spring Boot, and Cloudflare R2 now used by roughly a thousand students. The interesting engineering never came from adding features: it came from flaky campus Wi-Fi, retry limits, and keeping API threads clear.
              </p>
              <p className="bio-card__text">
                Outside software, leading the university Model UN club taught me how to run large rooms, mediate disagreement, and explain hard problems plainly. Public utilities and hackathon prototypes are published on{" "}
                <a
                  className="link"
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  Parth Khansali on GitHub
                </a>
                .
              </p>

              <div className="chip-list">
                <span className="chip">Full-stack</span>
                <span className="chip">Native macOS</span>
                <span className="chip">Simulation &amp; GIS</span>
                <span className="chip">MUN Leadership</span>
              </div>

              <p className="card-meta">Based in Dehradun · open to remote or onsite internships</p>
            </article>

            <article className="card edu-card reveal">
              <p className="card-kicker">Education</p>
              <h3 className="edu-card__school">{education[0].org.split(",")[0]}</h3>
              <p className="edu-card__degree">{siteConfig.education.degree}</p>
              <p className="edu-card__courses">
                Data structures, algorithms, databases, operating systems, computer networks.
              </p>
              <p className="card-meta">2024 to 2028 · CGPA 7.6</p>
            </article>

            <article className="card quote-card reveal">
              <p className="quote">
                &ldquo;Curious enough to break it. Stubborn enough to fix it.&rdquo;
              </p>
              <p className="card-meta">How I debug</p>
            </article>

            <article className="card vision-card reveal">
              <p className="card-kicker">Engineering record</p>
              <h3 className="vision-card__title">Experience, projects &amp; CV.</h3>
              <Magnetic strength={6}>
                <Link className="btn btn--dark" href="/resume/">
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

          <div className="journey-block" id="journey">
            <div className="journey-head">
              <h3 className="journey-head__title">From curiosity to code</h3>
              <span className="measured">Dehradun · 2024 to 2026</span>
            </div>
            <div className="journey-grid">
              {journeyBeats.map((beat) => (
                <article className="card journey-card reveal" key={beat.title}>
                  <span className="journey-card__period">{beat.period}</span>
                  <h4 className="journey-card__title">{beat.title}</h4>
                  <p className="journey-card__summary">{beat.summary}</p>
                  {beat.link ? (
                    <Link className="link journey-card__link" href={beat.link.href}>
                      {beat.link.label} →
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects (primary emphasis above leadership) ----------- */}
      <section className="section" id="work">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="section-label">Selected Projects</p>
              <h2>Five builds, from campus users to socket relays.</h2>
            </div>
            <Link className="link section-head__link" href="/projects/">
              View all project details <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ProjectsShowcase projects={projects} />
        </div>
      </section>

      {/* Practical Skills Matrix ---------------------------------------- */}
      <section className="section" id="skills">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="section-label">Skills &amp; Stack</p>
              <h2>Tools paired with where they shipped.</h2>
            </div>
            <Link className="link section-head__link" href="/notes/">
              Read engineering notes <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="skill-domains">
            {skillGroups.map((group) => (
              <article className="card skill-domain-card reveal" key={group.area}>
                <h3 className="skill-domain-card__title">{group.area}</h3>
                <div className="chip-list">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <p className="skill-domain-card__used">
                  Used in{" "}
                  {group.usedIn.map((ref, idx) => (
                    <span key={ref.href}>
                      <Link className="link" href={ref.href}>
                        {ref.label}
                      </Link>
                      {idx < group.usedIn.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* On My Workbench & Bug Museum ----------------------------------- */}
      <section className="section band" id="workbench">
        <div className="shell">
          <div className="workbench-split">
            <div>
              <p className="section-label">Currently</p>
              <h2 className="workbench-heading">On my workbench</h2>
              <div className="workbench-stack">
                {workbenchItems.map((item) => (
                  <article className="card workbench-card reveal" key={item.title}>
                    <p className="card-kicker">{item.label}</p>
                    <h3 className="workbench-card__title">{item.title}</h3>
                    <p className="workbench-card__detail">{item.detail}</p>
                    {item.href ? (
                      <Link className="link workbench-card__link" href={item.href}>
                        Inspect build →
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className="section-label">Bug Museum</p>
              <h2 className="workbench-heading">Things that broke</h2>
              <div className="workbench-stack">
                {bugMuseumItems.map((bug) => (
                  <Link className="card bug-card reveal" href={bug.href} key={bug.title}>
                    <div className="bug-card__top">
                      <span className="tag">{bug.project}</span>
                      <span className="arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                    <h3 className="bug-card__title">{bug.title}</h3>
                    <p className="bug-card__detail">{bug.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consolidated Leadership, MUN & Recognition --------------------- */}
      <section className="section" id="leadership">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="section-label">Leadership &amp; Recognition</p>
              <h2>Running rooms, mentoring speakers, shipping sprints.</h2>
            </div>
            <Link className="link section-head__link" href="/resume/">
              Full record with dates <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ExperienceTimeline items={leadershipTimeline} />

          <div className="award-grid" style={{ marginTop: "2.25rem" }}>
            {recognitionCards.map((item, index) => (
              <article className="card award-card reveal" key={item.title}>
                <span className="award-card__num" aria-hidden="true">
                  _{String(index + 1).padStart(2, "0")} · {item.kind.toUpperCase()}
                </span>
                <h3 className="award-card__title">{item.title}</h3>
                <p className="award-card__meta">
                  {item.org} · {item.period}
                </p>
                <p className="award-card__detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond the Build + The Lounge Teaser --------------------------- */}
      <section className="section" id="misc">
        <div className="shell">
          <h2 className="section-label">Beyond the Build &amp; The Lounge</h2>

          <div className="offduty-strip" aria-label="Interests outside coding">
            {offDutyItems.map((facet) => (
              <div className="card offduty-chip-card" key={facet.id}>
                <p className="offduty-chip-card__title">
                  {facet.href ? (
                    <a
                      href={facet.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="link"
                    >
                      {facet.label} ↗
                    </a>
                  ) : (
                    facet.label
                  )}
                </p>
                <p className="offduty-chip-card__detail">{facet.detail}</p>
                {facet.optionalDetail ? (
                  <p className="offduty-chip-card__extra">{facet.optionalDetail}</p>
                ) : null}
              </div>
            ))}
          </div>

          <article className="misc-card reveal" style={{ marginTop: "1.25rem" }}>
            <div className="misc-card__body">
              <h3 className="misc-card__title">Wanna leave your mark?</h3>
              <p className="misc-card__text">
                The Lounge has a community visitor board for verified notes and whiteboard sketches, plus a retro CRT workstation with Snake, Pong, reflex tests, and lofi beats.
              </p>
            </div>
            <div className="misc-card__actions">
              <Link className="btn btn--primary" href="/lounge/">
                Visit the lounge <span aria-hidden="true">↗</span>
              </Link>
              <Link className="btn" href="/notes/">
                Engineering notes
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
              <Link className="btn btn--ghost" href="/resume/">
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
