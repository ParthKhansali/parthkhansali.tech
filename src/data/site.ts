/**
 * Public identity, in one place.
 *
 * The canonical origin is a constant on purpose. An earlier version read
 * NEXT_PUBLIC_SITE_URL with a fallback, and production shipped canonicals,
 * sitemap entries and JSON-LD `@id`s pointing at a domain that did not
 * resolve. Nothing SEO-critical may depend on an environment variable being
 * right at build time.
 */
export const CANONICAL_ORIGIN = "https://www.parthkhansali.tech";

export const siteConfig = {
  name: "Parth Khansali",
  /** Used as `alternateName` so "ParthKhansali" resolves to the same entity. */
  handle: "ParthKhansali",
  url: CANONICAL_ORIGIN,
  locale: "en",
  location: {
    city: "Dehradun",
    region: "Uttarakhand",
    country: "India",
  },
  role: "Computer Science student and software developer",
  email: "parthkhansali@gmail.com",
  resumePath: "/parth_resume.pdf",
  links: {
    github: "https://github.com/ParthKhansali",
    linkedin: "https://www.linkedin.com/in/parth-khansali/",
    instagram: "https://www.instagram.com/parth_khansali/",
    youtube: "https://www.youtube.com/@Its_Parth",
  },
  education: {
    institution: "Graphic Era Hill University",
    degree: "B.Tech, Computer Science and Engineering",
    location: "Dehradun, Uttarakhand",
    period: "2024 — 2028",
  },
} as const;

/** Absolute URL for a site-relative path, or a pass-through for external URLs. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every public profile, in the order they appear on the page. */
export const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "Instagram", href: siteConfig.links.instagram },
] as const;

/** Last content revision, used for sitemap `lastModified` and JSON-LD. */
export const CONTENT_UPDATED = "2026-11-09";
