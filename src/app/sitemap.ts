import type { MetadataRoute } from "next";
import { tools } from "@/content/tools";
import { absoluteUrl, site } from "@/lib/site";

// Only canonical, indexable URLs, each with the date its content really changed.
// changefreq and priority are left out: Google and Bing both ignore them.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: site.contentUpdated },
    ...tools.map((t) => ({ url: absoluteUrl(`/${t.slug}`), lastModified: t.updated ?? site.contentUpdated })),
    { url: absoluteUrl("/about"), lastModified: site.contentUpdated },
    { url: absoluteUrl("/contact"), lastModified: site.contentUpdated },
    { url: absoluteUrl("/privacy"), lastModified: site.privacyUpdated },
    { url: absoluteUrl("/app-privacy"), lastModified: site.appPolicyUpdated },
    { url: absoluteUrl("/terms"), lastModified: site.legalUpdated },
  ];
}
