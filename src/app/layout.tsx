import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/navigation/Navbar";
import StarfieldCanvas from "@/components/effects/StarfieldCanvas";
import CursorSpotlight from "@/components/effects/CursorSpotlight";
import CursorAssistant from "@/components/assistant/CursorAssistant";
import CommandPalette from "@/components/navigation/CommandPalette";
import ResumeModal from "@/components/resume/ResumeModal";
import LiveReviewCelebration from "@/components/effects/LiveReviewCelebration";
import RetroArcadeModal from "@/components/effects/RetroArcadeModal";
import AnimeScrollHUD from "@/components/effects/AnimeScrollHUD";
import ScrollDots from "@/components/effects/ScrollDots";
import { asset } from "@/lib/basepath";
import { absoluteUrl, siteConfig } from "@/data/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#14120f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Parth Khansali | AI & Software Engineer in Dehradun",
    template: "%s | Parth Khansali",
  },
  description:
    "Parth Khansali is an AI and software engineering student in Dehradun building adaptive AI systems, mobile products, distributed workflows, and thoughtful developer tools.",
  keywords: [
    "Parth Khansali",
    "AI engineer",
    "software engineer in Dehradun",
    "software developer in India",
    "full stack developer",
    "Next.js",
    "React Native",
    "Spring Boot",
    "Python",
    "AI systems",
    "Graphic Era Hill University",
    "Graphic Era MUN",
    "GEHU Connect",
    "OmniMentor",
    "developer portfolio",
  ],
  authors: [{ name: "Parth Khansali", url: siteConfig.url }],
  creator: "Parth Khansali",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "Parth Khansali",
    title: "Parth Khansali | AI & Software Engineer in Dehradun",
    description:
      "I build things I wish already existed: adaptive AI systems, mobile products, and useful software with a human edge.",
    images: [
      {
        url: "/developer-night-banner.jpg",
        width: 1376,
        height: 768,
        alt: "A pixel-art developer workspace overlooking the Doon Valley at night",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khansali | AI & Software Engineer in Dehradun",
    description:
      "I build things I wish already existed: adaptive AI systems, mobile products, and useful software with a human edge.",
    images: ["/developer-night-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: asset("/icon.png"),
    apple: asset("/icon.png"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
       "@id": `${siteConfig.url}/#person`,
      name: "Parth Khansali",
      alternateName: "ParthKhansali",
       url: siteConfig.url,
      image: [
         absoluteUrl("/profile.jpg"),
         absoluteUrl("/developer-night-banner.jpg"),
      ],
      jobTitle: "AI & Software Engineer",
      description:
        "Computer Science student and independent builder focused on AI systems, full-stack products, distributed workflows, and research-minded engineering.",
      homeLocation: {
        "@type": "Place",
        name: "Dehradun, Uttarakhand, India",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Graphic Era Hill University",
      },
       sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.instagram],
      mainEntityOfPage: {
         "@id": `${siteConfig.url}/#profile`,
      },
      knowsAbout: [
        "Artificial intelligence",
        "Software engineering",
        "Adaptive learning systems",
        "Distributed systems",
        "React Native",
        "Spring Boot",
        "Next.js",
        "Python",
      ],
    },
    {
      "@type": "ProfilePage",
       "@id": `${siteConfig.url}/#profile`,
       url: siteConfig.url,
      name: "Parth Khansali — AI & Software Engineer",
      dateModified: "2026-10-24",
      mainEntity: {
        "@id": `${siteConfig.url}/#person`,
      },
    },
    {
      "@type": "WebSite",
       "@id": `${siteConfig.url}/#website`,
       url: siteConfig.url,
      name: "Parth Khansali Portfolio",
      description: "Portfolio of Parth Khansali: Developer, Builder, Problem Solver",
      publisher: {
         "@id": `${siteConfig.url}/#person`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://gehuconnect.in/#app",
      name: "GEHU Connect",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "iOS, Android, React Native",
      author: {
         "@id": `${siteConfig.url}/#person`,
      },
      description:
        "Student community and networking platform built with React Native and Spring Boot for Graphic Era Hill University students.",
      url: "https://gehuconnect.in",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0f0f0d] text-[#f0ece4] selection:bg-[#d4a843]/25 selection:text-white">

        {/* Global Twinkling Starfield Canvas Background */}
        <StarfieldCanvas />

        {/* Radial Mouse Torchlight Spotlight */}
        <CursorSpotlight />

        {/* Interactive Cursor-Following Oneko Cat Assistant */}
        <CursorAssistant />

        {/* Global Search Command Palette (⌘K) */}
        <CommandPalette />

        {/* Lenis Smooth Scroll Wrapper */}
        <SmoothScroll>
          <AnimeScrollHUD />
          <ScrollDots />
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>

        {/* Global Resume Preview & Download Modal mounted at body bottom */}
        <ResumeModal />

        {/* Real-time Guestbook Review Celebration & Live Wave Easter Egg Toast */}
        <LiveReviewCelebration />

        {/* Playable Retro Arcade Easter Egg (Nether Dash) */}
        <RetroArcadeModal />
      </body>
    </html>
  );
}
