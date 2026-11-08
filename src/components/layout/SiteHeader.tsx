"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

const navigation = [
  { href: "/projects", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/lounge", label: "Lounge" },
  { href: "/#contact", label: "Contact" },
];

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="wordmark" aria-label="Parth Khansali, home">
          <span className="wordmark__mark" aria-hidden="true">
            PK
          </span>
          Parth Khansali
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--primary header-cta" href={`mailto:${siteConfig.email}`}>
            Email me
          </a>

          <details className="menu">
            <summary>Menu</summary>
            <div className="menu__panel">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <a className="nav-link" href={`mailto:${siteConfig.email}`}>
                Email me
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
