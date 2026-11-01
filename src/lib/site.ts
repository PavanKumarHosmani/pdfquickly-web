export const site = {
  name: "PDF Quickly",
  url: "https://pdfquickly.com",
  tagline: "Free online PDF and image tools",
  description:
    "Merge, compress and convert PDFs and images online for free. No sign-up, no watermark, works on any phone or computer.",
  // Shown on the privacy pages and the contact page. Must receive mail (forwarded to the owner's inbox, see OPERATIONS.md).
  contactEmail: "hello@pdfquickly.com",
  /**
   * When page content last really changed. Used for sitemap <lastmod>, which Google and Bing
   * only trust if it's accurate. Bump it (or a page's own `updated`) when you edit copy.
   */
  contentUpdated: "2026-10-30T00:00:00+05:30",
  legalUpdated: "2026-10-29T00:00:00+05:30", // terms
  privacyUpdated: "2026-11-01T00:00:00+05:30", // website privacy policy
  appPolicyUpdated: "2026-11-01T00:00:00+05:30", // Android app privacy policy (/app-privacy)
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.pdfquickly.com/api/v1").replace(/\/$/, ""),
};

export const absoluteUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
