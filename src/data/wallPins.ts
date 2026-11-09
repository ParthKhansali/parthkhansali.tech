/**
 * Creative mock pins and reviews for The Wall gallery.
 * Seeded so visitors immediately experience a vibrant corkboard gallery of sketches,
 * reviews, campus feedback, and architecture notes.
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
}

// Inline SVGs for authentic whiteboard sketches
const NETWICH_DIAGRAM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%"><rect width="100%" height="100%" fill="%230e1015"/><g stroke="%2300ef4e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="30" width="80" height="40" rx="8"/><text x="70" y="55" fill="%2300ef4e" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">Wi-Fi</text><rect x="30" y="110" width="80" height="40" rx="8"/><text x="70" y="135" fill="%2300ef4e" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">Ethernet</text><rect x="30" y="190" width="80" height="40" rx="8"/><text x="70" y="215" fill="%2300ef4e" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">Cellular</text><path d="M110 50 C 180 50, 180 130, 240 130"/><path d="M110 130 L 240 130"/><path d="M110 210 C 180 210, 180 130, 240 130"/><circle cx="280" cy="130" r="38" stroke="%2300cbf0"/><text x="280" y="128" fill="%2300cbf0" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" stroke="none">NETWICH</text><text x="280" y="142" fill="%23ffffff" font-family="monospace" font-size="8" text-anchor="middle" stroke="none">SOCKS5</text><path d="M318 130 L 365 130" stroke-dasharray="4 4"/><polyline points="358,124 366,130 358,136"/></g><text x="200" y="248" fill="%23888899" font-family="monospace" font-size="10" text-anchor="middle">NETWICH // BONDING ENGINE TOPOLOGY</text></svg>`;

const RETRO_CAT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%"><rect width="100%" height="100%" fill="%230f1117"/><g stroke="%2300ef4e" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="130,170 110,80 160,110 240,110 290,80 270,170 130,170"/><circle cx="160" cy="140" r="7" fill="%2300ef4e"/><circle cx="240" cy="140" r="7" fill="%2300ef4e"/><line x1="190" y1="150" x2="210" y2="150"/><polyline points="200,150 195,160 205,160 200,150"/><line x1="80" y1="135" x2="135" y2="142"/><line x1="75" y1="150" x2="135" y2="150"/><line x1="80" y1="165" x2="135" y2="158"/><line x1="320" y1="135" x2="265" y2="142"/><line x1="325" y1="150" x2="265" y2="150"/><line x1="320" y1="165" x2="265" y2="158"/></g><text x="200" y="215" fill="%2300cbf0" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">PARTH WAS HERE</text><text x="200" y="235" fill="%23666677" font-family="monospace" font-size="10" text-anchor="middle">// DEHRADUN CAMPUS 2026</text></svg>`;

const OPTICAL_BEAM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%"><rect width="100%" height="100%" fill="%230b0d12"/><g stroke="%2300ef4e" stroke-width="2" fill="none" stroke-linecap="round"><circle cx="70" cy="70" r="30" stroke="%23fbbf24"/><text x="70" y="74" fill="%23fbbf24" font-family="monospace" font-size="10" text-anchor="middle" stroke="none">SAT-1</text><circle cx="330" cy="190" r="26" stroke="%2300cbf0"/><text x="330" y="194" fill="%2300cbf0" font-family="monospace" font-size="9" text-anchor="middle" stroke="none">RX FPA</text><path d="M98 84 L 305 178" stroke="%2300ef4e" stroke-width="3"/><path d="M96 90 L 305 186" stroke="%2300ef4e" stroke-width="1" stroke-dasharray="3 3"/><path d="M102 78 L 305 170" stroke="%2300ef4e" stroke-width="1" stroke-dasharray="3 3"/><circle cx="310" cy="180" r="8" fill="%2300ef4e" opacity="0.3"/></g><text x="200" y="45" fill="%2300ef4e" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">ORVESS-PAT: CENTROID SIMULATION</text><text x="200" y="238" fill="%23888899" font-family="monospace" font-size="9" text-anchor="middle">sigma = 0.18px | Monte Carlo N=10,000</text></svg>`;

export const SEEDED_PINS: WallPin[] = [
  {
    id: "pin-1",
    name: "Rohit Sharma",
    role: "B.Tech CSE · GEHU",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    text: "GEHU Connect saved my semester during midterms when the university portal couldn't handle the traffic. Offline cache was a lifesaver. Huge props to Parth!",
    tag: "Campus App",
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    likes: 24,
    rotation: -1.2,
  },
  {
    id: "pin-2",
    name: "Alex Vance",
    role: "Systems Dev · Berlin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    drawing: NETWICH_DIAGRAM_SVG,
    text: "Doodled the Netwich multi-link tunnel topology. Pure Swift 6 IP_BOUND_IF with zero external daemons is the cleanest approach I've seen.",
    tag: "Architecture",
    createdAt: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    likes: 38,
    rotation: 1.5,
  },
  {
    id: "pin-3",
    name: "Maya Lin",
    role: "Frontend Engineer · Vercel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    text: "The falling Matrix cyber rain on the hero and the buttery smooth navigation drawer are top tier. Feels designed, not AI-generated. Bookmark-worthy portfolio!",
    tag: "Review",
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    likes: 56,
    rotation: -0.8,
  },
  {
    id: "pin-4",
    name: "Devendra S.",
    role: "Hacker · Dehradun",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    drawing: RETRO_CAT_SVG,
    text: "Leaving my lucky cyber cat on Parth's wall. Best of luck for upcoming hackathons!",
    tag: "Sketch",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    likes: 19,
    rotation: 1.8,
  },
  {
    id: "pin-5",
    name: "Dr. K. Raman",
    role: "Fellow · Satellite Systems",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    drawing: OPTICAL_BEAM_SVG,
    text: "Inspected the ORVESS-PAT optical tracking simulation. The Gaussian beam profile convolution and sub-pixel centroiding calculations match empirical satellite tests.",
    tag: "Simulation",
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    likes: 31,
    rotation: -1.4,
  },
  {
    id: "pin-6",
    name: "Ananya Joshi",
    role: "Model UN Secretariat · Graphic Era",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    text: "Parth's leadership as Director General for the university MUN club is just as sharp as his code. Rare to find engineers who can build core systems AND lead 200+ delegates seamlessly.",
    tag: "Leadership",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    likes: 47,
    rotation: 0.9,
  },
];

