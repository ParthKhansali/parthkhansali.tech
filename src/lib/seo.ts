import type { Metadata } from "next";
import { absoluteUrl, canonicalPath, CONTENT_UPDATED, ROUTE_UPDATED, siteConfig } from "@/data/site";
import { projects, type Project } from "@/data/projects";

const DEFAULT_OG_IMAGE = "/opengraph-image";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image path. */
  image?: string;
  type?: "website" | "profile" | "article";
  noIndex?: boolean;
};

/**
 * Every page builds its metadata here so canonical, Open Graph and Twitter
 * can never drift apart. `metadataBase` in the root layout turns the relative
 * URLs into absolutes, so `path` is always normalized with `canonicalPath`.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: PageMeta): Metadata {
  const canonical = canonicalPath(path);
  const url = absoluteUrl(canonical);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      ...(type === "profile"
        ? {
            firstName: siteConfig.givenName,
            lastName: siteConfig.familyName,
            username: siteConfig.handle,
          }
        : {}),
      locale: "en_IN",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

/** The one Person entity every other node points at. */
export function personNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    givenName: siteConfig.givenName,
    familyName: siteConfig.familyName,
    alternateName: [siteConfig.handle, "Parth"],
    url: `${siteConfig.url}/`,
    mainEntityOfPage: { "@id": `${siteConfig.url}/#webpage` },
    image: {
      "@type": "ImageObject",
      url: absoluteUrl("/profile.jpg"),
      caption: "Parth Khansali - Computer science student and software developer",
    },
    jobTitle: "Software developer",
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Developer",
      occupationLocation: {
        "@type": "City",
        name: siteConfig.location.city,
      },
    },
    description:
      "Parth Khansali is a computer science student at Graphic Era Hill University in Dehradun, India, and the developer of GEHU Connect and Netwich.",
    email: `mailto:${siteConfig.email}`,
    nationality: {
      "@type": "Country",
      name: siteConfig.location.country,
    },
    knowsLanguage: ["English", "Hindi"],
    homeLocation: {
      "@type": "Place",
      name: `${siteConfig.location.city}, ${siteConfig.location.region}, ${siteConfig.location.country}`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.education.institution,
      url: "https://www.gehu.ac.in/",
    },
    knowsAbout: [
      "Software engineering",
      "React Native",
      "Spring Boot",
      "Java",
      "TypeScript",
      "Next.js",
      "Swift",
      "Distributed systems",
      "Geospatial data",
    ],
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.youtube,
      siteConfig.links.instagram,
    ],
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteConfig.url}/`,
    name: siteConfig.name,
    alternateName: [siteConfig.handle, "Khansali", "parthkhansali.tech"],
    description:
      "The work and build log of Parth Khansali, a computer science student and software developer in Dehradun, India.",
    inLanguage: "en",
    author: { "@id": personId },
    publisher: { "@id": personId },
    copyrightHolder: { "@id": personId },
  };
}

type PageNodeInput = {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage";
  dateModified?: string;
  /** Extra entities that belong on this page only. */
  about?: Record<string, unknown>[];
};

export function pageNode({
  path,
  name,
  description,
  type = "WebPage",
  dateModified,
  about,
}: PageNodeInput) {
  const canonical = canonicalPath(path);
  const url = absoluteUrl(canonical);
  const modified = dateModified ?? ROUTE_UPDATED[canonical] ?? CONTENT_UPDATED;

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: about ?? { "@id": personId },
    inLanguage: "en",
    dateModified: modified,
    ...(type === "ProfilePage"
      ? { dateCreated: "2026-06-03", mainEntity: { "@id": personId } }
      : {}),
  };
}

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Schema for one project, typed honestly for what the artefact actually is. */
export function projectNode(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const repoLink = project.links.find((l) => l.href.startsWith("https://github.com/"));

  const base = {
    "@type": project.schemaType,
    "@id": `${url}#project`,
    name: project.name,
    description: project.summary,
    url,
    author: { "@id": personId },
    creator: { "@id": personId },
    programmingLanguage: project.stack,
    ...(repoLink && project.schemaType === "SoftwareSourceCode"
      ? { codeRepository: repoLink.href }
      : {}),
    ...(project.links.length
      ? { sameAs: project.links.map((link) => link.href) }
      : {}),
  };

  if (project.schemaType === "SoftwareApplication") {
    return {
      ...base,
      operatingSystem: project.operatingSystem,
      applicationCategory: project.applicationCategory,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    };
  }

  return base;
}

export function articleNode({
  path,
  headline,
  description,
  datePublished,
  dateModified,
  about,
}: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  about?: Record<string, unknown>[];
}) {
  const url = absoluteUrl(path);
  return {
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    author: { "@id": personId },
    publisher: { "@id": personId },
    datePublished,
    dateModified,
    inLanguage: "en",
    ...(about ? { about } : {}),
  };
}

/**
 * Identity nodes, rendered once by the root layout so every page carries the
 * same Person and WebSite entities with stable @ids.
 */
export function identityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), websiteNode()],
  };
}

/** Page-scoped graph. References the identity nodes by @id rather than
 * repeating them, so the entity is decoded as one person, not four. */
export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      pageNode({
        path: "/",
        name: "Parth Khansali: Computer Science Student & Software Developer",
        description:
          "The work of Parth Khansali: GEHU Connect, a campus app used by roughly a thousand students, plus Netwich and other builds.",
        type: "ProfilePage",
      }),
      ...projects.map((project) => projectNode(project)),
    ],
  };
}
