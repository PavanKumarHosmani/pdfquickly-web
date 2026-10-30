import Link from "next/link";
import { tools } from "@/content/tools";
import { Logo } from "./Logo";

export function Footer() {
  const pdf = tools.filter((t) => t.category === "pdf");
  const image = tools.filter((t) => t.category === "image");

  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-white/75 text-[0.95rem]">
            Free PDF and image tools that work in any browser. No sign-up, no watermark.
          </p>
        </div>
        <FooterList title="PDF tools" links={pdf.map((t) => ({ href: `/${t.slug}`, label: t.name }))} />
        <FooterList title="Image tools" links={image.map((t) => ({ href: `/${t.slug}`, label: t.name }))} />
        <FooterList
          title="PDF Quickly"
          links={[
            { href: "/about", label: "About" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/contact", label: "Contact" },
          ]}
        />
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/60 sm:px-6">© {new Date().getFullYear()} PDF Quickly</p>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="mb-3 font-bold">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/75 text-[0.95rem] hover:text-mark">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
