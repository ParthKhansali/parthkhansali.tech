import { absoluteUrl, withBasePath } from "@/data/site";

/**
 * Project facts. Every detail comes strictly from Parth's brief or inspected
 * source repositories on disk and public GitHub repos. Nothing is invented,
 * and no analytics or unverified claims appear anywhere.
 *
 * `tier` drives presentation order and schema: GEHU Connect is the sole flagship.
 */
export type ProjectTier = "flagship" | "completed" | "ongoing";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCaseStudy {
  problem: string;
  role: string;
  architecture: string[];
  decisions: string[];
  whatBroke: string[];
  results: string;
  whatNext: string[];
  honestLimits?: string;
}

export interface Project {
  slug: string;
  name: string;
  tier: ProjectTier;
  /** Short, factual label used in cards and headers. */
  kind: string;
  /** Concise SEO page title suffix when distinct from `kind`. */
  seoTitle?: string;
  status: string;
  /** One sentence used for meta descriptions and index rows. */
  summary: string;
  /** Overview prose for the project page. */
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
  /** Structured case-study sections verified against code. */
  caseStudy?: ProjectCaseStudy;
  relatedNote?: { label: string; href: string };
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
    seoTitle: "GEHU Connect: React Native & Spring Boot",
    status: "Deployed",
    summary:
      "A student community and networking app for Graphic Era Hill University, used by roughly a thousand students.",
    body: [
      "Campus information splits itself across dozens of WhatsApp groups, portals, and notice PDFs that disappear within an hour. GEHU Connect brings peer discussions, academic materials, student communities, marketplace listings, and campus housing discovery into one mobile client.",
      "The client runs on React Native and Expo (SDK 54, Expo Router, Redux Toolkit Query), backed by a Java 21 / Spring Boot 3.5.9 API over PostgreSQL, Redis, Caffeine, STOMP WebSockets, and Cloudflare R2 media storage.",
      "Having roughly a thousand students actually use the app shifts every priority away from adding more tabs and toward surviving bad hostel Wi-Fi, bounding retry bursts, and keeping media traffic off API servers.",
    ],
    details: [
      {
        label: "Mobile Client",
        text: "React Native + Expo Router with RTK Query cache updates, SecureStore token handling, FlashList feeds, and @stomp/stompjs live chat.",
      },
      {
        label: "Backend API",
        text: "Java 21 & Spring Boot 3.5.9 exposing JWT-secured REST endpoints and WebSocket STOMP messaging with principal persistence per session.",
      },
      {
        label: "Media & Storage",
        text: "Direct-to-Cloudflare R2 PUT uploads via AWS SDK S3Presigner (enforced 25 MB image/doc, 50 MB video, 100 MB batch limits).",
      },
      {
        label: "Caching",
        text: "AbstractLayeredCacheService combining in-process Caffeine L1 (5 min TTL) and Redis L2 (30 min TTL) with ReentrantLock stampede locks.",
      },
    ],
    caseStudy: {
      problem:
        "Students at Graphic Era Hill University relied on scattered WhatsApp groups and overloaded portals for notices, notes, housing leads, and peer discussion.",
      role:
        "Built the full-stack product architecture across the Expo React Native mobile client, Java Spring Boot backend services, Redis/Caffeine caching layer, WebSocket messaging, and Cloudflare R2 media pipeline.",
      architecture: [
        "Expo React Native client using Redux Toolkit Query (8s request timeout, automatic 401 refresh flow) and @stomp/stompjs over WebSockets.",
        "Spring Boot 3.5.9 REST API with JPA/PostgreSQL persistence, JWT authentication (jjwt), and Aho-Corasick trie text moderation.",
        "Cloudflare R2 object storage integrated via AWS SDK S3Presigner so media bytes upload directly from mobile devices without passing through API app memory.",
      ],
      decisions: [
        "Presigned URLs over multipart API proxy: keeps Spring Boot web threads free even when several students upload campus notes or photos simultaneously.",
        "Two-tier Caffeine L1 + Redis L2 permission caching: absorbs high read pressure on community roles and channel overrides between classes.",
        "Client upload concurrency capped at 3 files with 1.5s linear backoff and explicit cancellation guards to behave predictably on patchy campus networks.",
      ],
      whatBroke: [
        "Sending media directly through the backend server under concurrent campus bursts risked tying up worker threads; moving to R2 presigned uploads resolved that bottleneck.",
        "STOMP WebSocket SEND frames initially lacked the Spring Security principal outside the CONNECT handshake until WebSocketAuthInterceptor stored and rehydrated session auth.",
        "Without bounded concurrent uploads and abort guards, cancelled attachments could still resolve stale React state updates on slow cellular handoffs.",
      ],
      results:
        "Deployed for Graphic Era Hill University students, reaching roughly 1,000 student users across feeds, academic repositories, housing, and community channels.",
      whatNext: [
        "Further tighten offline read resilience and graceful error recovery for low-signal hostel zones.",
        "Consolidate deployment observability so API latency spikes are isolated faster before campus traffic peaks.",
      ],
      honestLimits:
        "Usage figure reflects approximately 1,000 student users at GEHU; no daily active user metrics or inflated app-store install counts are claimed here.",
    },
    relatedNote: {
      label: "Read engineering note: R2 presigned uploads & Caffeine/Redis cache locks",
      href: "/notes/gehu-connect-r2-and-layered-cache/",
    },
    stack: [
      "React Native",
      "Expo",
      "Java",
      "Spring Boot",
      "Redis",
      "Cloudflare R2",
      "AWS SDK",
      "STOMP WebSockets",
    ],
    // No external app URL is linked while the legacy domain is inactive.
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
    seoTitle: "Netwich: macOS SOCKS5 Aggregator",
    status: "Completed and released",
    summary:
      "A native macOS app that bonds Wi-Fi, Ethernet and phone tethering into one local SOCKS5 connection with failover.",
    body: [
      "Most Macs have more than one internet path available: Wi-Fi, wired Ethernet, or USB mobile tethering. macOS routes all flows down one default interface and leaves the rest idle. Netwich uses all healthy interfaces without touching remote servers.",
      "It runs a local SOCKS5 proxy at 127.0.0.1:1080 and binds individual outgoing sockets onto physical interfaces via Apple's IP_BOUND_IF socket option. Active interfaces are scored continuously using EWMA RTT and throughput measurements, feeding a weighted least-connections scheduler.",
      "There is no cloud VPN, subscription, or telemetry: Netwich is a native SwiftUI app for macOS 14+ (Swift 6 toolchain with concurrency-safe scheduling) shipped with mergecli and signed/packaged extension bridges.",
    ],
    details: [
      {
        label: "Socket Binding",
        text: "Local SOCKS5 relay (127.0.0.1:1080) binding outgoing TCP sockets per interface using Darwin IP_BOUND_IF.",
      },
      {
        label: "Scheduler",
        text: "Weighted least-connections flow placement weighted by measured link health and active flow count, verified by concurrency stress tests.",
      },
      {
        label: "Download Engine",
        text: "Splits byte-range transfers concurrently across active links with disk-size validation and path sanitization.",
      },
      {
        label: "Footprint",
        text: "Native SwiftUI interface for macOS 14+ idling at 0.3% to 0.4% CPU after tuning timer tolerances.",
      },
    ],
    caseStudy: {
      problem:
        "macOS default routing concentrates every socket on one default network adapter, leaving a fast USB 5G tether or wired connection unused when Wi-Fi stutters.",
      role:
        "Designed and built the MergeKit networking engine, SwiftUI workstation app, local SOCKS5 relay, mergecli tool, Chromium/Firefox extension bridge, and DMG release pipeline.",
      architecture: [
        "MergeKit Core: Darwin interface discovery (en0, en5, etc.), EWMA RTT/throughput probing, weighted least-connections scheduler, and parallel ranged downloader.",
        "LocalProxyServer + BrowserBridge: 127.0.0.1:1080 SOCKS5 proxy paired with a loopback 127.0.0.1:19288 bridge for browser extension downloads.",
        "mergecli & Tests: CLI inspection tool plus unit tests covering weight distribution, cooldown/revival, and 4,000 concurrent acquire/release cycles without leaked flows.",
      ],
      decisions: [
        "Local IP_BOUND_IF SOCKS5 proxy over cloud VPN bonding: avoids latency hops, remote servers, and recurring relay costs at the expense of requiring SOCKS-aware apps or system proxy config.",
        "Swift 6 toolchain compiled in Swift 5 language mode on lock-guarded networking hot paths so strict actor isolation does not stall per-packet socket pumping.",
        "Versioned snapshot recovery in SystemProxyManager: records each network service's pre-existing proxy state before toggling, so existing corporate proxy configurations are restored on quit or crash.",
      ],
      whatBroke: [
        "A 15-second poll() idle timeout in early proxy pumping closed quiet SSH sessions and WebSockets until idle timeouts and EOF teardown were separated.",
        "Ignored IP_BOUND_IF errors previously caused silent fallback onto a single adapter while UI badges claimed aggregation.",
        "Wildcard CORS in the local browser bridge and unsanitized remote Content-Disposition filenames created security holes, both fixed cleanly with extension-only origin checks and DownloadItem filename sanitization.",
      ],
      results:
        "Completed and publicly released (v0.1.0 DMG on GitHub) with 31 automated unit tests across engine, scheduler, and security suites and ~0.3% to 0.4% measured idle CPU.",
      whatNext: [
        "Broader hardware multi-link throughput benchmarking across physical Wi-Fi + USB tethering setups with Developer ID NEAppProxyProvider entitlement testing.",
      ],
      honestLimits:
        "Documented openly in Netwich's testing guide: a single TCP connection never exceeds one interface's bandwidth, and throughput speedups only apply across multi-flow workloads or chunked range downloads.",
    },
    relatedNote: {
      label: "Read engineering note: 4 bugs fixed before Netwich v0.1.0",
      href: "/notes/netwich-socket-pitfalls/",
    },
    media: {
      src: withBasePath("/shots/netwich-1440.jpg"),
      srcSet: `${withBasePath("/shots/netwich-720.jpg")} 720w, ${withBasePath("/shots/netwich-1440.jpg")} 1440w`,
      width: 1440,
      height: 984,
      alt: "Netwich 0.1.0 overview window showing live throughput, attached network interfaces, and speed controls.",
      caption:
        "Netwich 0.1.0: live overview window showing attached interfaces, scheduler weighting, and local proxy status.",
    },
    stack: ["Swift 6", "SwiftUI", "macOS 14+", "SOCKS5", "IP_BOUND_IF"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/ParthKhansali/Netwich" },
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
    kind: "Geospatial wildlife intelligence",
    seoTitle: "ARANYA: Geospatial Conservation Prototype",
    status: "In progress",
    summary:
      "A 3D geospatial wildlife-conflict intelligence prototype in CesiumJS, piloted around Uttarakhand's Rajaji and Corbett corridors.",
    body: [
      "ARANYA explores how fragmented camera-trap detections, corridor boundaries, fringe settlement proximity, and satellite vegetation layers can come together in one operational decision-support view.",
      "Built as a Vite and CesiumJS web application centered automatically on India and Uttarakhand, the prototype models continuous 0-100 conflict risk surfaces alongside an embedded scenario simulator covering Rajaji, Chilla-Motichur corridor pinch points, Ramnagar, and Shyampur.",
      "This is an active hackathon and research prototype still under development, not a field-deployed wildlife authority platform.",
    ],
    details: [
      {
        label: "3D Mapping Engine",
        text: "CesiumJS 1.124 + Mapbox Vector Tile layers with curated camera presets across India, Uttarakhand, Rajaji, Corbett, and Raiwala.",
      },
      {
        label: "Pilot Spatial Layers",
        text: "Camera-trap nodes, corridor pinch points, fringe villages/railways, NASA GIBS MODIS NDVI canopy overlays, and conflict risk cells.",
      },
      {
        label: "Explainable Scoring",
        text: "Breaks down each risk zone by sightings recency, livestock density, forest-edge proximity, and habitat fragmentation rather than an opaque score.",
      },
    ],
    caseStudy: {
      problem:
        "Wildlife monitoring observations, corridor maps, and human settlement boundaries often live in disconnected GIS layers, slowing field assessment in conflict-prone forest fringes.",
      role:
        "Built the CesiumJS layer system, Uttarakhand spatial data providers, camera flight presets, and 4-scenario operational simulator.",
      architecture: [
        "Vite + vanilla modular JS frontend driving CesiumJS 3D globe entities (`src/data/aranya/`, `aranyaLayers.js`, `camera.js`).",
        "Layered overlays joining synthetic/curated camera traps, wildlife corridors, rail/road barrier segments, and NASA GIBS MODIS 8-day NDVI canopy data.",
      ],
      decisions: [
        "Explicit factor breakdown per risk polygon instead of a black-box risk number, so field operators can inspect why a sector is flagged.",
        "Focused Uttarakhand pilot defaults over generic global templates so camera framing and spatial layers match Indian conservation corridors.",
      ],
      whatBroke: [
        "Dense Cesium vector entities hurt initial viewport responsiveness before pruning layers and separating scenario triggers from base terrain rendering.",
      ],
      results:
        "Functional prototype hosted at project-aranya.vercel.app with scripted simulation scenarios and Node test suite (`test:aranya`).",
      whatNext: [
        "Replace synthetic scenario feeds cleanly with verified historical forest incident datasets if partnering with regional conservation researchers.",
      ],
      honestLimits:
        "Labeled in progress: simulation scenarios and camera-trap feeds in the online demo are synthetic prototype fixtures for hackathon validation.",
    },
    media: {
      src: withBasePath("/shots/aranya-1440.jpg"),
      srcSet: `${withBasePath("/shots/aranya-720.jpg")} 720w, ${withBasePath("/shots/aranya-1440.jpg")} 1440w`,
      width: 1440,
      height: 900,
      alt: "ARANYA Uttarakhand pilot: camera-trap stations beside a satellite terrain map of the Rajaji-Corbett corridor.",
      caption:
        "ARANYA: Uttarakhand pilot prototype displaying camera-trap stations and conflict layers on the Rajaji-Corbett corridor.",
    },
    stack: ["JavaScript", "CesiumJS", "Vite", "Vector Tiles", "Geospatial Data"],
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
    seoTitle: "ORVESS-PAT: Optical Tracking Simulation",
    status: "In progress",
    summary:
      "A Python and PySide6 simulation workbench for coarse pointing, acquisition, and tracking in free-space optical communications.",
    body: [
      "ORVESS-PAT explores ISRO Smart India Hackathon problem SIH26169: testing coarse beacon acquisition and tracking algorithms in simulation without physical optical benches or collimated lasers.",
      "Instead of wrapping a heavy object detector around a webcam dot, the simulator models a 640x480 focal-plane array (Airy disk PSF, shot noise, salt-and-pepper noise, fog attenuation) paired with sub-pixel intensity-weighted centroiding, observation quality scoring (q_t), an Adaptive-R Extended Kalman Filter, and a rate-limited Pan/Tilt controller.",
      "Still in active research and simulation; nothing here claims flight readiness or hardware optical-bench validation.",
    ],
    details: [
      {
        label: "Sensor & Physics",
        text: "Simulated 640x480 monochrome FPA modeling Airy/Gaussian point-spread functions, Poisson shot noise, salt-and-pepper noise, and Beer-Lambert fog fade.",
      },
      {
        label: "Estimator & Quality",
        text: "Sub-pixel centroiding computing observation quality q_t in [0, 1] to modulate measurement covariance R dynamically in the EKF.",
      },
      {
        label: "Testbed UI",
        text: "PySide6 Qt6 CAD-inspired workbench comparing Baseline vs. Adaptive trackers side by side via a pluggable BaseTracker interface.",
      },
    ],
    caseStudy: {
      problem:
        "Evaluating coarse optical beacon trackers under atmospheric fog, sensor noise, and gimbal slew limits requires repeatable experiments before hardware benches exist.",
      role:
        "Architected the optical simulation pipeline (`core/sensor.py`, `perception.py`, `ekf.py`, `controller.py`), pluggable tracker interface, and PySide6 multi-viewport GUI.",
      architecture: [
        "2000x2000 virtual coordinate scene projected into a moving 640x480 camera FOV driven by a rate-limited Pan/Tilt controller.",
        "Pluggable BaseTracker interface returning structured TrackerOutput metrics across Baseline, Alpha-Beta, Adaptive-R EKF, and hot-loaded custom scripts.",
      ],
      decisions: [
        "Intensity-weighted sub-pixel centroiding + Cramér-Rao uncertainty metrics instead of integer YOLO bounding boxes, preserving sub-pixel precision for faint spots.",
        "Separating the simulation UI workbench cleanly from `mock/` placeholders so core physics modules can swap cleanly across test harnesses.",
      ],
      whatBroke: [
        "An early comparison bug let Baseline and Adaptive trackers read from the same Perceptor instance, masking fog failure until per-tracker ROI bounds and fixed R clamping were isolated.",
        "Unclamped PID windup originally pushed the simulated camera FOV outside the 2000x2000 canvas until physical travel bounds and coast velocity damping were added.",
      ],
      results:
        "Working desktop Python simulation suite with side-by-side tracker comparison and Monte Carlo test runner scripts (`runner.py`, `test_all.py`).",
      whatNext: [
        "Standardize reproducible seed manifests cleanly across experimental notebooks and standalone UI builds.",
      ],
      honestLimits:
        "Labeled in progress: synthetic optical simulation and standalone prototype UI, not tested on physical laser terminals or flight hardware.",
    },
    stack: ["Python", "PySide6", "NumPy", "SciPy", "OpenCV", "Adaptive EKF"],
    links: [],
    schemaType: "SoftwareSourceCode",
  },
  {
    slug: "meghavyuha",
    name: "Meghavyuha",
    tier: "ongoing",
    kind: "Monsoon rainfall prototype",
    seoTitle: "Meghavyuha: Monsoon Forecast Prototype",
    status: "In progress",
    summary:
      "An SIH 2026 (SIH26080) probabilistic monsoon rainfall post-processing prototype built with Next.js, deck.gl, and an empirical Error Atlas.",
    body: [
      "Built with team Against The Odds (Team ID 149284) for Smart India Hackathon 2026 (PS SIH26080), Meghavyuha explores how NWP ensemble rainfall forecasts behave differently across monsoon synoptic regimes and Indian terrain.",
      "Instead of forcing one global statistical fix everywhere, the Error Atlas approach inspects historical forecast context to compare candidate post-processing methods (Raw NWP, Hurdle, CSG-EMOS, Quantile Mapping) and expose an evidence trace alongside explicit spatial limits.",
      "This is an ongoing hackathon research prototype deployed for evaluation, not an operational replacement for IMD or NCMRWF weather warnings.",
    ],
    details: [
      {
        label: "Problem Scope",
        text: "SIH 2026 (SIH26080): regime-conditioned post-processing and heavy-rain tail checking on 0.25 deg (~27 km) Indian gridded rainfall.",
      },
      {
        label: "Web Workspace",
        text: "Next.js 15, React 19, deck.gl, MapLibre GL, and Recharts displaying district area summaries, correction weights, and verification panels.",
      },
      {
        label: "Verification Focus",
        text: "Surfaces historical support counts, CRPS/Brier trade-offs, and fallback explanations instead of hiding uncertainty.",
      },
    ],
    caseStudy: {
      problem:
        "Global rainfall post-processing techniques wash out extremes or miscalibrate wet biases across Western Ghats orography, monsoon depressions, and break periods.",
      role:
        "Co-built the interactive forecast & verification workspace in Next.js/deck.gl and worked on framing the regime-conditioned Error Atlas evidence workflow.",
      architecture: [
        "Next.js 15 + React 19 frontend rendering interactive gridded rainfall layers with MapLibre GL, deck.gl aggregation layers, Recharts diagnostics, and Zustand state.",
        "Conceptual pipeline pairing physical synoptic/terrain context with out-of-fold Error Atlas lookup across Hurdle, CSG-EMOS, and Raw NWP baselines.",
      ],
      decisions: [
        "Replaced black-box confidence wording with an explicit Evidence Trace listing historical support and spatial scale (0.25 deg grid, not street-level point forecasts).",
        "Preserved probabilistic distribution outputs across heavy-rain thresholds (64.5 mm, 115.6 mm, 204.5 mm) rather than emitting deterministic point predictions.",
      ],
      whatBroke: [
        "Initial metric displays risked mixing proxy seasonal regimes with meteorological classifications; workspace documentation was revised to distinguish classifier inputs cleanly from proxies.",
      ],
      results:
        "Interactive web workspace live at meghavyuha.vercel.app for SIH 2026 demonstration and inspection.",
      whatNext: [
        "Align standalone out-of-fold historical verification scripts directly with held-out monsoon year splits before making quantitative skill comparisons.",
      ],
      honestLimits:
        "Labeled in progress: research and SIH hackathon prototype. It does not replace IMD/NCMRWF numerical forecasts or official weather advisories.",
    },
    media: {
      src: withBasePath("/shots/meghavyuha-1600.jpg"),
      srcSet: `${withBasePath("/shots/meghavyuha-800.jpg")} 800w, ${withBasePath("/shots/meghavyuha-1600.jpg")} 1600w`,
      width: 1600,
      height: 1034,
      alt: "Meghavyuha forecast dashboard for Dehradun showing rainfall probability bands, correction weights, and validation scores.",
      caption:
        "Meghavyuha: forecast verification workspace showing Dehradun regional layers, candidate model weights, and alerts.",
    },
    stack: ["Next.js 15", "TypeScript", "deck.gl", "MapLibre GL", "Python"],
    links: [
      { label: "Live deployment", href: "https://meghavyuha.vercel.app" },
      { label: "Source on GitHub", href: "https://github.com/ParthKhansali/MeghaVyuha" },
    ],
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

export const projectUrl = (slug: string) => absoluteUrl(`/projects/${slug}`);
