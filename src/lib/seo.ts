import type { Metadata } from "next";
import { absoluteUrl, siteConfig, CONTENT_UPDATED } from "@/data/site";
import { projects, type Project } from "@/data/projects";

const DEFAULT_OG_IMAGE = "/opengraph-image";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image path. */
  image?: string;
  noIndex?: boolean;
};

/**
 * Every page builds its metadata here so canonical, Open Graph and Twitter
 * can never drift apart. `metadataBase` in the root layout turns the relative
 * URLs into absolutes, so `path` is always the canonical site path.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
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
    alternateName: siteConfig.handle,
    url: siteConfig.url,
    image: absoluteUrl("/profile.jpg"),
    jobTitle: "Software developer",
    description:
      "Parth Khansali is a computer science student at Graphic Era Hill University in Dehradun, India, and the developer of GEHU Connect.",
    email: `mailto:${siteConfig.email}`,
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
    url: siteConfig.url,
    name: siteConfig.name,
    description:
      "The work and build log of Parth Khansali, a computer science student and software developer in Dehradun, India.",
    inLanguage: "en",
    publisher: { "@id": personId },
  };
}

type PageNodeInput = {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage";
  /** Extra entities that belong on this page only. */
  about?: Record<string, unknown>[];
};

export function pageNode({
  path,
  name,
  description,
  type = "WebPage",
  about,
}: PageNodeInput) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: about ?? { "@id": personId },
    inLanguage: "en",
    dateModified: CONTENT_UPDATED,
    ...(type === "ProfilePage" ? { mainEntity: { "@id": personId } } : {}),
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
  const url = `${siteConfig.url}/projects/${project.slug}`;

  const base = {
    "@type": project.schemaType,
    "@id": `${url}#project`,
    name: project.name,
    description: project.summary,
    url,
    author: { "@id": personId },
    creator: { "@id": personId },
    programmingLanguage: project.stack,
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
        name: "Parth Khansali — computer science student and software developer",
        description:
          "The work of Parth Khansali: GEHU Connect, a campus app used by roughly a thousand students, plus Netwich and other builds.",
        type: "ProfilePage",
      }),
      ...projects.map((project) => projectNode(project)),
    ],
  };
}
