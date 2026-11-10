# Project Context: Parth Khansali Portfolio

A technical portfolio and interactive visitor lounge built with Next.js App Router, React 19, TypeScript, and Cloud Firestore.

## Architecture

- **Framework**: Next.js 16 (App Router) with static HTML export (`output: "export"`).
- **Styling**: Vanilla CSS tokens in `src/app/globals.css`. Strict near-black cyber-palette with electric emerald (`#00ef4e`) and cyan (`#00cbf0`) accents.
- **Typography**: Plus Jakarta Sans (`--font-display`, `--font-body`) and JetBrains Mono (`--font-mono`).
- **Deployments**:
  - **GitHub Pages**: `https://parthkhansali.github.io/parthkhansali.tech/` (automated via `.github/workflows/deploy.yml` with `BASE_PATH=/parthkhansali.tech` and `withBasePath` helper in `src/data/site.ts`).
  - **Production Custom Domain**: `https://parthkhansali.tech` (Vercel deployment).
- **Theme & UI**:
  - Full Light and Dark modes (`html.dark` / `html:not(.dark)`) with View Transitions feathered radial wave toggle (`src/components/ui/ThemeToggle.tsx`).
  - Consistent monochrome stroke SVG icon set (`src/components/ui/Icons.tsx`).
  - Custom vertical side scrollbar (`ScrollProgress`), with native browser scrollbars hidden.

## Key Routes & Features

- `/` (`src/app/page.tsx`):
  - Hero with organic falling ASCII code rain and smooth cosine falloff.
  - Floating pill navigation with active sliding indicator.
  - Interactive Project Showcase stack with embedded live preview frames and custom circular cursor badge (`OPEN TO EXPLORE`).
  - Centered Experience Timeline with scroll-driven progression line and glowing head.
  - Bento About grid with live IST clock and counted metrics.
  - Connect section with magnetic reach-out actions.
- `/projects` (`src/app/projects/page.tsx`): Index of all 5 builds.
- `/projects/[slug]` (`src/app/projects/[slug]/page.tsx`): Dedicated deep-dive folio for each project (GEHU Connect, Netwich, ARANYA, ORVESS-PAT, Meghavyuha).
- `/resume` (`src/app/resume/page.tsx`): Crawlable engineering CV with unified PDF preview, print, and download modal (`ResumeModalTrigger` + `/parth_resume.pdf`).
- `/lounge` (`src/app/lounge/page.tsx`):
  - **The Visitor Board**: 3-column corkboard masonry gallery of visitor notes and whiteboard sketches, with scotch tape accents, organic tilts, and heart counters.
  - **Pin Modal**: Tabbed drawer for writing notes and drawing on an interactive canvas, integrated with Google Sign-in.
  - **Retro CRT Cyber Workstation**: Beveled CRT monitor with scanlines, curvature, and physical controls (power toggle with green LED, VHF dial knob, degauss button) housing 4 interactive apps: `arcade.exe` (Snake, Pong, Reflex), `live_chat.net`, `jam_beats.wav`, and `cinema_feed.mp4`.
- `/wall`: Automatically redirects to `/lounge`.
- `/privacy` & `/terms`: Accessible legal policies matching modern web standards.

## Database & Services

- **Firebase Auth & Firestore**:
  - Project: `portfolio-2addd`
  - Collection: `lounge_messages` (read by anyone, created by authenticated Google users, validated by `firestore.rules`).
  - Client Config & Singleton: `src/lib/firebaseConfig.ts`, `src/lib/firebase.ts`.
  - Authentication & LocalStorage Sync: `src/lib/lounge.ts` (Google popup sign-in with redirect fallback via `completeGoogleRedirect`).
  - Security Headers: `vercel.json` uses `Cross-Origin-Opener-Policy: same-origin-allow-popups` so Firebase OAuth popups communicate cleanly on `parthkhansali.tech`.

## SEO & AI Discoverability

- Fully crawlable static HTML for every route.
- JSON-LD Schema.org graphs (`Person`, `WebSite`, `ProfilePage`, `SoftwareApplication`, `BreadcrumbList`).
- Dynamic 1200x630 OpenGraph and Twitter cards (`src/app/opengraph-image.tsx`).
- Automatic XML Sitemap (`src/app/sitemap.ts`) and Robots (`src/app/robots.ts`).
- AI Agent discovery endpoints: `/llms.txt` and `/llms-full.txt`.

