import Link from "next/link";
import Image from "next/image";
import LocalClock from "@/components/ui/LocalClock";
import { siteConfig, socialLinks, withBasePath } from "@/data/site";

const columns = [
  {
    heading: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/projects" },
      { label: "Resume", href: "/resume" },
      { label: "Lounge", href: "/lounge" },
    ],
  },
  {
    heading: "Elsewhere",
    links: socialLinks.map((link) => ({ label: link.label, href: link.href })),
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Parth Khansali home">
              <div className="brand__pfp-wrap">
                <Image
                  src={withBasePath("/profile.jpg")}
                  alt="Parth Khansali"
                  width={34}
                  height={34}
                  className="brand__avatar"
                />
                <span className="brand__pulse" aria-hidden="true" />
              </div>
              <span className="brand__name">Parth Khansali</span>
            </Link>
            <p className="footer-note">
              Computer science student in Dehradun, India. I build software and then
              write down what broke.
            </p>
            <p className="pill pill--quiet footer-status">
              <span className="pulse" aria-hidden="true" />
              Open to internships
            </p>
          </div>

          <nav aria-label="Pages">
            <p className="label">{columns[0].heading}</p>
            <div className="footer-list">
              {columns[0].links.map((link) => (
                <Link key={link.href} className="footer-link" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Elsewhere">
            <p className="label">{columns[1].heading}</p>
            <div className="footer-list">
              {columns[1].links.map((link) => (
                <a
                  key={link.href}
                  className="footer-link"
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </nav>

          <div>
            <p className="label">Contact</p>
            <div className="footer-list">
              <a className="footer-link" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              <a
                className="footer-link"
                href={siteConfig.resumePath}
                download="Parth Khansali Resume.pdf"
              >
                Download CV
              </a>
              <a className="footer-link" href="#main">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>

        <div className="colophon">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>
            {siteConfig.location.city}, {siteConfig.location.region} · <LocalClock />
          </span>
          <span>Set in Plus Jakarta Sans.</span>
        </div>
      </div>
    </footer>
  );
}
