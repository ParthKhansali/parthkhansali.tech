import type { MetadataRoute } from "next";
import { siteConfig, CONTENT_UPDATED } from "@/data/site";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

/**
 * Only canonical, indexable, public URLs. API routes, the 404 and the OG image
 * route are deliberately absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_UPDATED}T00:00:00.000Z`);
  const base = siteConfig.url;

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: project.tier === "flagship" ? 0.9 : 0.7,
    })),
    {
      url: `${base}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/lounge`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
