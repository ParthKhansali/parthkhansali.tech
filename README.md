# Parth Khansali Portfolio

Personal engineering portfolio and interactive visitor lounge built with Next.js App Router, React 19, TypeScript, Cloud Firestore, and static HTML export (`output: "export"`).

**Live Site:** [parthkhansali.tech](https://www.parthkhansali.tech)

## Routes

- **`/`** - Interactive hero with falling ASCII code reveal, About bento grid, Experience scroll timeline, selected project showcase cards, and contact section.
- **`/projects`** & **`/projects/[slug]`** - Project archive and dedicated architecture write-ups for [GEHU Connect](https://www.parthkhansali.tech/projects/gehu-connect), [Netwich](https://www.parthkhansali.tech/projects/netwich), [ARANYA](https://www.parthkhansali.tech/projects/aranya), [ORVESS-PAT](https://www.parthkhansali.tech/projects/orvess-pat), and [Meghavyuha](https://www.parthkhansali.tech/projects/meghavyuha).
- **`/resume`** - Crawlable resume view with print styles and direct PDF download (`/parth_resume.pdf`).
- **`/lounge`** - Visitor pin board (notes and whiteboard sketches via Google Sign-In and Cloud Firestore) plus the CRT workstation (`arcade`, `chat`, `jam`, `cinema`).
- **`/privacy`** & **`/terms`** - Privacy policy and terms of use.

## Technical Stack

- **Framework**: Next.js 16 (App Router, static HTML export)
- **UI**: React 19, TypeScript, custom CSS token system (`src/app/globals.css`) with View Transitions radial dark/light theme switching (`src/components/ui/ThemeToggle.tsx`)
- **Backend Services**: Firebase Authentication (Google provider with popup + redirect fallback) and Cloud Firestore (`lounge_messages`, constrained by `firestore.rules`)
- **SEO & Discovery**: Unified `@graph` JSON-LD (`ProfilePage`, `Person`, `WebSite`, `SoftwareApplication`, `BreadcrumbList`), dynamic 1200x630 OpenGraph image, XML sitemap, `robots.txt`, `manifest.webmanifest`, `/llms.txt`, and `/llms-full.txt`

## Local Development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Verify formatting and static export builds:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Subpath static build check (used for `/parthkhansali.tech` Pages compatibility):

```bash
BASE_PATH=/parthkhansali.tech npm run build
```

## License

Code in this repository is copyright Parth Khansali. Personal bio copy, project screenshots, and resume documents belong to the author.
