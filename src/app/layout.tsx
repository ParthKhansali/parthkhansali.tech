import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import JsonLd from "@/components/seo/JsonLd";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ParticleBackground from "@/components/ui/ParticleBackground";
import SpotlightCardListener from "@/components/ui/SpotlightCardListener";
import ProjectCursorBadge from "@/components/ui/ProjectCursorBadge";
import { identityGraph } from "@/lib/seo";
import { siteConfig } from "@/data/site";

/*
 * Both faces are self-hosted by next/font, so there is no render-blocking
 * request to fonts.googleapis.com and no layout shift from a late font swap.
 */
/*
 * `optional` on both faces is deliberate. On a throttled phone, swapping a
 * webfont in after first paint repaints the largest paragraph and drags the
 * lab LCP with it. With `optional` the first paint keeps the metric-matched
 * fallback, the real face is cached for every later view, and the page never
 * repaints behind the reader.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
  display: "optional",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#141416",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Parth Khansali: Computer Science Student & Software Developer",
    template: "%s | Parth Khansali",
  },
  description:
    "Parth Khansali is a computer science student in Dehradun, India, and the developer of GEHU Connect, a campus app used by roughly a thousand students.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: { canonical: "/" },
  keywords: [
    "Parth Khansali",
    "ParthKhansali",
    "Parth Khansali developer",
    "Parth Khansali portfolio",
    "GEHU Connect",
    "Netwich",
    "software developer Dehradun",
    "Graphic Era Hill University",
  ],
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Parth Khansali: Computer Science Student & Software Developer",
    description:
      "Developer of GEHU Connect, a campus app used by roughly a thousand students. Netwich, ARANYA and other builds in the open.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Parth Khansali, computer science student and software developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khansali: Computer Science Student & Software Developer",
    description:
      "Developer of GEHU Connect, a campus app used by roughly a thousand students.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icon.png", sizes: "512x512" }],
  },
  manifest: "/manifest.webmanifest",
  // Stop iOS Safari from turning the email address into a phone-style link.
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={jakarta.variable}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={identityGraph()} />
        <ParticleBackground />
        <ScrollProgress />
        <SpotlightCardListener />
        <ProjectCursorBadge />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/*
         * Prefetch the next page on likely navigation. Chrome-only, ignored
         * everywhere else, and cheap: it fetches HTML, it does not boot a
         * renderer, so nothing competes with the current page for main thread.
         */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [{ where: { href_matches: "/*" }, eagerness: "moderate" }],
            }),
          }}
        />
      </body>
    </html>
  );
}
