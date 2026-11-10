import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { notes } from "@/data/notes";
import { absoluteUrl, canonicalPath, CONTENT_UPDATED, ROUTE_UPDATED } from "@/data/site";

export const dynamic = "force-static";

function lastModFor(routePath: string): Date {
  const key = canonicalPath(routePath);
  const iso = ROUTE_UPDATED[key] ?? CONTENT_UPDATED;
  return new Date(`${iso}T00:00:00.000Z`);
}

/**
 * Search-engine sitemap using exact canonical trailing-slash URLs (zero 308
 * redirects) and per-route modification timestamps derived from actual edits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/projects/",
    ...projects.map((project) => `/projects/${project.slug}/`),
    "/notes/",
    ...notes.map((note) => `/notes/${note.slug}/`),
    "/resume/",
    "/lounge/",
    "/privacy/",
    "/terms/",
  ];

  return routes.map((routePath) => ({
    url: absoluteUrl(routePath),
    lastModified: lastModFor(routePath),
  }));
}
