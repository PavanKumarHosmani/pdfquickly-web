"use client";

import { useState } from "react";
import type { InputKind, PickedFile } from "@/lib/engines";
import { formatBytes } from "@/lib/format";

type Props = {
  files: PickedFile[];
  input: InputKind;
  reorderable: boolean;
  disabled: boolean;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
};

/** The chosen files. Multi-file tools can reorder by dragging (desktop) or with the arrow buttons (everywhere). */
export function PickedFiles({ files, input, reorderable, disabled, onRemove, onMove }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <ol className="flex flex-col gap-2" aria-label="Chosen files">
      {files.map((f, i) => {
        const dims = f.width && f.height ? `${f.width} × ${f.height}px, ` : "";
        return (
          <li
            key={f.id}
            draggable={reorderable && !disabled}
            onDragStart={(e) => {
              setDragIndex(i);
              e.dataTransfer.effectAllowed = "move";
              // Mark this as a reorder, not a file drop.
              e.dataTransfer.setData("text/plain", f.id);
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              e.stopPropagation();
              setOverIndex(i);
            }}
            onDrop={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              e.stopPropagation();
              onMove(dragIndex, i);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-3 rounded-xl border-2 bg-page/60 p-2 pr-1 ${
              overIndex === i && dragIndex !== i ? "border-ink" : "border-transparent"
            } ${dragIndex === i ? "opacity-50" : ""} ${reorderable && !disabled ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {reorderable && (
              <span className="w-6 shrink-0 text-center font-semibold text-ink-soft tabular-nums" aria-hidden="true">
                {i + 1}
              </span>
            )}

            {input === "image" && f.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.previewUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-rule object-cover" />
            ) : (
              <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-surface text-[0.65rem] font-bold">
                {input === "pdf" ? "PDF" : "IMG"}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{f.file.name}</span>
              <span className="block text-sm text-ink-soft">
                {dims}
                {formatBytes(f.file.size)}
              </span>
            </span>

            {reorderable && (
              <>
                <IconButton label={`Move ${f.file.name} up`} disabled={disabled || i === 0} onClick={() => onMove(i, i - 1)}>
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </IconButton>
                <IconButton
                  label={`Move ${f.file.name} down`}
                  disabled={disabled || i === files.length - 1}
                  onClick={() => onMove(i, i + 1)}
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </IconButton>
              </>
            )}
            <IconButton label={`Remove ${f.file.name}`} disabled={disabled} onClick={() => onRemove(f.id)}>
              <path d="M6 6l12 12M18 6L6 18" />
            </IconButton>
          </li>
        );
      })}
    </ol>
  );
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-rule disabled:opacity-25 disabled:hover:bg-transparent"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
