/**
 * Host sample notes and engineering sketches shown alongside live visitor pins on The Wall.
 * Clearly authored by Parth Khansali so zero fabricated third-party testimonials or
 * invented endorsements are ever implied. Live visitor posts appear first via Firestore.
 */

export interface WallPin {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text?: string;
  drawing?: string;
  tag: string;
  createdAt: number;
  likes: number;
  rotation: number;
  isHostNote?: boolean;
}

// Fixed deterministic timestamps so SSR and client hydration stay identical
const TS_NETWICH = Date.parse("2026-11-08T10:00:00Z");
const TS_ORVESS = Date.parse("2026-11-07T14:30:00Z");
const TS_WELCOME = Date.parse("2026-11-06T09:00:00Z");

const NETWICH_DIAGRAM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%"><rect width="100%" height="100%" fill="%230e1015"/><g stroke="%2300ef4e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="30" width="96" height="40" rx="8"/><text x="72" y="55" fill="%2300ef4e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" stroke="none">Wi-Fi (en0)</text><rect x="24" y="110" width="96" height="40" rx="8"/><text x="72" y="135" fill="%2300ef4e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" stroke="none">Ethernet</text><rect x="24" y="190" width="96" height="40" rx="8"/><text x="72" y="215" fill="%2300ef4e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" stroke="none">USB Tether</text><path d="M120 50 C 185 50, 185 130, 238 130"/><path d="M120 130 L 238 130"/><path d="M120 210 C 185 210, 185 130, 238 130"/><circle cx="282" cy="130" r="42" stroke="%2300cbf0"/><text x="282" y="126" fill="%2300cbf0" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" stroke="none">NETWICH</text><text x="282" y="140" fill="%23ffffff" font-family="monospace" font-size="8" text-anchor="middle" stroke="none">127.0.0.1:1080</text><path d="M324 130 L 368 130" stroke-dasharray="4 4"/><polyline points="361,124 369,130 361,136"/></g><text x="200" y="248" fill="%23888899" font-family="monospace" font-size="10" text-anchor="middle">HOST SKETCH // IP_BOUND_IF SOCKS5 RELAY</text></svg>`;

const OPTICAL_BEAM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%"><rect width="100%" height="100%" fill="%230b0d12"/><g stroke="%2300ef4e" stroke-width="2" fill="none" stroke-linecap="round"><circle cx="74" cy="74" r="34" stroke="%23fbbf24"/><text x="74" y="78" fill="%23fbbf24" font-family="monospace" font-size="10" text-anchor="middle" stroke="none">BEACON</text><circle cx="326" cy="186" r="36" stroke="%2300cbf0"/><text x="326" y="182" fill="%2300cbf0" font-family="monospace" font-size="9" text-anchor="middle" stroke="none">FPA SENSOR</text><text x="326" y="196" fill="%23b5b5b5" font-family="monospace" font-size="8" text-anchor="middle" stroke="none">640x480</text><path d="M105 90 L 294 172" stroke="%2300ef4e" stroke-width="3"/><path d="M103 96 L 294 180" stroke="%2300ef4e" stroke-width="1" stroke-dasharray="3 3"/><path d="M109 84 L 294 164" stroke="%2300ef4e" stroke-width="1" stroke-dasharray="3 3"/><circle cx="300" cy="175" r="8" fill="%2300ef4e" opacity="0.3"/></g><text x="200" y="34" fill="%2300ef4e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">ORVESS-PAT: COARSE TRACKING MODEL</text><text x="200" y="242" fill="%23888899" font-family="monospace" font-size="9" text-anchor="middle">Sub-pixel centroiding | Adaptive-R EKF (q_t)</text></svg>`;

export const HOST_NOTES: WallPin[] = [
  {
    id: "host-welcome",
    name: "Parth Khansali",
    role: "Host · Author Note",
    avatar: "/profile.jpg",
    text: "Welcome to the Lounge board. Real visitor notes and whiteboard sketches appear right above once signed in with Google. Leave a note, bug report, or quick doodle.",
    tag: "HostNote",
    createdAt: TS_WELCOME,
    likes: 1,
    rotation: -0.9,
    isHostNote: true,
  },
  {
    id: "host-netwich-sketch",
    name: "Parth Khansali",
    role: "Host · Architecture Sketch",
    avatar: "/profile.jpg",
    drawing: NETWICH_DIAGRAM_SVG,
    text: "Quick whiteboard schematic from Netwich: per-socket IP_BOUND_IF pinning behind a local 127.0.0.1:1080 SOCKS5 proxy.",
    tag: "Architecture",
    createdAt: TS_NETWICH,
    likes: 1,
    rotation: 1.1,
    isHostNote: true,
  },
  {
    id: "host-orvess-sketch",
    name: "Parth Khansali",
    role: "Host · Simulation Sketch",
    avatar: "/profile.jpg",
    drawing: OPTICAL_BEAM_SVG,
    text: "Rough diagram from the ORVESS-PAT workbench: 640x480 simulated FPA feed feeding observation quality q_t into an Adaptive-R Kalman filter.",
    tag: "Simulation",
    createdAt: TS_ORVESS,
    likes: 1,
    rotation: -0.7,
    isHostNote: true,
  },
];

export const SEEDED_PINS = HOST_NOTES;
