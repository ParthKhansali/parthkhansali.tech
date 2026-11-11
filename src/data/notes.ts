export interface EngineeringNote {
  slug: string;
  title: string;
  seoTitle: string;
  summary: string;
  published: string;
  updated: string;
  readingTime: string;
  projectSlug: string;
  projectName: string;
  tags: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    codeNote?: string;
  }[];
  takeaway: string;
}

export const notes: EngineeringNote[] = [
  {
    slug: "netwich-socket-pitfalls",
    title: "Four bugs that broke Netwich before v0.1.0 shipped",
    seoTitle: "Netwich Socket & Proxy Bugs",
    summary:
      "What broke while building Netwich (macOS SOCKS5 proxy + IP_BOUND_IF): 15s idle cuts, silent fallback, bridge CORS, and proxy restoration.",
    published: "2026-11-10T22:01:50+05:30",
    updated: "2026-11-10T22:01:50+05:30",
    readingTime: "4 min read",
    projectSlug: "netwich",
    projectName: "Netwich",
    tags: ["Swift 6", "macOS", "POSIX Sockets", "SOCKS5"],
    sections: [
      {
        heading: "1. The 15-second idle timeout killed SSH and WebSockets",
        paragraphs: [
          "Early versions of LocalProxyServer used a 15-second poll() wait while relaying bidirectional streams. Whenever neither peer sent bytes for 15 seconds, the relay treated that timeout as a finished socket and closed the tunnel.",
          "Normal web page loads hid this bug completely. The moment you left an SSH session idle, connected a WebSocket, or paused a download, the connection dropped cleanly with no error log.",
          "Fixing it meant separating an idle poll wait from socket EOF and only tearing down a flow when an actual read/write closed, reset, or exceeded health bounds.",
        ],
      },
      {
        heading: "2. Silent IP_BOUND_IF failures and proxy cleanup",
        paragraphs: [
          "macOS defaults all traffic onto one primary interface unless each outbound socket is explicitly pinned via IP_BOUND_IF. In early builds, failures on that setsockopt call were swallowed silently, meaning Netwich could quietly funnel every stream onto a single adapter while showing multiple links as active.",
          "A related state bug lived in SystemProxyManager: enabling SOCKS5 proxying turned on localhost forwarding across services and 'restored' them on exit by turning proxies off unconditionally. Anyone using a corporate SOCKS proxy lost their configuration.",
          "The fix was two-part: fail loudly when interface pinning errors out so the weighted scheduler avoids broken paths, and snapshot each service's (server, port, enabled) tuple before changing anything, restoring that snapshot on exit or crash recovery.",
        ],
      },
      {
        heading: "3. Localhost browser bridge security and filename traversal",
        paragraphs: [
          "Netwich includes Chrome and Firefox companion extensions talking to a loopback HTTP bridge on 127.0.0.1:19288. Originally that bridge reflected any Origin header in Access-Control-Allow-Origin. Any malicious web page could query active transfers or cancel downloads.",
          "Restricting allowed origins strictly to extension URL schemes and sanitizing incoming filenames (stripping path traversal components and NUL bytes in DownloadItem) closed both local attack surfaces, verified in unit tests.",
        ],
      },
      {
        heading: "4. What Netwich explicitly does not claim",
        paragraphs: [
          "A single TCP connection never runs faster than a single link, and a remote server that throttles per-connection speed will not saturate combined interfaces through more connections alone.",
          "Netwich speeds up multi-flow workloads and chunked range downloads across independent connections, without routing traffic through any external relay server.",
        ],
      },
    ],
    takeaway:
      "Network utilities fail silently at the boundaries: timeouts, permission errors, and cleanup paths matter as much as the scheduler.",
  },
  {
    slug: "gehu-connect-r2-and-layered-cache",
    title: "Keeping GEHU Connect responsive on flaky campus networks",
    seoTitle: "GEHU Connect Caching & R2 Uploads",
    summary:
      "Notes from shipping GEHU Connect to ~1,000 campus users: presigned Cloudflare R2 uploads, L1 Caffeine + L2 Redis locks, and STOMP WebSocket auth.",
    published: "2026-11-10T22:01:50+05:30",
    updated: "2026-11-10T22:01:50+05:30",
    readingTime: "4 min read",
    projectSlug: "gehu-connect",
    projectName: "GEHU Connect",
    tags: ["React Native", "Spring Boot", "Cloudflare R2", "Redis"],
    sections: [
      {
        heading: "1. Taking media bytes off the application server",
        paragraphs: [
          "Students share images, study documents, and voice notes all day, often over patchy hostel Wi-Fi or congested cellular data. Streaming multi-megabyte uploads through Spring Boot workers ties up request threads and bloats server memory.",
          "In MediaServiceImpl, the backend validates attachment counts (maximum 10 files, 100 MB total payload) and per-type byte limits (25 MB images/docs, 50 MB video), then signs short-lived PUT URLs via AWS SDK S3Presigner pointing straight at Cloudflare R2.",
          "On the Expo React Native client, uploads are bounded to 3 concurrent transfers with retry backoff (1.5s per attempt) and explicit cancel guards so stale retries cannot overwrite UI state after a user cancels.",
        ],
      },
      {
        heading: "2. L1 Caffeine + L2 Redis with stampede locks",
        paragraphs: [
          "Repeated permission lookups across channels, community settings, and feeds can overwhelm PostgreSQL during peak campus hours between classes.",
          "AbstractLayeredCacheService checks an in-process Caffeine L1 cache (5-minute TTL, capped at 10,000 keys) first, falls back to shared Redis L2 (30-minute TTL), and uses a ConcurrentHashMap of ReentrantLocks when stampede protection is enabled so bursts against an uncached key hit the database once instead of dozens of times.",
        ],
      },
      {
        heading: "3. Persisting STOMP principals across WebSocket frames",
        paragraphs: [
          "During real-time channel messaging, validating JWTs purely on initial handshake left individual SEND frames without a populated security context.",
          "WebSocketAuthInterceptor extracts the Bearer token on StompCommand.CONNECT into WebSocket session attributes and rebuilds the authenticated Spring Security principal on subsequent SEND frames without forcing clients to repeat full HTTP handshakes.",
        ],
      },
      {
        heading: "4. Keeping claims honest",
        paragraphs: [
          "Around 1,000 students at Graphic Era Hill University use GEHU Connect, which is enough traffic to expose every rough timeout, retry edge case, and UI lag that local testing hides. Every architecture choice above came from fixing real friction rather than premature optimization.",
        ],
      },
    ],
    takeaway:
      "Campus software lives or dies on bad networks: bound concurrency, keep media out of API threads, and guard shared lookups.",
  },
];

export function getNote(slug: string): EngineeringNote | undefined {
  return notes.find((n) => n.slug === slug);
}
