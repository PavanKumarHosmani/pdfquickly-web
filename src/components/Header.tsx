import Link from "next/link";
import { Logo } from "./Logo";

const quick = [
  { href: "/jpg-to-pdf", label: "JPG to PDF" },
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/compress-image", label: "Compress Image" },
];

export function Header() {
  return (
    <header className="border-b-2 border-rule bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="PDF Quickly home" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 lg:flex">
            {quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-full px-3 py-2 font-medium hover:bg-page">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#tools" className="rounded-full border-2 border-ink px-4 py-1.5 font-semibold hover:bg-mark">
            All tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
