"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IMAGE_ACCEPT,
  PDF_ACCEPT,
  defaultOptions,
  engines,
  validate,
  type EngineId,
  type PickedFile,
  type ToolOptions,
} from "@/lib/engines";
import { isAbort, runTool, type Progress, type RunResult } from "@/lib/runner";
import { PickedFiles } from "./PickedFiles";
import { OptionsPanel } from "./OptionsPanel";
import { ProgressPanel } from "./ProgressPanel";
import { ResultPanel } from "./ResultPanel";

type Phase =
  | { kind: "idle" }
  | { kind: "working"; progress: Progress }
  | { kind: "done"; result: RunResult }
  | { kind: "failed"; message: string };

type Props = {
  engineId: EngineId;
  presets?: Partial<ToolOptions>;
  /** Drop zone call to action, e.g. "Choose JPG images". */
  pickLabel: string;
};

let nextId = 0;

export function ToolRunner({ engineId, presets, pickLabel }: Props) {
  const engine = engines[engineId];
  const initialOptions = useMemo(() => ({ ...defaultOptions, ...presets }), [presets]);

  const [files, setFiles] = useState<PickedFile[]>([]);
  const [options, setOptions] = useState<ToolOptions>(initialOptions);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [notice, setNotice] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const working = phase.kind === "working";
  const accept = engine.input === "pdf" ? PDF_ACCEPT : IMAGE_ACCEPT;
  const multiple = engine.maxFiles > 1;

  // Free object URLs when the page goes away.
  useEffect(
    () => () => {
      filesRef.current.forEach(revokePreview);
      const last = phaseRef.current;
      if (last.kind === "done" && !last.result.external) URL.revokeObjectURL(last.result.href);
      abortRef.current?.abort();
    },
    [],
  );

  const addFiles = useCallback(
    async (list: FileList | File[]) => {
      if (working) return;
      const incoming = Array.from(list);
      const problems: string[] = [];

      const valid = incoming.filter((f) => {
        const ok = engine.input === "pdf" ? isPdf(f) : isImage(f);
        if (!ok) {
          problems.push(`${f.name} isn't ${engine.input === "pdf" ? "a PDF" : "a supported image (JPG, PNG, WebP, GIF, BMP, TIFF)"}.`);
          return false;
        }
        if (f.size > engine.maxFileMb * 1024 * 1024) {
          problems.push(`${f.name} is larger than ${engine.maxFileMb} MB.`);
          return false;
        }
        return true;
      });

      const picked = await Promise.all(valid.map(toPicked));
      // Worked out here rather than in a setFiles updater: React runs updaters later,
      // after the notice below has already been set, so a message pushed there was lost.
      if (picked.length) {
        const current = filesRef.current;
        const combined = multiple ? [...current, ...picked] : picked;
        const dropped = combined.slice(engine.maxFiles);
        if (!multiple) current.forEach(revokePreview);
        dropped.forEach(revokePreview);
        if (dropped.length) problems.push(`You can add up to ${engine.maxFiles} files, so the extra ones were left out.`);
        setFiles(combined.slice(0, engine.maxFiles));
      }

      setNotice(problems.length ? problems.join(" ") : null);
      setPhase((p) => (p.kind === "failed" ? { kind: "idle" } : p));
    },
    [engine, multiple, working],
  );

  // Paste images straight from the clipboard on image tools.
  useEffect(() => {
    if (engine.input !== "image") return;
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []).filter(isImage);
      if (pasted.length && phase.kind !== "done") addFiles(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [engine.input, addFiles, phase.kind]);

  const remove = (id: string) => {
    if (working) return;
    setFiles((list) => {
      const gone = list.find((f) => f.id === id);
      if (gone?.previewUrl) URL.revokeObjectURL(gone.previewUrl);
      return list.filter((f) => f.id !== id);
    });
    setNotice(null);
  };

  const move = (from: number, to: number) => {
    if (working) return;
    setFiles((list) => {
      if (to < 0 || to >= list.length) return list;
      const copy = [...list];
      copy.splice(to, 0, copy.splice(from, 1)[0]);
      return copy;
    });
  };

  const blocking = files.length ? validate(engine, files, options) : null;
  const canStart = files.length >= engine.minFiles && !blocking && !working;

  const start = async () => {
    if (!canStart) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setNotice(null);
    setPhase({ kind: "working", progress: { stage: "preparing" } });
    try {
      const result = await runTool(engine, files, options, (progress) => setPhase({ kind: "working", progress }), controller.signal);
      setPhase({ kind: "done", result });
    } catch (e) {
      if (isAbort(e)) {
        setPhase({ kind: "idle" });
      } else {
        setPhase({ kind: "failed", message: e instanceof Error ? e.message : "Something went wrong. Please try again." });
      }
    } finally {
      abortRef.current = null;
    }
  };

  const cancel = () => abortRef.current?.abort();

  const startOver = () => {
    if (phase.kind === "done" && !phase.result.external) URL.revokeObjectURL(phase.result.href);
    files.forEach(revokePreview);
    setFiles([]);
    setOptions(initialOptions);
    setPhase({ kind: "idle" });
    setNotice(null);
  };

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      // Only react to files from outside, not to reordering the list.
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      if (!working) setDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
    },
    onDrop,
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(e) => {
        if (e.target.files) addFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  // ---------------------------------------------------------------------
  // Done
  // ---------------------------------------------------------------------
  if (phase.kind === "done") {
    return (
      <section aria-label="Result" className="rounded-[20px] bg-surface p-5 sm:p-8 shadow-[0_1px_0_var(--color-rule)]">
        <ResultPanel
          engineId={engine.id}
          result={phase.result}
          inputSize={files.reduce((n, f) => n + f.file.size, 0)}
          targetKb={engine.id === "compressImage" ? Number(options.targetKb) : undefined}
          onStartOver={startOver}
        />
      </section>
    );
  }

  // ---------------------------------------------------------------------
  // Empty: the big drop zone
  // ---------------------------------------------------------------------
  if (files.length === 0) {
    return (
      <section aria-label="Choose files">
        {input}
        <div
          {...dragProps}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-[20px] border-[3px] border-dashed px-6 py-12 text-center transition-colors sm:py-16 ${
            dragging ? "border-ink bg-mark-soft" : "border-ink/25 bg-surface"
          }`}
        >
          <SheetsIcon input={engine.input} />
          <button type="button" onClick={openPicker} className="btn btn-mark min-h-14 px-8 text-lg">
            {pickLabel}
          </button>
          <p className="text-ink-soft text-[0.95rem]">
            or drop {multiple ? "files" : "a file"} here
            {engine.input === "image" ? ", or paste an image" : ""}
          </p>
          <p className="text-ink-soft text-sm">
            {multiple ? `Up to ${engine.maxFiles} files, ` : ""}
            {engine.maxFileMb} MB per file
          </p>
        </div>
        {notice && <p role="alert" className="mt-3 text-bad text-[0.95rem]">{notice}</p>}
      </section>
    );
  }

  // ---------------------------------------------------------------------
  // Files chosen: list, options, action
  // ---------------------------------------------------------------------
  return (
    <section
      aria-label="Your files"
      {...dragProps}
      className={`rounded-[20px] bg-surface p-4 sm:p-6 shadow-[0_1px_0_var(--color-rule)] ring-[3px] transition-shadow ${
        dragging ? "ring-ink" : "ring-transparent"
      }`}
    >
      {input}
      <PickedFiles
        files={files}
        input={engine.input}
        reorderable={multiple}
        disabled={working}
        onRemove={remove}
        onMove={move}
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={openPicker} disabled={working} className="btn btn-ghost min-h-10 px-4 text-[0.95rem]">
          {multiple ? "Add more files" : engine.input === "pdf" ? "Choose a different PDF" : "Choose a different image"}
        </button>
        {multiple && (
          <span className="text-ink-soft text-sm">
            {files.length} of {engine.maxFiles}. Files are joined in this order.
          </span>
        )}
      </div>
      {notice && <p role="alert" className="mt-3 text-bad text-[0.95rem]">{notice}</p>}

      <OptionsPanel engineId={engine.id} options={options} files={files} disabled={working} onChange={setOptions} />

      <div className="mt-6 border-t-2 border-rule pt-6">
        {phase.kind === "working" ? (
          <ProgressPanel progress={phase.progress} onCancel={cancel} />
        ) : (
          <>
            {phase.kind === "failed" && (
              <div role="alert" className="mb-4 rounded-xl bg-bad-soft px-4 py-3 text-bad">
                <p className="font-semibold">That didn&apos;t work.</p>
                <p>{phase.message}</p>
              </div>
            )}
            <button type="button" onClick={start} disabled={!canStart} className="btn btn-primary w-full min-h-14 text-lg sm:w-auto sm:px-10">
              {phase.kind === "failed" ? "Try again" : engine.action}
            </button>
            {blocking && <p className="mt-3 text-bad text-[0.95rem]">{blocking}</p>}
          </>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

function revokePreview(f: PickedFile) {
  if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
}

function isPdf(f: File) {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

function isImage(f: File) {
  return /^image\/(jpeg|jpg|png|webp|gif|bmp|x-ms-bmp|tiff|tif)$/.test(f.type) || /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i.test(f.name);
}

async function toPicked(file: File): Promise<PickedFile> {
  const picked: PickedFile = { id: `f${nextId++}`, file };
  if (isImage(file)) {
    picked.previewUrl = URL.createObjectURL(file);
    const size = await imageSize(picked.previewUrl);
    if (size) {
      picked.width = size.w;
      picked.height = size.h;
    }
  }
  return picked;
}

function imageSize(url: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null); // e.g. TIFF in most browsers; the server can still read it.
    img.src = url;
  });
}

function SheetsIcon({ input }: { input: "pdf" | "image" }) {
  return (
    <svg width="72" height="64" viewBox="0 0 72 64" fill="none" aria-hidden="true">
      <rect x="18" y="4" width="36" height="46" rx="4" fill="#fff" stroke="#172036" strokeWidth="2.5" transform="rotate(8 36 27)" />
      <rect x="14" y="10" width="36" height="46" rx="4" fill="#fff" stroke="#172036" strokeWidth="2.5" />
      {input === "pdf" ? (
        <>
          <rect x="20" y="20" width="24" height="5" rx="1" fill="#FFD43B" />
          <rect x="20" y="30" width="20" height="3" rx="1.5" fill="#172036" opacity=".35" />
          <rect x="20" y="37" width="24" height="3" rx="1.5" fill="#172036" opacity=".35" />
          <rect x="20" y="44" width="14" height="3" rx="1.5" fill="#172036" opacity=".35" />
        </>
      ) : (
        <>
          <circle cx="24" cy="22" r="4" fill="#FFD43B" />
          <path d="M18 50l9-12 6 7 5-5 8 10H18z" fill="#172036" opacity=".75" />
        </>
      )}
    </svg>
  );
}
