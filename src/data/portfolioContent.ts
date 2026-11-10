/**
 * Single source of truth for portfolio storytelling, skills, workbench status,
 * bug museum notes, consolidated leadership/recognition, and personal facets.
 *
 * Optional personal entries stay typed and guarded so no invented cat names,
 * photos, or unconfirmed hobbies ever appear on the public site.
 */

export interface JourneyBeat {
  period: string;
  title: string;
  summary: string;
  link?: { label: string; href: string };
}

export interface SkillGroup {
  area: string;
  items: string[];
  usedIn: { label: string; href: string }[];
}

export interface WorkbenchItem {
  label: string;
  title: string;
  detail: string;
  href?: string;
}

export interface BugMuseumItem {
  project: string;
  title: string;
  detail: string;
  href: string;
}

export interface RecognitionItem {
  title: string;
  org: string;
  period: string;
  detail: string;
  kind: "Leadership" | "MUN" | "Hackathon";
}

export interface OffDutyFacet {
  id: string;
  label: string;
  detail: string;
  href?: string;
  /** Optional personal specifics to fill in later; null stays hidden gracefully. */
  optionalDetail?: string | null;
}

export const heroContent = {
  tagline: "I build software that makes complicated things feel simple.",
  proofLine:
    "Developer of GEHU Connect (~1,000 campus users) and Netwich for macOS, based in Dehradun.",
} as const;

export const journeyBeats: JourneyBeat[] = [
  {
    period: "Early curiosity",
    title: "Taking things apart to see why they broke",
    summary:
      "Started with web scripts and small UI builds in Dehradun, driven more by fixing annoying daily friction than chasing tutorial clones.",
  },
  {
    period: "2024",
    title: "B.Tech CSE at GEHU & MUN Club",
    summary:
      "Joined Graphic Era Hill University for Computer Science and stepped in as Director General of the university Model UN Club.",
  },
  {
    period: "2025 to 2026",
    title: "GEHU Connect (~1,000 students) & Hackathons",
    summary:
      "Shipped the campus platform in React Native, Java Spring Boot, and Cloudflare R2 while testing rapid scopes across hackathons (TBI Best Pitch, Hackaholic 4th).",
    link: { label: "Read case study", href: "/projects/gehu-connect/" },
  },
  {
    period: "2026",
    title: "Native macOS networking & simulations",
    summary:
      "Built Netwich in Swift 6 using local SOCKS5 + IP_BOUND_IF, alongside in-progress geospatial and optical simulation tools (ARANYA, ORVESS-PAT, MeghaVyuha).",
    link: { label: "Browse all projects", href: "/projects/" },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    area: "Mobile & Frontend",
    items: ["React Native", "Expo", "TypeScript", "JavaScript", "Next.js", "React"],
    usedIn: [
      { label: "GEHU Connect", href: "/projects/gehu-connect/" },
      { label: "Meghavyuha", href: "/projects/meghavyuha/" },
    ],
  },
  {
    area: "Backend & Cloud Storage",
    items: ["Java", "Spring Boot", "REST APIs", "WebSockets (STOMP)", "PostgreSQL / MySQL", "Redis", "Cloudflare R2", "AWS SDK"],
    usedIn: [{ label: "GEHU Connect", href: "/projects/gehu-connect/" }],
  },
  {
    area: "Systems & Native macOS",
    items: ["Swift 6", "SwiftUI", "POSIX Sockets", "SOCKS5", "IP_BOUND_IF"],
    usedIn: [{ label: "Netwich", href: "/projects/netwich/" }],
  },
  {
    area: "Simulation, GIS & Scientific",
    items: ["Python", "NumPy & SciPy", "OpenCV", "PySide6", "CesiumJS", "MongoDB"],
    usedIn: [
      { label: "ORVESS-PAT", href: "/projects/orvess-pat/" },
      { label: "ARANYA", href: "/projects/aranya/" },
    ],
  },
  {
    area: "Tooling & Craft",
    items: ["Git & GitHub", "Figma", "Postman", "Linux / Unix", "Tailwind CSS"],
    usedIn: [{ label: "Resume & full stack", href: "/resume/" }],
  },
];

export const workbenchItems: WorkbenchItem[] = [
  {
    label: "SHIPPING & MAINTAINING",
    title: "GEHU Connect campus reliability",
    detail:
      "Tightening upload retries, API caching, and low-connectivity UX for roughly a thousand GEHU students.",
    href: "/projects/gehu-connect/",
  },
  {
    label: "ITERATING (IN PROGRESS)",
    title: "ARANYA, ORVESS-PAT & MeghaVyuha",
    detail:
      "Refining geospatial risk layers, sub-pixel optical tracking filters, and regime-aware monsoon forecast verification.",
    href: "/projects/",
  },
  {
    label: "EXPLORING NEXT",
    title: "Swift concurrency & POSIX internals",
    detail:
      "Cleaning up multi-interface socket scheduling and macOS networking ergonomics learned from shipping Netwich.",
    href: "/notes/netwich-socket-pitfalls/",
  },
];

export const bugMuseumItems: BugMuseumItem[] = [
  {
    project: "Netwich",
    title: "15-second idle poll killed live SSH & WebSockets",
    detail:
      "A socket poll timeout in LocalProxyServer was treated like EOF, silently cutting idle tunnels until keepalive and shutdown states were separated.",
    href: "/notes/netwich-socket-pitfalls/",
  },
  {
    project: "GEHU Connect",
    title: "Hostel Wi-Fi bursts choked server memory during uploads",
    detail:
      "Moving attachments off Spring Boot to presigned Cloudflare R2 PUT URLs (max 3 concurrent) plus Caffeine/Redis cache locks fixed request stalls.",
    href: "/notes/gehu-connect-r2-and-layered-cache/",
  },
  {
    project: "ORVESS-PAT",
    title: "Shared Perceptor masked why classical trackers failed in fog",
    detail:
      "Both trackers read one global search ROI until isolating the baseline tracker exposed exactly where fixed-R Kalman filters lose lock.",
    href: "/projects/orvess-pat/",
  },
];

export const leadershipTimeline = [
  {
    title: "Director General",
    org: "Graphic Era MUN Club",
    period: "2024 to present",
    detail:
      "Leads the university Model United Nations club: two-day conference planning, delegate logistics, committee ops, and outreach workshops across 15+ schools in Dehradun.",
    tags: ["Leadership", "Conference ops", "15+ schools"],
    tone: "green",
  },
  {
    title: "MUN Delegate Record",
    org: "Lokvidhan MUN · IIT Roorkee MUN",
    period: "2024 to 2026",
    detail:
      "Earned High Commendation at Lokvidhan MUN and participated as a delegate at IIT Roorkee MUN across international committees.",
    tags: ["High Commendation (Lokvidhan)", "IIT Roorkee participant"],
    tone: "sky",
  },
  {
    title: "Hackathons & Product Sprints",
    org: "TBI Tourism · Hackaholic · iQOO Pune · SIH",
    period: "2025 to 2026",
    detail:
      "Best Pitch Award at TBI Tourism Hackathon and 4th place at Hackaholic, plus rapid prototypes shipped at iQOO Pune and SIH cycles.",
    tags: ["Best Pitch (TBI)", "4th Place (Hackaholic)"],
    tone: "amber",
  },
];

export const recognitionCards: RecognitionItem[] = [
  {
    kind: "Leadership",
    title: "Director General & 15+ School Outreach",
    org: "Graphic Era MUN Club",
    period: "2024 to present",
    detail:
      "Hosted university-scale MUN conferences and ran public-speaking seminars and workshops across more than fifteen schools in Dehradun.",
  },
  {
    kind: "MUN",
    title: "High Commendation at Lokvidhan MUN",
    org: "Lokvidhan MUN · Attended IIT Roorkee MUN",
    period: "2024 to 2026",
    detail:
      "Recognized with High Commendation at Lokvidhan MUN alongside active committee participation at IIT Roorkee MUN.",
  },
  {
    kind: "Hackathon",
    title: "Best Pitch (TBI) & 4th Place (Hackaholic)",
    org: "TBI Tourism Hackathon · Hackaholic",
    period: "2025 to 2026",
    detail:
      "Took home Best Pitch at the TBI Tourism Hackathon and finished 4th at Hackaholic by scoping demos strictly to what works live.",
  },
];

export const offDutyItems: OffDutyFacet[] = [
  {
    id: "speaking",
    label: "Public speaking & debating",
    detail: "Model UN committees, moderating debates, and mentoring student speakers.",
  },
  {
    id: "design",
    label: "Design & UI craft",
    detail: "Sweating interaction details, spacing, and typography before touching state logic.",
  },
  {
    id: "content",
    label: "YouTube & Instagram",
    detail: "Sharing creative builds and occasional content on @Its_Parth and @parth_khansali.",
    href: "https://www.youtube.com/@Its_Parth",
  },
  {
    id: "music",
    label: "Bansuri & music",
    detail: "Playing the bansuri and unwinding away from screens.",
    optionalDetail: null,
  },
  {
    id: "cat",
    label: "Resident cat",
    detail: "Keeps an eye on late-night debugging sessions.",
    optionalDetail: null,
  },
];

