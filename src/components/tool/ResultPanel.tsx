"use client";

import type { EngineId } from "@/lib/engines";
import { formatBytes } from "@/lib/format";
import type { RunResult } from "@/lib/runner";

type Props = {
  engineId: EngineId;
  result: RunResult;
  inputSize: number;
  /** Compress Image only: the size the user asked for. */
  targetKb?: number;
  onStartOver: () => void;
};

const SHRINKS: EngineId[] = ["compressPdf", "compressImage"];

export function ResultPanel({ engineId, result, inputSize, targetKb, onStartOver }: Props) {
  const isImage = result.mime.startsWith("image/");
  const saved = SHRINKS.includes(engineId) && result.size ? 1 - result.size / inputSize : null;
  // The server returns its best effort when a target can't be reached, which a form would still reject.
  const overTarget = targetKb !== undefined && result.size !== undefined && result.size > targetKb * 1024;

  return (
    <div className="animate-rise grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="display text-3xl sm:text-4xl">Your file is ready</p>
        <p className="mt-2 break-all text-ink-soft">{result.filename}</p>

        {result.size !== undefined && (
          <p className="mt-1 text-[0.95rem]">
            {saved !== null && saved > 0.005 ? (
              <>
                {formatBytes(inputSize)} to <strong>{formatBytes(result.size)}</strong>,{" "}
                <span className="rounded bg-ok-soft px-1.5 py-0.5 font-semibold text-ok">{Math.round(saved * 100)}% smaller</span>
              </>
            ) : saved !== null ? (
              <>
                {formatBytes(result.size)}. This file was already well compressed, so it couldn&apos;t get much smaller.
              </>
            ) : (
              formatBytes(result.size)
            )}
          </p>
        )}

        {overTarget && (
          <p role="alert" className="mt-3 rounded-xl bg-bad-soft px-4 py-3 text-bad text-[0.95rem]">
            This is the smallest we could make it, but it&apos;s still over your {targetKb} KB target. Crop the image
            closer, or start over with a smaller photo.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={result.href}
            download={result.external ? undefined : result.filename}
            target={result.external ? "_blank" : undefined}
            rel={result.external ? "noopener" : undefined}
            className="btn btn-mark min-h-14 px-8 text-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
            </svg>
            Download
          </a>
          <button type="button" onClick={onStartOver} className="btn btn-ghost min-h-14">
            Start over
          </button>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {result.external
            ? "The download link works for 10 minutes."
            : "Your files are deleted from our servers automatically."}
        </p>
      </div>

      {isImage && !result.external && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.href}
          alt="Preview of the result"
          className="max-h-64 w-full rounded-xl border-2 border-rule bg-page object-contain sm:w-64"
        />
      )}
    </div>
  );
}
