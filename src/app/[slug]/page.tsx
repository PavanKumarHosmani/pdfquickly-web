import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ToolRunner } from "@/components/tool/ToolRunner";
import { keywordPagesFor, toolBySlug, tools } from "@/content/tools";
import { toolSchema } from "@/lib/schema";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) return {};
  return {
    title: { absolute: tool.title },
    description: tool.description,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: { url: `/${tool.slug}`, title: tool.title, description: tool.description },
    twitter: { card: "summary_large_image", title: tool.title, description: tool.description },
  };
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) notFound();

  const shortcuts = tool.primary ? keywordPagesFor(tool.engine) : [];
  const parent = tool.primary ? null : tools.find((t) => t.primary && t.engine === tool.engine);
  const related = tool.related.map((s) => toolBySlug.get(s)).filter((t) => t !== undefined);

  return (
    <>
      <JsonLd data={toolSchema(tool, parent ?? undefined)} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-6 text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {parent && (
              <>
                <li>
                  <Link href={`/${parent.slug}`} className="hover:text-ink hover:underline">
                    {parent.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li aria-current="page" className="font-semibold text-ink">
              {tool.name}
            </li>
          </ol>
        </nav>

        <header className="pt-6 pb-8">
          <h1 className="display text-[2.6rem] sm:text-6xl">{tool.h1}</h1>
          <p className="mt-4 max-w-[56ch] text-lg text-ink-soft sm:text-xl">{tool.lead}</p>
        </header>

        <ToolRunner engineId={tool.engine} presets={tool.presets} pickLabel={tool.pickLabel} />

        {shortcuts.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-ink-soft">Shortcuts:</span>
            {shortcuts.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="chip inline-flex items-center hover:border-ink">
                {t.name}
              </Link>
            ))}
          </div>
        )}

        <article className="mt-20 max-w-[68ch]">
          <section aria-labelledby="how">
            <h2 id="how" className="display text-3xl sm:text-[2.5rem]">
              {tool.stepsHeading}
            </h2>
            <ol className="mt-8 flex flex-col gap-6">
              {tool.steps.map((step, i) => (
                <li key={i} className="grid grid-cols-[3rem_1fr] items-baseline gap-2">
                  <span className="display text-4xl text-ink/30" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="text-lg">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="about" className="mt-16">
            <h2 id="about" className="heading text-2xl sm:text-3xl">
              {tool.aboutHeading}
            </h2>
            <div className="prose-body mt-5 text-ink/90">
              {tool.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq" className="mt-16">
            <h2 id="faq" className="heading text-2xl sm:text-3xl">
              Questions
            </h2>
            <div className="mt-5 border-t-2 border-rule">
              {tool.faqs.map((f) => (
                <details key={f.q} className="group border-b-2 border-rule">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-ink/90">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-16">
            <h2 id="related" className="heading text-2xl sm:text-3xl">
              Related tools
            </h2>
            <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
              {related.map((t) => (
                <li key={t.slug} className="border-b-2 border-rule">
                  <Link href={`/${t.slug}`} className="block py-3">
                    <span className="marker-link heading text-xl">{t.name}</span>
                    <span className="block text-ink-soft text-[0.95rem]">{t.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
