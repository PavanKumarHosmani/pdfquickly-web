import Link from "next/link";
import { primaryTools, type Category } from "@/content/tools";

const groups: { category: Category; title: string }[] = [
  { category: "pdf", title: "PDF tools" },
  { category: "image", title: "Image tools" },
];

/** The home page's tool list: big type, no cards. */
export function ToolIndex() {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      {groups.map((g) => (
        <section key={g.category} aria-labelledby={`group-${g.category}`}>
          <h2 id={`group-${g.category}`} className="heading border-b-[3px] border-ink pb-3 text-2xl">
            {g.title}
          </h2>
          <ul>
            {primaryTools
              .filter((t) => t.category === g.category)
              .map((t) => (
                <li key={t.slug} className="border-b-2 border-rule">
                  <Link href={`/${t.slug}`} className="group block py-4">
                    <span className="marker-link heading text-[1.65rem] sm:text-[1.9rem]">{t.name}</span>
                    <span className="mt-0.5 block text-ink-soft">{t.blurb}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
