// schema.org JSON-LD builders. Every value here must match what the page visibly shows
// (Google and Bing both treat mismatched markup as spam). No invented ratings or reviews.
// HowTo is left out on purpose: Google retired it, and the steps are already plain HTML.

import type { ToolPage } from "@/content/tools";
import { absoluteUrl, site } from "./site";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        // Google needs a raster logo of at least 112×112 px.
        logo: absoluteUrl("/apple-icon.png"),
        email: site.contactEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };
}

/** `parent` is the main tool a shortcut page sits under, matching the visible breadcrumb. */
export function toolSchema(tool: ToolPage, parent?: ToolPage) {
  const url = absoluteUrl(`/${tool.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: `${tool.name} – ${site.name}`,
        url,
        description: tool.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        ...(parent ? [{ name: parent.name, path: `/${parent.slug}` }] : []),
        { name: tool.name, path: `/${tool.slug}` },
      ]),
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
