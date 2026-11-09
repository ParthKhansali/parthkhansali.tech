import { siteConfig } from "@/data/site";

/**
 * Project facts. Everything here comes from one of three places: Parth's own
 * brief, the live deployment, or the public repository. Nothing is inferred,
 * and no number appears that he did not give.
 *
 * `tier` drives presentation order and schema: exactly one project is the
 * flagship.
 */
export type ProjectTier = "flagship" | "completed" | "ongoing";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  tier: ProjectTier;
  /** Short, factual, no adjectives doing the work of evidence. */
  kind: string;
  status: string;
  /** One sentence. Used for meta descriptions and index rows. */
  summary: string;
  /** Long-form body for the project page. */
  body: string[];
  /** What actually happens inside it. Real implementation detail only. */
  details: { label: string; text: string }[];
  stack: string[];
  links: ProjectLink[];
  /** Schema.org type that honestly describes the artefact. */
  schemaType: "SoftwareApplication" | "SoftwareSourceCode" | "CreativeWork";
  operatingSystem?: string;
  applicationCategory?: string;
  /** Highlighted reading shown beside the project on its page. */
  reading?: { value: string; unit: string; note: string };
  /** A real screenshot of the running project, where one exists. */
  media?: {
    src: string;
    srcSet?: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
  };
}

export const projects: Project[] = [
  {
    slug: "gehu-connect",
    name: "GEHU Connect",
    tier: "flagship",
    kind: "Campus networking app",
    status: "Deployed",
    summary:
      "A student community and networking app for Graphic Era Hill University, used by roughly a thousand students.",
    body: [
      "College life spreads itself across a dozen group chats, three notice boards and one WhatsApp forward nobody can find again. GEHU Connect puts people, communities and campus conversation back in one place, on the phone students already have in their hand.",
      "It is a React Native app on an Expo build pipeline, talking to a Spring Boot API written in Java. Media uploads go to Cloudflare R2 through the AWS SDK, so photos never sit on the application server or bloat a deploy.",
      "This is the project that taught me the difference between something that runs and something people use. Roughly a thousand students have it installed. That number changes what you care about: request latency, upload failure, whether the sign-up flow survives a bad campus network.",
    ],
    details: [
      {
        label: "Client",
        text: "React Native with Expo, shipping one codebase to iOS and Android.",
      },
      {
        label: "API",
        text: "Spring Boot in Java, exposing REST endpoints for auth, profiles, communities and the campus feed.",
      },
      {
        label: "Media",
        text: "Cloudflare R2 through the AWS SDK, keeping uploads off the application server.",
      },
      {
        label: "State of it",
        text: "Deployed and in active use by students at GEHU. Adoption is the interesting part; the feature list was never the hard bit.",
      },
    ],
    stack: [
      "React Native",
      "Expo",
      "Java",
      "Spring Boot",
      "Cloudflare R2",
      "AWS SDK",
      "REST APIs",
    ],
    // No public URL is listed: the domain previously used for the app is
    // parked, and linking a dead host is worse than linking nothing.
    links: [],
    schemaType: "SoftwareApplication",
    operatingSystem: "Android, iOS",
    applicationCategory: "SocialNetworkingApplication",
    reading: {
      value: "~1,000",
      unit: "students",
      note: "using the deployed app at GEHU",
    },
  },
  {
    slug: "netwich",
    name: "Netwich",
    tier: "completed",
    kind: "macOS networking app",
    status: "Completed and released",
    summary:
      "A native macOS app that bonds Wi-Fi, Ethernet and phone tethering into one connection with failover, running entirely on your own machine.",
    body: [
      "Most Macs already have more than one way onto the internet: office Wi-Fi, a phone tethered over USB, a 5G hotspot, a cable. macOS picks one default interface and leaves the rest idle. Netwich uses all of them at once.",
      "It runs a local SOCKS5 proxy on 127.0.0.1:1080 and binds each outgoing socket to a specific physical interface with Apple's IP_BOUND_IF control. Large downloads are split into byte-range chunks and spread across the live links. Flows are placed by a weighted least-connections scheduler, and each interface is continuously scored on round-trip time and throughput with EWMA smoothing, so a link that degrades loses traffic without killing the connections already on it.",
      "No relay, no subscription, no account, no telemetry. It is a SwiftUI app for macOS 14 and later, written in Swift 6, and it idles under half a percent of CPU because there is no background daemon to speak of.",
    ],
    details: [
      {
        label: "Routing",
        text: "A local SOCKS5 proxy on 127.0.0.1:1080 binds individual TCP sockets to physical interfaces using IP_BOUND_IF.",
      },
      {
        label: "Scheduling",
        text: "Adaptive weighted least-connections placement across every healthy interface.",
      },
      {
        label: "Health",
        text: "Round-trip time and throughput are sampled continuously and smoothed with an EWMA, so a failing link is demoted before users notice.",
      },
      {
        label: "Downloads",
        text: "Byte-range chunking splits a single large transfer across all active connections.",
      },
    ],
    media: {
      src: "/shots/netwich-1440.jpg",
      srcSet: "/shots/netwich-720.jpg 720w, /shots/netwich-1440.jpg 1440w",
      width: 1440,
      height: 984,
      alt: "Netwich 0.1.0: aggregate throughput across live links, the connection list with Wi-Fi readiness, and the speed-check controls.",
      caption:
        "Netwich 0.1.0 — the overview window, idle with one link attached. Every connection gets a weight and a health reading before traffic is placed on it.",
    },
    stack: ["Swift 6", "SwiftUI", "macOS 14+", "SOCKS5", "IP_BOUND_IF"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/ParthKhansali/Netwich" },
      // Deliberately the releases index, not /releases/latest: GitHub is
      // currently answering the single-release pages with a 504.
      {
        label: "Releases",
        href: "https://github.com/ParthKhansali/Netwich/releases",
      },
    ],
    schemaType: "SoftwareApplication",
    operatingSystem: "macOS 14 or later",
    applicationCategory: "UtilitiesApplication",
  },
  {
    slug: "aranya",
    name: "ARANYA",
    tier: "ongoing",
    kind: "Geospatial intelligence platform",
    status: "In progress",
    summary:
      "A geospatial platform that reads wildlife-conflict signals across India, piloted in Uttarakhand.",
    body: [
      "ARANYA is an attempt to make forest and wildlife data answer a practical question: where is conflict likely next, and what should a field team do about it? It tracks animal movement and activity, watches habitat change, and marks conservation hotspots so response can be evidence-led rather than reactive.",
      "Uttarakhand is the pilot region. The interesting engineering problem is not the map; it is reconciling sparse, inconsistent records from different sources into something a ranger can act on.",
      "It is being built as a hackathon project and is still in progress.",
    ],
    details: [
      {
        label: "Scope",
        text: "Conflict prediction, movement monitoring, habitat change and conservation hotspots.",
      },
      {
        label: "Pilot",
        text: "Uttarakhand, India.",
      },
      {
        label: "Hard part",
        text: "Joining fragmented field records into a single layer that stays honest about its uncertainty.",
      },
    ],
    media: {
      src: "/shots/aranya-1440.jpg",
      srcSet: "/shots/aranya-720.jpg 720w, /shots/aranya-1440.jpg 1440w",
      width: 1440,
      height: 900,
      alt: "ARANYA's Uttarakhand pilot: seven camera-trap stations listed beside a satellite terrain map of the Rajaji–Corbett corridor, with conflict and alert readouts along the top.",
      caption:
        "ARANYA — the Uttarakhand pilot, seven camera-trap stations on the Rajaji–Corbett corridor.",
    },
    stack: ["JavaScript", "Geospatial data", "Mapping"],
    links: [
      { label: "Live prototype", href: "https://project-aranya.vercel.app" },
      { label: "Source on GitHub", href: "https://github.com/ParthKhansali/Project-Aranya" },
    ],
    schemaType: "SoftwareSourceCode",
  },
  {
    slug: "orvess-pat",
    name: "ORVESS-PAT",
    tier: "ongoing",
    kind: "Optical tracking simulation",
    status: "In progress",
    summary:
      "A simulation suite for optical tracking and free-space optical communication, written in Python.",
    body: [
      "ORVESS-PAT started as an ISRO Smart India Hackathon problem in optical rendezvous and free-space optical communication, and turned into a question I wanted answered properly: what actually happens between light landing on a sensor and a system deciding it has a usable observation?",
      "The work is in simulation: a focal-plane array model, sub-pixel centroiding to recover a target position smaller than one pixel, observation quality scoring, adaptive filtering, and Monte Carlo runs to see which parts of the pipeline survive noise.",
      "It is an ongoing hackathon project, not a finished instrument.",
    ],
    details: [
      {
        label: "Sensor model",
        text: "A simulated focal-plane array with sub-pixel centroiding to recover target position below pixel resolution.",
      },
      {
        label: "Pipeline",
        text: "Observation quality scoring, adaptive filtering and explicit failure reasoning.",
      },
      {
        label: "Validation",
        text: "Monte Carlo sweeps across noise conditions to find where the pipeline breaks.",
      },
    ],
    stack: ["Python", "Simulation", "Monte Carlo", "Optical tracking"],
    links: [],
    schemaType: "SoftwareSourceCode",
  },
  {
    slug: "meghavyuha",
    name: "Meghavyuha",
    tier: "ongoing",
    kind: "Web application",
    status: "In progress",
    summary: "An ongoing hackathon build, deployed as a TypeScript web application.",
    body: [
      "Meghavyuha is a hackathon project in progress. It is a TypeScript web application, deployed and reachable at meghavyuha.vercel.app.",
      "I would rather leave this description short than pad it with claims the repository does not support. When the build is finished, the specifics go here.",
    ],
    details: [
      {
        label: "Status",
        text: "Active hackathon build, still changing.",
      },
      {
        label: "Surface",
        text: "A TypeScript web application, deployed on Vercel.",
      },
    ],
    media: {
      src: "/shots/meghavyuha-1600.jpg",
      srcSet: "/shots/meghavyuha-800.jpg 800w, /shots/meghavyuha-1600.jpg 1600w",
      width: 1600,
      height: 1034,
      alt: "Meghavyuha's full forecast dashboard for Dehradun: rainfall amount, probability and return-period bands, correction weights, model validation scores, and the alerts, model-analysis and system-health panels along the bottom.",
      caption:
        "Meghavyuha — Dehradun district, the full workspace: adaptive forecast, correction weights, validation and alerts.",
    },
    stack: ["TypeScript"],
    links: [{ label: "Live deployment", href: "https://meghavyuha.vercel.app" }],
    schemaType: "SoftwareSourceCode",
  },
];

export const flagship = projects.find((project) => project.tier === "flagship")!;

export const otherProjects = projects
  .filter((project) => project.tier !== "flagship")
  .sort((a, b) => {
    const order: Record<ProjectTier, number> = {
      flagship: 0,
      completed: 1,
      ongoing: 2,
    };
    return order[a.tier] - order[b.tier] || a.name.localeCompare(b.name);
  });

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const projectUrl = (slug: string) => `${siteConfig.url}/projects/${slug}`;
