/** Wordmark: a folded page with a highlighter stripe, then the name in the wide cut. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
        <path d="M2 2h15l7 7v19H2z" fill="#fff" stroke="#172036" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 2v7h7" fill="none" stroke="#172036" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="6" y="14" width="14" height="5" rx="1" fill="#FFD43B" />
        <rect x="6" y="22" width="10" height="2.5" rx="1.25" fill="#172036" />
      </svg>
      <span className="text-[1.2rem] font-extrabold tracking-tight [font-stretch:125%]">PDF Quickly</span>
    </span>
  );
}
