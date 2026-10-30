import { toolBySlug, tools } from "@/content/tools";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "PDF Quickly tool";
export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolBySlug.get(slug);
  return ogImage(tool?.h1 ?? "PDF Quickly", tool?.lead ?? "Free online PDF and image tools");
}
