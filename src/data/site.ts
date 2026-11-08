/**
 * One source of truth for public-facing URLs.
 *
 * The custom domain is not assumed until DNS is actually configured. The
 * currently verified deployment is the Vercel URL below; set
 * NEXT_PUBLIC_SITE_URL when a custom domain is live.
 */
const normaliseUrl = (value: string) => value.replace(/\/$/, "");

export const siteConfig = {
  name: "Parth Khansali",
  url: normaliseUrl(
    process.env.NEXT_PUBLIC_SITE_URL || "https://parthkhansali-dev.vercel.app"
  ),
  location: "Dehradun, India",
  email: "parthkhansali@gmail.com",
  links: {
    github: "https://github.com/ParthKhansali",
    linkedin: "https://www.linkedin.com/in/parth-khansali/",
    instagram: "https://www.instagram.com/parth_khansali",
    resume: "/parth_resume.pdf",
  },
  projects: {
    gehuConnect: {
      demo: "https://gehuconnect.in",
    },
    omniMentor: {
      github: "https://github.com/ParthKhansali/OmniMentor",
    },
    aranya: {
      demo: "https://project-aranya.vercel.app",
      github: "https://github.com/ParthKhansali/Project-Aranya",
    },
  },
} as const;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
