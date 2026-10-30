import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ToolIndex } from "@/components/ToolIndex";
import { tools } from "@/content/tools";
import { websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} – Free Online PDF and Image Tools` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: `${site.name} – Free Online PDF and Image Tools`, description: site.description },
};

const promises = [
  {
    title: "Free, with nothing added",
    text: "Every tool is free to use. No sign-up, no watermark on your files and no limit on how many times you use them.",
  },
  {
    title: "Works on your phone",
    text: "Use it in any browser on Android, iPhone, Windows, Mac or Linux. Nothing to install.",
  },
  {
    title: "Your files are deleted",
    text: "Files are sent over an encrypted connection, processed, and deleted automatically within 24 hours.",
  },
];

const keywordPages = tools.filter((t) => !t.primary);

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema()} />

      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20">
        <h1 className="display max-w-[16ch] text-[2.75rem] sm:text-6xl lg:text-7xl">PDF and image tools that just work</h1>
        <p className="mt-6 max-w-[52ch] text-lg text-ink-soft sm:text-xl">
          Merge, compress and convert PDFs and photos in your browser. Pick a tool, add your file, download the result.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/jpg-to-pdf" className="btn btn-mark min-h-14 px-7 text-lg">
            JPG to PDF
          </Link>
          <Link href="/compress-pdf" className="btn btn-primary min-h-14 px-7 text-lg">
            Compress PDF
          </Link>
          <Link href="/compress-image" className="btn btn-ghost min-h-14 px-7 text-lg">
            Compress Image
          </Link>
        </div>
      </section>

      <section id="tools" aria-label="All tools" className="mx-auto max-w-6xl scroll-mt-6 px-4 sm:px-6">
        <ToolIndex />
      </section>

      <section aria-labelledby="popular" className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <h2 id="popular" className="heading text-2xl">
          Popular shortcuts
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {keywordPages.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}`} className="chip inline-flex items-center hover:border-ink">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="why" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h2 id="why" className="display text-3xl sm:text-4xl">
          Made for getting things done
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {promises.map((p) => (
            <div key={p.title} className="border-t-[3px] border-ink pt-4">
              <h3 className="heading text-xl">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
