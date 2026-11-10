"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Project } from "@/data/projects";

interface ProjectsShowcaseProps {
  projects: Project[];
}

/** Rich campus networking UI mockup for GEHU Connect */
function GehuConnectMockup() {
  return (
    <div className="showcase-gehu">
      <div className="showcase-gehu__bar">
        <div className="showcase-gehu__brand">
          <span className="showcase-gehu__crest">G</span>
          <div>
            <p className="showcase-gehu__name">GEHU Connect</p>
            <p className="showcase-gehu__sub">Graphic Era Hill University</p>
          </div>
        </div>
        <span className="showcase-gehu__pill">~1,000 Students</span>
      </div>

      <div className="showcase-gehu__body">
        <div className="showcase-gehu__stats">
          <div className="showcase-gehu__stat-card">
            <span className="showcase-gehu__stat-val">React Native</span>
            <span className="showcase-gehu__stat-label">Client</span>
          </div>
          <div className="showcase-gehu__stat-card">
            <span className="showcase-gehu__stat-val">Spring Boot</span>
            <span className="showcase-gehu__stat-label">Java API</span>
          </div>
          <div className="showcase-gehu__stat-card">
            <span className="showcase-gehu__stat-val">Cloudflare R2</span>
            <span className="showcase-gehu__stat-label">AWS SDK</span>
          </div>
        </div>

        <div className="showcase-gehu__post">
          <div className="showcase-gehu__post-header">
            <div className="showcase-gehu__avatar">PK</div>
            <div>
              <p className="showcase-gehu__author">Campus Dispatch</p>
              <p className="showcase-gehu__meta">B.Tech CSE Community · Dehradun</p>
            </div>
            <span className="showcase-gehu__status-dot" aria-hidden="true" />
          </div>
          <p className="showcase-gehu__text">
            Notice boards, peer discussions and campus updates unified into a single mobile feed designed to survive intermittent campus Wi-Fi.
          </p>
          <div className="showcase-gehu__tags">
            <span>#campus</span>
            <span>#community</span>
            <span>#gehu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated focal plane plate for ORVESS-PAT */
function SimulatedFocalPlane() {
  return (
    <div className="showcase-plate">
      <svg
        viewBox="0 0 480 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Simulated focal plane sensor array with sub-pixel centroid"
      >
        <defs>
          <radialGradient id="showcase-centroid-blob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ef4e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00ef4e" stopOpacity="0" />
          </radialGradient>
          <pattern id="showcase-fpa-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="480" height="300" fill="url(#showcase-fpa-grid)" />
        <circle cx="240" cy="150" r="70" fill="url(#showcase-centroid-blob)" />
        <circle cx="240" cy="150" r="3" fill="#ffffff" />

        <g stroke="rgba(255,255,255,0.5)" strokeWidth="1">
          <line x1="240" y1="95" x2="240" y2="205" strokeDasharray="3 4" />
          <line x1="185" y1="150" x2="295" y2="150" strokeDasharray="3 4" />
        </g>

        <g fill="#b5b5b5" fontFamily="monospace" fontSize="9" letterSpacing="1.5">
          <text x="24" y="28">FPA 640 x 480</text>
          <text x="24" y="282">SUB-PIXEL CENTROID</text>
          <text x="320" y="282">EKF q_t in [0, 1]</text>
        </g>
      </svg>
      <span className="showcase-plate__badge">SIH Simulation Workbench</span>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.slug === "gehu-connect") {
    return <GehuConnectMockup />;
  }
  if (project.slug === "orvess-pat") {
    return <SimulatedFocalPlane />;
  }
  if (project.media) {
    return (
      <Image
        src={project.media.src}
        alt={project.media.alt}
        width={640}
        height={400}
        className="project-card__img"
      />
    );
  }
  return <SimulatedFocalPlane />;
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div
      className={`projects-stack ${hoveredSlug ? "has-hovered-item" : ""}`}
      onMouseLeave={() => setHoveredSlug(null)}
    >
      {projects.map((project, index) => {
        const isHovered = hoveredSlug === project.slug;

        return (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-card ${isHovered ? "is-hovered" : ""}`}
            data-project-tile="true"
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onFocus={() => setHoveredSlug(project.slug)}
            onBlur={() => setHoveredSlug(null)}
          >
            {/* Visual Preview Frame directly inside every tile */}
            <div className="project-card__preview">
              <div className="project-card__preview-inner">
                <ProjectVisual project={project} />
              </div>
              <div className="project-card__preview-badge">
                <span className="project-card__preview-dot" aria-hidden="true" />
                <span>{project.slug === "gehu-connect" ? "Live Client" : project.kind}</span>
              </div>
            </div>

            {/* Project Details Content */}
            <div className="project-card__content">
              <div className="project-card__meta">
                <span className="project-card__index">
                  _{String(index + 1).padStart(2, "0")}.
                </span>
                <span className="project-card__kind">{project.kind}</span>
                <span className="project-card__status">{project.status}</span>
              </div>

              <div className="project-card__head">
                <h3 className="project-card__title">{project.name}</h3>
                <span className="project-card__arrow" aria-hidden="true">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </div>

              <p className="project-card__summary">{project.summary}</p>

              <div className="project-card__foot">
                <div className="project-card__stack">
                  {project.stack.slice(0, 4).map((tech, idx) => (
                    <span key={tech} className="project-card__tech">
                      {tech}
                      {idx < Math.min(project.stack.length, 4) - 1 && (
                        <span className="project-card__dot" aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>

                {project.reading && (
                  <span className="project-card__metric">
                    {project.reading.value} {project.reading.unit}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
