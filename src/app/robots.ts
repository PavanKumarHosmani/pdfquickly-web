import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Everything is crawlable, including /_next/ scripts and styles: Google and Bing
// both need them to render the page the way people see it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
