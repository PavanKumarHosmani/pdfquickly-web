/** Layout for plain text pages: about, privacy, terms, contact. */
export function TextPage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-14 sm:px-6">
      <h1 className="display text-[2.6rem] sm:text-6xl">{title}</h1>
      {updated && <p className="mt-3 text-ink-soft">Last updated {updated}</p>}
      <div className="prose-body mt-10 max-w-[68ch] text-ink/90 [&_h2]:heading [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li+li]:mt-1">
        {children}
      </div>
    </div>
  );
}
