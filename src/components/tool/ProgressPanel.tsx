"use client";

import type { Progress } from "@/lib/runner";

const copy: Record<Progress["stage"], { label: string; hint: string }> = {
  preparing: { label: "Getting ready", hint: "Setting up a secure upload." },
  uploading: { label: "Uploading", hint: "Sending your files over an encrypted connection." },
  processing: { label: "Working on it", hint: "Large files can take up to a minute. Keep this tab open." },
  downloading: { label: "Almost done", hint: "Fetching your file." },
};

export function ProgressPanel({ progress, onCancel }: { progress: Progress; onCancel: () => void }) {
  const { label, hint } = copy[progress.stage];
  const pct = progress.fraction !== undefined ? Math.round(progress.fraction * 100) : null;

  return (
    <div aria-live="polite">
      <div className="flex items-baseline justify-between gap-4">
        <p className="heading text-xl">
          {label}
          {pct !== null && <span className="ml-2 tabular-nums text-ink-soft">{pct}%</span>}
        </p>
        <button type="button" onClick={onCancel} className="font-semibold underline decoration-2 underline-offset-4 hover:text-bad">
          Cancel
        </button>
      </div>
      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-rule"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct ?? undefined}
      >
        {pct !== null ? (
          <div className="h-full rounded-full bg-mark transition-[width] duration-200" style={{ width: `${Math.max(pct, 3)}%` }} />
        ) : (
          <div className="animate-indeterminate h-full w-2/5 rounded-full bg-mark" />
        )}
      </div>
      <p className="mt-3 text-ink-soft text-[0.95rem]">{hint}</p>
    </div>
  );
}
