import Link from "next/link";
import { ToolIndex } from "@/components/ToolIndex";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <h1 className="display text-[2.6rem] sm:text-6xl">Page not found</h1>
      <p className="mt-4 max-w-[56ch] text-lg text-ink-soft">
        This page doesn&apos;t exist. Pick a tool below, or go to the{" "}
        <Link href="/" className="font-semibold text-ink underline decoration-mark decoration-2 underline-offset-4">
          home page
        </Link>
        .
      </p>
      <div className="mt-12">
        <ToolIndex />
      </div>
    </div>
  );
}
