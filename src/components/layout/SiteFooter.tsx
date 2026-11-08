import Link from "next/link";
import { siteConfig, socialLinks } from "@/data/site";

const columns = [
  {
    heading: "This site",
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
          <div>
            <p className="wordmark">
              <span className="wordmark__mark" aria-hidden="true">
                PK
              </span>
              Parth Khansali
            </p>
            <p className="section-note" style={{ marginTop: "0.75rem" }}>
              Computer science student in Dehradun, India. I build software and then
              write down what broke.
            </p>
            <p className="measured" style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
              {siteConfig.location.city}, {siteConfig.location.region}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="label">{column.heading}</p>
              <div className="footer-list">
                {column.links.map((link) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={link.href}
                      className="nav-link"
                      href={link.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} className="nav-link" href={link.href}>
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </nav>
          ))}
        </div>

        <div className="colophon">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>
            Set in Host Grotesk and Atkinson Hyperlegible Mono. Built with Next.js.
          </span>
        </div>
      </div>
    </footer>
  );
}
