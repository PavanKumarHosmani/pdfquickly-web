# pdfquickly.com

SEO-first website for the File-Converter backend. Next.js 16 (App Router), TypeScript, Tailwind CSS 4.
Every page is prerendered as static HTML; the tool itself runs in the browser and calls the backend.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; every route should show ○ or ● (static)
```

`http://localhost:3000` is in the backend and S3 CORS lists, so local dev works against the live API.

## Running in production

The site is live on Vercel at **pdfquickly.com** and calls the API at **api.pdfquickly.com**
(Spring Boot on EC2, files in S3). Push to `main` and Vercel publishes it.

How it all fits together, every setting, deploying the API, and a troubleshooting table
are in **[docs/OPERATIONS.md](docs/OPERATIONS.md)**. Two things that are easy to get wrong:

- A new website address must be added to the backend's CORS list **and** the S3 bucket's CORS list,
  because the browser uploads and downloads files straight from S3.
- In Vercel, `pdfquickly.com` is the production domain and `www` redirects to it. The reverse
  makes a redirect loop with `next.config.ts`.

## After launch: get indexed

**Google Search Console**
1. Add a *Domain* property for `pdfquickly.com` and verify it with the DNS TXT record Google gives you.
   (Or use the HTML-tag method: put the code in a Vercel env var `GOOGLE_SITE_VERIFICATION` and redeploy.)
2. Sitemaps → submit `https://pdfquickly.com/sitemap.xml`.
3. URL Inspection → Request indexing for the home page and the main tools.

**Bing Webmaster Tools**
1. Sign in at bing.com/webmasters and choose *Import from Google Search Console* (fastest),
   or add the site and verify with DNS or `BING_SITE_VERIFICATION` (the `msvalidate.01` code).
2. Sitemaps → submit `https://pdfquickly.com/sitemap.xml`.
3. IndexNow is already set up (below). After the first deploy, run `npm run indexnow` once.

**IndexNow (Bing, Yandex, Seznam, Naver)**
- `public/ad0747afef834b76ab11f31fe71da6f0.txt` is the key file that proves you own the site. Don't delete it.
- `.github/workflows/indexnow.yml` pings IndexNow after every successful Vercel production deploy.
- Manually: `npm run indexnow` (all URLs) or `npm run indexnow -- /merge-pdf` (one page).

## Search engine guidelines: what this site does

Checked against Google Search Essentials (including its spam policies) and the Bing Webmaster Guidelines.

| Requirement | How it's met |
|---|---|
| Crawlable, indexable pages | Static HTML with status 200; robots.txt allows everything, including `/_next/` assets needed for rendering |
| One URL per page | Self-referencing canonical on every page; `www` → bare domain and trailing slash → no slash, both 308 |
| Accurate sitemap | Only canonical URLs; `lastmod` is when content really changed (`site.contentUpdated` or a page's `updated`). No `changefreq`/`priority`, which both engines ignore |
| Unique titles and descriptions | Every page has its own; titles ≤ 60 characters, descriptions ≤ 160 |
| No doorway or scaled content | Each shortcut page (20 KB, PNG to JPG, …) has hand-written copy and FAQs for its own use case, sits under its main tool in a visible breadcrumb, and has a working tool. Text overlap between any two pages is ≤ 52% |
| No hidden text or keyword stuffing | FAQ answers are in `<details>` (allowed by Google); no off-screen or same-colour text; links and copy are written for people |
| Structured data matches the page | `WebApplication`, `FAQPage` and `BreadcrumbList` only describe what's visible; no invented ratings or reviews. `HowTo` is not used (retired by Google) |
| Real functionality | Every tool page does what it says. Google lists "PDF merging" sites that lead to ads as misleading functionality |
| Mobile-friendly, fast, HTTPS | Responsive layout, static pages, self-hosted font, no trackers; Vercel serves HTTPS |
| Correct errors | Unknown URLs return a real 404 |

**Keep it that way when you add pages:**
- Don't add a shortcut page unless you can write content for it that's actually different. "Compress to 30 KB" next to 20 and 50 KB would be a doorway page.
- Never mark up content that isn't shown on the page, or add star ratings you don't have.
- When you change a page's text, update its `updated` date (or `site.contentUpdated`).
- Make sure the claims stay true, e.g. "deleted within 24 hours" needs the S3 lifecycle rule.

FAQ rich results no longer appear in Google (ended May 2026), but Google still reads `FAQPage` markup to understand pages, and Bing uses it too, so it stays.

## Adding a tool page

All page content lives in `src/content/tools.ts`. Add an entry with a new `slug` that reuses an existing `engine`
and, optionally, `presets`. It is picked up automatically by the routes, sitemap, footer and share images.

## Code map

```
src/
├── app/
│   ├── page.tsx                  Home
│   ├── [slug]/page.tsx           Every tool page (static, from content/tools.ts)
│   ├── [slug]/opengraph-image.tsx  Share image per tool
│   ├── about, privacy, terms, contact
│   └── sitemap.ts, robots.ts, manifest.ts, icon.svg
├── components/tool/
│   ├── ToolRunner.tsx            Drop zone → files → options → progress → result
│   ├── OptionsPanel.tsx          Per-tool settings
│   └── PickedFiles, ProgressPanel, ResultPanel
├── content/tools.ts              Page copy, FAQs, presets, related links
└── lib/
    ├── engines.ts                Limits and validation per tool
    ├── runner.ts                 Backend calls: upload-urls → S3 PUT → start → download
    └── schema.ts                 JSON-LD
```

## Legal pages

`privacy` and `terms` are plain-language starting points. Have them checked before launch, and change
`contactEmail` in `src/lib/site.ts` to a mailbox you read.
