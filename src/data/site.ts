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
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a site-relative static asset path with Next.js BASE_PATH when set. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || !BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

export const siteConfig = {
  name: "Parth Khansali",
  givenName: "Parth",
  familyName: "Khansali",
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
  resumePath: withBasePath("/parth_resume.pdf"),
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
    period: "2024 to 2028",
  },
} as const;

/** Normalize a page path to match Next.js `trailingSlash: true`, while keeping static file paths as-is. */
export function canonicalPath(path: string): string {
  if (!path || path === "/") return "/";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (/\.[a-z0-9]{1,10}$/i.test(clean)) return clean;
  return clean.endsWith("/") ? clean : `${clean}/`;
}

/** Absolute canonical URL for a site-relative path, or a pass-through for external URLs. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = canonicalPath(path);
  return normalized === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${normalized}`;
}

/** Every public profile, in the order they appear on the page. */
export const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "Instagram", href: siteConfig.links.instagram },
] as const;

/** Truthful creation timestamp of Parth's root profile from git history. */
export const PROFILE_CREATED = "2026-06-03T12:40:56+05:30";

/** Truthful last substantive revision per route (update only the route whose content changed). */
export const ROUTE_UPDATED: Record<string, string> = {
  "/": "2026-11-10T23:47:01+05:30",
  "/projects/": "2026-11-10T22:01:50+05:30",
  "/projects/gehu-connect/": "2026-11-10T22:01:50+05:30",
  "/projects/netwich/": "2026-11-10T23:47:01+05:30",
  "/projects/aranya/": "2026-11-10T22:01:50+05:30",
  "/projects/orvess-pat/": "2026-11-10T22:01:50+05:30",
  "/projects/meghavyuha/": "2026-11-10T23:47:01+05:30",
  "/resume/": "2026-11-10T22:01:50+05:30",
  "/lounge/": "2026-11-10T22:01:50+05:30",
  "/notes/": "2026-11-10T23:47:01+05:30",
  "/notes/netwich-socket-pitfalls/": "2026-11-10T22:01:50+05:30",
  "/notes/gehu-connect-r2-and-layered-cache/": "2026-11-10T22:01:50+05:30",
  "/privacy/": "2026-11-10T01:09:48+05:30",
  "/terms/": "2026-11-10T01:09:48+05:30",
};

/** Fallback revision date when a route entry does not specify its own timestamp. */
export const CONTENT_UPDATED = "2026-11-10T23:47:01+05:30";
