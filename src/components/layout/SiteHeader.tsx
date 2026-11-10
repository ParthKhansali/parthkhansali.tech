"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig, withBasePath } from "@/data/site";
import { projects } from "@/data/projects";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { IconSun, IconSunrise, IconSunset, IconMoon } from "@/components/ui/Icons";

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

type GreetingKind = "morning" | "afternoon" | "evening" | "night";

function getGreeting(): { text: string; kind: GreetingKind } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", kind: "morning" };
  if (hour >= 12 && hour < 18) return { text: "Good Afternoon", kind: "afternoon" };
  if (hour >= 18 && hour < 22) return { text: "Good Evening", kind: "evening" };
  return { text: "Good Night", kind: "night" };
}

function GreetingIcon({ kind }: { kind: GreetingKind }) {
  if (kind === "morning") return <IconSunrise size={14} />;
  if (kind === "afternoon") return <IconSun size={14} />;
  if (kind === "evening") return <IconSunset size={14} />;
  return <IconMoon size={14} />;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState<{ text: string; kind: GreetingKind }>({
    text: "Hello",
    kind: "afternoon",
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setModalOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    queueMicrotask(() => setGreeting(getGreeting()));
  }, []);

  // Update sliding pill indicator position on desktop
  useEffect(() => {
    const activeIndex = navigation.findIndex((item) => isCurrent(pathname, item.href));
    const targetIdx = hoveredIdx !== null ? hoveredIdx : activeIndex >= 0 ? activeIndex : 0;
    const targetEl = linkRefs.current[targetIdx];
    const navEl = navRef.current;

    if (targetEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setIndicatorStyle({
        left: targetRect.left - navRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [pathname, hoveredIdx]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      const focusTimer = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [modalOpen]);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModalOpen((prev) => {
          if (prev) setSearchQuery("");
          return !prev;
        });
      }
      if (e.key === "Escape" && modalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  // Filter projects by search
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.kind.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Robust Say Hi / Reach Out action
  const handleSayHi = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(siteConfig.email).catch(() => {});
    }
    setToastMessage(`Email copied: ${siteConfig.email}`);
    setTimeout(() => setToastMessage(null), 3200);

    if (pathname === "/") {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "contact";
      }
    } else {
      router.push("/#contact");
    }

    // Also attempt mailto in case default mail app is configured
    setTimeout(() => {
      try {
        window.location.href = `mailto:${siteConfig.email}`;
      } catch {}
    }, 150);
  };

  return (
    <header className="site-header">
      {/* Toast notification pill */}
      {toastMessage && (
        <div className="header-toast" role="status" aria-live="polite">
          <span className="header-toast__dot" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="shell site-header__inner">
        {/* Brand with real profile photo and active status indicator */}
        <Link href="/" className="brand" aria-label="Parth Khansali home">
          <div className="brand__pfp-wrap">
            <Image
              src={withBasePath("/profile.jpg")}
              alt="Parth Khansali"
              width={34}
              height={34}
              className="brand__avatar"
              priority
            />
            <span className="brand__pulse" aria-hidden="true" />
          </div>
          <span className="brand__name">Parth</span>
        </Link>

        {/* Desktop Floating Navbar */}
        <nav
          ref={navRef}
          className="nav-pill"
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div className="nav-glow-beam" aria-hidden="true" />
          <div className="nav-glow-core" aria-hidden="true" />

          {/* Sliding highlight indicator pill */}
          <div
            className="nav-pill__indicator"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />

          {navigation.map((item, idx) => {
            const active = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  linkRefs.current[idx] = el;
                }}
                className={`nav-pill__link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHoveredIdx(idx)}
                onFocus={() => setHoveredIdx(idx)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions, Quick Search button, & Mobile Trigger */}
        <div className="site-header__actions">
          {/* Desktop Search / Command Menu Button */}
          <button
            type="button"
            className="nav-search-btn"
            onClick={() => setModalOpen(true)}
            title="Open command menu (⌘K)"
            aria-label="Search and menu"
          >
            <svg
              className="nav-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="nav-search-key">⌘K</span>
          </button>

          {/* Theme Switcher with Circular Reveal */}
          <ThemeToggle className="nav-theme-btn" />

          {/* Say Hi Button with multi-action fallback */}
          <button
            type="button"
            className="btn btn--primary btn--small nav-say-hi"
            onClick={handleSayHi}
            title={`Reach out directly: ${siteConfig.email}`}
          >
            Say hi
          </button>

          {/* Mobile floating greeting button */}
          <button
            type="button"
            className="mobile-nav-trigger"
            onClick={() => (modalOpen ? closeModal() : setModalOpen(true))}
            aria-label={modalOpen ? "Close menu" : "Open menu"}
            aria-expanded={modalOpen}
          >
            <span className="mobile-nav-trigger__icon" aria-hidden="true">
              <GreetingIcon kind={greeting.kind} />
            </span>
            <span className="mobile-nav-trigger__text">Menu</span>
            <span className={`mobile-nav-trigger__burger ${modalOpen ? "is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Navigation & Command Sheet Modal */}
      {modalOpen && (
        <div className="awrs-modal-backdrop" onClick={closeModal}>
          <div
            className="awrs-modal-card card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation and Jump"
          >
            {/* Top Toolbar: Search + Reach Out + Theme */}
            <div className="awrs-modal-top">
              <div className="awrs-search-bar">
                <svg
                  className="awrs-search-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Jump to a project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="awrs-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="awrs-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                type="button"
                className="awrs-reachout-btn"
                onClick={(e) => {
                  closeModal();
                  handleSayHi(e);
                }}
              >
                Reach out
              </button>

              <ThemeToggle className="awrs-icon-btn" />
            </div>

            {/* Instant Project Search Results Dropdown */}
            {searchQuery && (
              <div className="awrs-search-results">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <Link
                      key={proj.slug}
                      href={`/projects/${proj.slug}`}
                      className="awrs-search-item"
                      onClick={closeModal}
                    >
                      <div className="awrs-search-item__info">
                        <span className="awrs-search-item__name">{proj.name}</span>
                        <span className="awrs-search-item__kind">{proj.kind}</span>
                      </div>
                      <span className="awrs-search-item__arrow" aria-hidden="true">↗</span>
                    </Link>
                  ))
                ) : (
                  <p className="awrs-search-empty">No projects matching &quot;{searchQuery}&quot;</p>
                )}
              </div>
            )}

            {/* PAGES Section */}
            <div className="awrs-section awrs-section--pages">
              <p className="awrs-section-label">PAGES</p>
              <div className="awrs-pages-grid">
                <Link
                  href="/"
                  className={`awrs-page-tile ${pathname === "/" ? "is-active" : ""}`}
                  onClick={closeModal}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="awrs-tile-label">Home</span>
                </Link>

                <Link
                  href="/projects"
                  className={`awrs-page-tile ${pathname.startsWith("/projects") ? "is-active" : ""}`}
                  onClick={closeModal}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="awrs-tile-label">Projects</span>
                </Link>

                <Link
                  href="/resume"
                  className={`awrs-page-tile ${pathname === "/resume" ? "is-active" : ""}`}
                  onClick={closeModal}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <line x1="9" y1="7" x2="15" y2="7" />
                    <line x1="9" y1="11" x2="13" y2="11" />
                  </svg>
                  <span className="awrs-tile-label">Resume</span>
                </Link>

                <Link
                  href="/lounge"
                  className={`awrs-page-tile ${pathname === "/lounge" ? "is-active" : ""}`}
                  onClick={closeModal}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <line x1="6" y1="12" x2="10" y2="12" />
                    <line x1="8" y1="10" x2="8" y2="14" />
                    <circle cx="15" cy="11" r="1" fill="currentColor" />
                    <circle cx="18" cy="13" r="1" fill="currentColor" />
                  </svg>
                  <span className="awrs-tile-label">Lounge</span>
                </Link>

                <Link
                  href="/#contact"
                  className="awrs-page-tile"
                  onClick={(e) => {
                    closeModal();
                    handleSayHi(e);
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="9" cy="10" r="1" fill="currentColor" />
                    <circle cx="12" cy="10" r="1" fill="currentColor" />
                    <circle cx="15" cy="10" r="1" fill="currentColor" />
                  </svg>
                  <span className="awrs-tile-label">Contact</span>
                </Link>
              </div>
            </div>

            {/* CONNECT Section */}
            <div className="awrs-section awrs-section--connect">
              <p className="awrs-section-label">CONNECT</p>
              <div className="awrs-connect-grid">
                <a
                  href="https://github.com/ParthKhansali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="awrs-connect-tile"
                  onClick={closeModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                  <span className="awrs-tile-ext">↗</span>
                </a>

                <a
                  href="https://linkedin.com/in/parthkhansali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="awrs-connect-tile"
                  onClick={closeModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                  <span className="awrs-tile-ext">↗</span>
                </a>

                <a
                  href="https://x.com/ParthKhansali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="awrs-connect-tile"
                  onClick={closeModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                  <span className="awrs-tile-ext">↗</span>
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="awrs-connect-tile"
                  onClick={(e) => {
                    closeModal();
                    handleSayHi(e);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Email</span>
                  <span className="awrs-tile-ext">↗</span>
                </a>
              </div>
            </div>

            {/* LEGAL Section directly matching awrs.me */}
            <div className="awrs-section awrs-section--legal">
              <p className="awrs-section-label">LEGAL</p>
              <div className="awrs-legal-row">
                <Link
                  href="/privacy"
                  className="awrs-legal-tile"
                  onClick={closeModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Privacy Policy</span>
                </Link>

                <Link
                  href="/terms"
                  className="awrs-legal-tile"
                  onClick={closeModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>Terms of Use</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
