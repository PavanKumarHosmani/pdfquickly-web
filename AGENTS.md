# AGENTS.md — pdfquickly-web

Context for AI coding agents. Read this before changing anything. Human-facing
docs: [README.md](README.md) (local dev, SEO rules, code map) and
[docs/OPERATIONS.md](docs/OPERATIONS.md) (hosting, settings, troubleshooting).

## What this is

pdfquickly.com: a free, SEO-first site of PDF and image tools (merge, compress,
convert, unlock…). This repo is the **website only**. All file processing
happens in a separate backend.

| | |
|---|---|
| Stack | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 |
| Rendering | Every route is **static** (prerendered HTML). The tool UI runs in the browser |
| Hosting | Vercel. Push to `main` = production deploy |
| Canonical URL | `https://pdfquickly.com` (no `www`) |
| API | `https://api.pdfquickly.com/api/v1` |
| Backend repo | `PavanKumarHosmani/File-Converter-backed` (Spring Boot, EC2). It has its own `AGENTS.md` |
| Android app | **PDF Quickly** (`com.softcodeai.pdfquickly`), same brand and backend. This site hosts its privacy policy and `app-ads.txt` |

## Commands

```bash
npm install
npm run dev          # http://localhost:3000, works against the live API
npm run build        # the only automated check: must pass, and every route must be ○ or ● (static)
npm run indexnow     # tell Bing/IndexNow about all sitemap URLs (network call to api.indexnow.org)
```

There are no tests and no lint script. Verify changes with `npm run build`, then
check the behaviour in the browser.

## System in one picture

```
Browser ──pages──────────────▶ Vercel (this repo, static)
Browser ──JSON API───────────▶ api.pdfquickly.com: Nginx (HTTPS) → Spring Boot :8080 on EC2
Browser ──PUT/GET files──────▶ S3 bucket processingfilesbucket (ap-south-1), via presigned URLs
Spring Boot ──IAM role───────▶ S3 (reads inputs, writes results)
```

Files never pass through the API server. Each tool run (`src/lib/runner.ts`):

1. `POST {API}/<uploadPath>` with `{ fileCount }` → `{ operationId, uploadUrls: [{ fileKey, url | uploadUrl }] }`
2. `PUT` each file to its presigned S3 URL (three at a time; one failure aborts the rest)
3. `POST {API}/<startPath>` with the body below → `{ downloadUrl }` or `{ error }`. Synchronous: the request stays open while the server converts
4. `GET downloadUrl` (S3). If the browser can't fetch it (network/CORS), the link is offered directly instead

## API contract used by this site

Engine ids are in `src/lib/engines.ts`; paths are relative to `{API}` = `site.apiBaseUrl`.

| Engine | Upload path | Start path | Start body (besides `operationId`) | Limits |
|---|---|---|---|---|
| `imageToPdf` | `upload-urls` | `convert/start` | `fileKeys: string[]` | 1–20 images, 25 MB each |
| `mergePdf` | `pdf/upload-urls` | `pdf/merge/start` | `fileKeys: string[]` | 2–20 PDFs, 50 MB each |
| `compressPdf` | `pdf/compress/upload-urls` | `pdf/compress/start` | `fileKey`, `compressionLevel: "SCREEN" \| "EBOOK" \| "PRINTER"` | 1 PDF, 50 MB |
| `pdfToJpg` | `pdf-to-jpg/upload-urls` | `pdf/to-jpg/start` | `fileKey` → returns a ZIP | 1 PDF, 50 MB |
| `unlockPdf` | `pdf-to-jpg/upload-urls` | `pdf/unlock/start` | `fileKey`, `password` | 1 PDF, 50 MB |
| `compressImage` | `image/upload-urls` | `image/compress/start` | `fileKey`, `targetSizeKb: number` | 1 image, 25 MB |
| `convertImage` | `image/upload-urls` | `image/convert/start` | `fileKey`, `targetFormat: "jpg" \| "png"`, `quality` (null for png) | 1 image, 25 MB |

The backend **enforces** these limits too (`RequestGuards`: max 20 files, 25 MB
images, 50 MB PDFs, and `fileKey` must belong to `operationId`). If you change a
limit in `engines.ts`, change the backend first or users get server errors.

Errors: the backend returns `{ "error": "message" }` with 400 for bad input and
500 otherwise. `readError` in `runner.ts` turns them into user-facing text.

## Code map

```
src/app/[slug]/page.tsx          every tool page; dynamicParams = false + generateStaticParams
src/app/[slug]/opengraph-image.tsx  per-tool share image (also static)
src/app/page.tsx                 home
src/app/{about,privacy,terms,contact}  text pages
src/app/app-privacy/page.tsx     Android app privacy policy: the URL in Play Console and the app menu. Keep it in step with
                                 the app and the Play Data safety form (ads, data collected), or Play can reject the app
src/app/app-ads.txt/route.ts     AdMob app-ads.txt from ADMOB_PUBLISHER_ID; 404 until set. Must stay at the site root
src/app/{sitemap,robots,manifest}.ts   generated from content + site.ts
src/content/tools.ts             ALL tool page content: slug, engine, copy, FAQs, presets, related
src/lib/site.ts                  site name, canonical URL, apiBaseUrl, content dates
src/lib/engines.ts               engine ids, limits, accepted types, options, validate()
src/lib/runner.ts                the backend/S3 flow above
src/lib/schema.ts                JSON-LD (WebApplication, FAQPage, BreadcrumbList)
src/components/tool/ToolRunner.tsx  drop zone → files → options → progress → result (client component)
public/ad0747afef834b76ab11f31fe71da6f0.txt  IndexNow key file — never delete or rename
scripts/indexnow.mjs             IndexNow submitter
.github/workflows/indexnow.yml   runs it after each successful Vercel production deploy
next.config.ts                   security headers; 308 redirect www → apex
```

## Common tasks

**Add a tool page that reuses an existing engine** (e.g. a new preset): add an
entry to `src/content/tools.ts`. Routes, sitemap, footer and OG image pick it up
automatically. Meet the SEO rules below.

**Add a new engine**: needs a backend endpoint first. Then add the id and limits
to `engines.ts`, a `case` in `runTool` (`runner.ts`), any options in
`OptionsPanel.tsx`, and pages in `tools.ts`. The `switch` is exhaustive, so
TypeScript flags a missing case.

**Change the API address**: set `NEXT_PUBLIC_API_BASE_URL` in Vercel (or change
the default in `site.ts`) and redeploy. The value is inlined at build time.

## Rules — do not break these

1. **Stay static.** No request-time data, cookies, or server-only rendering on
   pages. `npm run build` must show every route as ○ or ●.
2. **Canonical host is `https://pdfquickly.com`.** Don't change `site.url` to
   `www`. Vercel must redirect `www` → apex, never the reverse: `next.config.ts`
   redirects www → apex, so the reverse makes an infinite redirect loop.
3. **SEO content rules** (the site depends on search traffic; details in README):
   - `title` ≤ 60 chars, `description` ≤ 160, unique per page.
   - Each page needs genuinely different copy and FAQs; no near-duplicate
     "doorway" pages (e.g. don't add a 30 KB page next to 20 and 50 KB).
   - JSON-LD must only describe visible content. No ratings or reviews, no `HowTo`.
   - When you change a page's copy, set its `updated` (or bump
     `site.contentUpdated`). `lastmod` must be truthful.
4. **Don't make claims the system doesn't keep.** The website shows no ads; only the
   Android app does (AdMob). Keep `/privacy` and `/app-privacy` saying so. The privacy copy says files
   are deleted within 24 hours. That depends on an S3 lifecycle rule (see
   OPERATIONS.md open items). Don't add promises like "files never leave your
   device" — they do.
5. **No secrets in this repo.** Everything here is public. `NEXT_PUBLIC_*`
   values end up in the browser bundle, and Vercel refuses to mark them Sensitive.
6. **React state:** no side effects inside `setState` updater functions (they can
   run twice or late); compute first, then set. Revoke every `URL.createObjectURL`
   (previews and results) when replaced or on unmount.
7. **Keep the IndexNow key file**; its name must equal the key in `scripts/indexnow.mjs`.

## Things that can't be done from code

These need a human in a web console. Say so instead of trying to work around it:

| Change | Where |
|---|---|
| Allow a new website origin for uploads | S3 → `processingfilesbucket` → Permissions → CORS (**and** backend `app.cors.allowed-origins`) |
| Environment variables, domains, redeploys | Vercel project `pdfquickly-web` |
| DNS records (`api` A record, Google TXT) | pdfquickly.com DNS provider |
| S3 permissions for the server | IAM role `img2pdf-ec2-role` |
| Search Console / Bing Webmaster | Google and Bing web UIs |

## Backend facts that affect this repo

- Pushing or merging to the backend's `main` **deploys to production**. Use a
  branch and a pull request; let the owner merge.
- The backend's CORS list (`app.cors.allowed-origins` in
  `application.properties`) must include `https://pdfquickly.com` and
  `https://www.pdfquickly.com`; `http://localhost:3000` is there for local dev.
- `GET {API}/health` reports the running build: `maxDimension` 2600,
  `webpAvailable` true, `awsKeysInEnvironment` false when healthy.
- The S3 bucket CORS separately allows `GET`, `PUT`, `HEAD` from
  pdfquickly.com and localhost:3000.

## History worth knowing

- 2026-10: the API moved from `api.jpgstopdf.com` (domain expired) to
  `api.pdfquickly.com`. jpgstopdf.com and pdfsmerger.com are retired; any
  reference to them is stale.
- Symptoms seen in production and their causes are in the troubleshooting table
  in [docs/OPERATIONS.md](docs/OPERATIONS.md#troubleshooting). Check it first:
  "Couldn't reach the server" has had three different causes.

## Git

- `main` deploys to production on Vercel. Commit messages: short imperative
  subject, body explains why.
- Don't commit `.env*.local`, `.next`, `node_modules` (already in `.gitignore`).
