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
      "Runs the university Model United Nations club: conference planning, delegate management, committee operations and the logistics that keep a two-day event on schedule.",
  },
  {
    title: "Host and organizer",
    org: "University Model United Nations conferences",
    period: "2025 to 2026",
    detail:
      "Organized and hosted multiple university-level conferences, from committee operations to participant experience.",
  },
  {
    title: "Outreach and public speaking",
    org: "School outreach programme, Dehradun",
    period: "2025",
    detail:
      "Ran MUN seminars, mock sessions and workshops across more than fifteen schools in Dehradun.",
  },
  {
    title: "Delegate",
    org: "UNGA DISEC, IOC and global committees",
    period: "2024 to present",
    detail:
      "Represented Pakistan, Switzerland and Mexico across international committees.",
  },
];

export const hackathons: CVEntry[] = [
  {
    title: "Hackaholic → iQOO Pune Hackathon",
    org: "Three hackathon sprints",
    period: "2025 to 2026",
    detail:
      "Scope a build, cut it down to what can actually ship, and get a working deployed demo out inside the time limit.",
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
