/**
 * CV content. Sourced from the previous resume page and the experience
 * timeline already in this repository.
 *
 * Deliberately absent: the personal phone number that the old resume page
 * published. A portfolio does not need a phone number on the open web, and
 * publishing one permanently is a privacy liability. Email is enough.
 */

export interface CVEntry {
  title: string;
  org: string;
  period: string;
  detail: string;
}

export const education: CVEntry[] = [
  {
    title: "B.Tech, Computer Science and Engineering",
    org: "Graphic Era Hill University, Dehradun",
    period: "2024 to 2028",
    detail: "CGPA 7.6. Data structures, algorithms, databases, operating systems, computer networks.",
  },
  {
    title: "Senior Secondary (CBSE)",
    org: "Doon International School, Dehradun",
    period: "2024",
    detail: "Class XII.",
  },
  {
    title: "Secondary (ICSE)",
    org: "Summer Valley School, Dehradun",
    period: "2022",
    detail: "Class X.",
  },
];

export const leadership: CVEntry[] = [
  {
    title: "Director General",
    org: "Graphic Era MUN Club",
    period: "2024 to present",
    detail:
      "Runs the university Model United Nations club: conference planning, delegate management, committee operations, and workshops across 15+ schools in Dehradun.",
  },
  {
    title: "Host and organizer",
    org: "University Model United Nations conferences",
    period: "2025 to 2026",
    detail:
      "Organized and hosted multiple university-level conferences, from committee operations to participant experience.",
  },
  {
    title: "Delegate Recognition & Conferences",
    org: "Lokvidhan MUN · IIT Roorkee MUN",
    period: "2024 to 2026",
    detail:
      "Awarded High Commendation at Lokvidhan MUN and participated as a delegate at IIT Roorkee MUN representing international portfolios.",
  },
];

export const hackathons: CVEntry[] = [
  {
    title: "Best Pitch Award",
    org: "TBI Tourism Hackathon",
    period: "2025 to 2026",
    detail:
      "Won Best Pitch Award by scoping a focused product narrative and live prototype under strict hackathon time limits.",
  },
  {
    title: "4th Place Finish",
    org: "Hackaholic Hackathon",
    period: "2025 to 2026",
    detail:
      "Placed 4th overall with a working full-stack demo; continued shipping rapid iterations through iQOO Pune and Smart India Hackathon cycles.",
  },
];

export const certifications = [
  "Python Crash Course",
  "Introduction to Machine Learning",
  "Databases and SQL",
];

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"] },
  {
    label: "Frameworks",
    items: ["Spring Boot", "React Native", "Expo", "Next.js", "React", "Node.js", "Express"],
  },
  { label: "Data", items: ["MySQL", "MongoDB"] },
  {
    label: "Tooling",
    items: ["Git", "GitHub", "Kafka", "Cloudflare R2", "AWS SDK", "Postman", "Figma", "Jupyter"],
  },
  {
    label: "Foundations",
    items: [
      "Data structures and algorithms",
      "Databases",
      "Operating systems",
      "Computer networks",
      "REST API design",
      "System design",
    ],
  },
];
