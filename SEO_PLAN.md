# Parth Khansali Portfolio SEO Plan

**Prepared:** 24 October 2026  
**Primary domain assumed by the app:** `https://parthkhansali.com`  
**Positioning:** Parth Khansali — AI and software engineering student in Dehradun building useful systems with personality.

This is a practical SEO plan for the portfolio as it exists today. It is intentionally honest: the site should make Parth's real work easier to understand and discover, not manufacture authority or claim results that have not been verified.

## What was implemented in this pass

- Repositioned the primary metadata around **AI & software engineering in Dehradun** instead of a generic “developer portfolio” phrase.
- Added a more accurate Person entity description, location, `sameAs` profiles, and `knowsAbout` fields in JSON-LD.
- Switched social sharing imagery to the existing pixel-art developer workspace banner, which fits the brand and its 16:9 shape better than the square profile photo.
- Added a cached Next.js Web Manifest at `/manifest.webmanifest`.
- Made the sitemap `lastModified` date deterministic instead of changing on every build.
- Added visible, crawlable copy explaining Parth's working method in a new **A note from the workbench** section.
- Added clearer semantic section labels and more descriptive headings on the home, projects, and resume pages.

## Search positioning

### Primary entity

Use the same identity everywhere:

- **Name:** Parth Khansali
- **Descriptor:** AI & software engineer / Computer Science student
- **Location:** Dehradun, Uttarakhand, India
- **Education:** Graphic Era Hill University
- **Proof links:** GitHub, LinkedIn, GEHU Connect, resume, and verifiable project notes

### Keyword themes

Do not repeat these mechanically. Use them naturally in page titles, headings, project descriptions, image alt text, and anchor text where they are genuinely relevant.

| Intent | Target phrases | Best page |
| --- | --- | --- |
| Name discovery | Parth Khansali, Parth Khansali developer, Parth Khansali Dehradun | Home / About content |
| Career discovery | AI software engineer Dehradun, software engineering student India, computer science student Dehradun | Home / Resume |
| Project discovery | GEHU Connect, OmniMentor adaptive AI, ForgeFlow workflow automation, ARANYA geospatial records | Projects |
| Technical discovery | React Native Spring Boot project, Kafka recruitment platform, BM25 resume search engine, optical tracking simulation Python | Project detail pages / build notes |
| Collaboration | AI engineering intern Dehradun, student software engineer for research collaboration | Home / Contact |

The strongest near-term opportunity is **entity disambiguation**: build a consistent web of first-party pages and trusted profiles around the exact name “Parth Khansali”. Search engines and AI systems can then connect the name to the same person, location, education, projects, and links.

## Information architecture to build next

The current `/`, `/projects`, and `/resume` routes are a solid foundation. The next high-value improvement is to turn the best work into durable, independently useful pages rather than keeping every project as a card only.

### Priority project pages

1. `/projects/gehu-connect`
   - Problem: fragmented university communication.
   - Role: what Parth personally designed and implemented.
   - Architecture: React Native, Expo, Spring Boot, JWT auth, Cloudflare R2.
   - Evidence: current alpha status, screenshots, deployment link, limitations.
2. `/projects/omnimentor`
   - Problem: adaptive learning rather than disconnected AI explanations.
   - Architecture: learner state, representation planning, evidence bundle, adaptive loop.
   - Evidence status: clearly label proposed, prototyped, and validated pieces separately.
3. `/projects/forgeflow`
   - Problem: repetitive file and terminal workflows.
   - Include a short before/after workflow and a reproducible example.
4. `/projects/orvess-pat`
   - Problem: optical observation quality under noise.
   - Include the research question, simulation setup, metrics, and what remains incomplete.

Each page should have one descriptive `<h1>`, a short original summary, a visible “my contribution” section, a technical architecture section, links to evidence, and a concise “what I would improve next” section. This is better for users and for search than generating many thin pages.

## 90-day execution plan

### Days 1–7: establish the baseline

- Verify `parthkhansali.com` ownership in Google Search Console and Bing Webmaster Tools.
- Add both the root and `www` host variants if both resolve; choose one canonical host and redirect the other.
- Submit `/sitemap.xml` in Search Console.
- Inspect `/`, `/projects`, and `/resume` with URL Inspection.
- Record baseline queries, impressions, clicks, average position, indexed pages, and Core Web Vitals.
- Run Lighthouse or PageSpeed Insights on mobile and desktop. Record LCP, INP, CLS, total blocking time, and the largest assets.
- Verify that the production domain returns the same canonical URLs used in metadata and sitemap.

### Days 8–30: make the core pages excellent

- Finish the home page copy so the first screen says who Parth is, where he is based, what he builds, and what he is open to.
- Add the first two project detail pages, starting with GEHU Connect and OmniMentor.
- Add real screenshots or short captions where they explain the work; use descriptive alt text.
- Replace any unsupported performance or user-count claim with an evidence link or a clearly labelled estimate.
- Add a small “build notes” area to each project instead of a generic list of technologies.
- Make internal links descriptive: “Read the GEHU Connect architecture” is better than “click here”.

### Days 31–60: build authority around the entity

- Make the name, location, education, and role consistent across GitHub, LinkedIn, the resume PDF, project pages, and public profiles.
- Pin the strongest repositories on GitHub and update their README files with the same project summaries used on the site.
- Link from each public project profile back to its canonical portfolio page when appropriate.
- Publish two original technical notes:
  - “What I learned building a student community app with React Native and Spring Boot”
  - “Classical baselines vs learned verifiers: how I would run a fair comparison”
- Share the notes through LinkedIn and relevant developer communities without mass-posting or buying links.

### Days 61–90: measure, refine, and compound

- Compare Search Console data with the day-7 baseline.
- Improve pages with high impressions but low clicks by testing clearer title and description copy.
- Improve pages with clicks but low engagement by tightening the opening paragraph and adding a clear next action.
- Fix crawl, indexing, structured-data, and Core Web Vitals issues surfaced by the tools.
- Update the sitemap `lastModified` only when the human-edited page content really changes.
- Keep a monthly changelog of new projects, experiments, results, and links.

## Technical checklist

### Crawlability and indexing

- [x] `robots.txt` allows public pages and advertises the sitemap.
- [x] `sitemap.xml` includes the main public routes.
- [x] Canonical URLs are declared for home, projects, and resume.
- [x] Main portfolio content is present in server-rendered HTML; interactive features enhance it rather than holding all meaning behind JavaScript.
- [ ] Add canonical detail URLs as project pages are created.
- [ ] Verify production status codes, redirects, and the preferred host in Search Console.

### Metadata and sharing

- [x] Unique global title and description.
- [x] Page-level metadata for projects and resume.
- [x] Open Graph and Twitter metadata.
- [x] A correctly shaped social preview image based on the developer-night banner.
- [x] Manifest and theme color.
- [ ] Add route-specific OG images when project detail pages exist.
- [ ] Add a visible author/date treatment to technical notes so the content has clear ownership and freshness.

### Structured data

- [x] `Person` entity with name, URL, location, education, social profiles, and areas of knowledge.
- [x] `WebSite` entity.
- [x] `SoftwareApplication` entity for GEHU Connect.
- [x] Project microdata is present on the project collection.
- [ ] Add `ProfilePage` markup to a dedicated About page if one is created.
- [ ] Add `SoftwareSourceCode` or `SoftwareApplication` JSON-LD on each project detail page only when the visible page content supports it.
- [ ] Validate JSON-LD in Rich Results Test and Schema Markup Validator after deployment.

Structured data should describe visible, truthful content. It is not a guarantee of a rich result or higher rankings.

### Performance and accessibility

- [ ] Keep the hero’s first meaningful content fast; consider lazy-loading nonessential interactive effects below the fold.
- [ ] Check whether the full-screen starfield, cursor, smooth scrolling, video loops, and arcade code are worth their mobile cost.
- [ ] Respect reduced motion, which the global CSS already begins to do.
- [ ] Add explicit dimensions or stable aspect ratios to every visual media block.
- [ ] Keep headings in a logical order and make every interactive control keyboard reachable.
- [ ] Test at 320px, 375px, 768px, and desktop widths.
- [ ] Use real-user Core Web Vitals from Search Console after enough traffic exists; do not treat a single lab score as the whole picture.

Google's current Core Web Vitals guidance uses LCP, INP, and CLS as the key field metrics, with “good” targets of LCP within 2.5 seconds, INP under 200ms, and CLS under 0.1. Treat these as targets, not promises.

## Content system that fits Parth

The portfolio should sound like a thoughtful builder, not a keyword landing page. Use a repeatable “workbench note” format:

1. **The irritation** — what felt needlessly difficult?
2. **The bet** — what did Parth think might work?
3. **The build** — architecture, trade-offs, and the first version.
4. **The evidence** — demo, benchmark, user feedback, or an honest incomplete status.
5. **The next cut** — what would be improved with more time?

Recommended topics:

- How a student community platform handles media uploads with Cloudflare R2.
- Designing an adaptive learning system without pretending signals prove understanding.
- What a BM25 resume search engine teaches about ranking and relevance.
- From MUN logistics to distributed systems: coordinating moving parts under pressure.
- Building a portfolio that explains the engineering, not just the stack.

Every article should be original, genuinely useful, internally linked to a project, and reviewed for accuracy before publishing.

## Measurement dashboard

Track these monthly:

- Branded impressions and clicks for “Parth Khansali”.
- Non-branded impressions for “AI software engineer Dehradun” and related queries.
- Indexed pages and excluded pages.
- Click-through rate for home, project, and resume pages.
- Top landing pages and search queries.
- Core Web Vitals status.
- GitHub profile clicks and project-demo clicks from the portfolio.
- Qualified contact actions: email clicks, LinkedIn clicks, and resume downloads.

Do not use search rank for one query as the only success metric. The real outcome is that the right person can find Parth, understand what he has actually built, and verify it quickly.

## Things not to do

- Do not publish dozens of AI-generated pages with thin or repetitive content.
- Do not stuff “Dehradun”, “AI”, or “software engineer” into every paragraph.
- Do not claim “1,800+ users”, benchmark numbers, or production usage unless the claim can be verified and kept current.
- Do not buy backlinks, exchange links at scale, or automate search queries.
- Do not hide keyword text or make search engines see a materially different page from users.
- Do not promise that SEO will make Parth the first result for every search.

## Official references

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Profile Page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google general structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js metadata file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
