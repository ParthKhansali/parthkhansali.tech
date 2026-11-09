"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

const navigation = [
  { href: "/", label: "Home" },
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
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            PK
          </span>
          <span className="brand__name">Parth</span>
        </Link>

        <nav className="nav-pill" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-pill__link"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--primary btn--small" href={`mailto:${siteConfig.email}`}>
            Say hi
          </a>

          <details className="menu">
            <summary aria-label="Open menu">Menu</summary>
            <div className="menu__panel">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-pill__link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <a className="nav-pill__link" href={`mailto:${siteConfig.email}`}>
                Email me
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
