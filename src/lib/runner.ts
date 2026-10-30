// Runs a tool against the backend, in the browser.
//
// Most tools use the S3 flow:
//   1. POST <tool>/upload-urls -> operationId + presigned PUT URLs
//   2. PUT each file straight to S3
//   3. POST <tool>/start       -> presigned GET URL for the result
//   4. GET the result

import { site } from "./site";
import type { Engine, PickedFile, ToolOptions } from "./engines";

export type Stage = "preparing" | "uploading" | "processing" | "downloading";
export type Progress = { stage: Stage; fraction?: number };

export type RunResult = {
  filename: string;
  mime: string;
  size?: number;
  /** Object URL of the downloaded result, or the S3 link when the browser couldn't fetch it directly. */
  href: string;
  /** True when href is the S3 link rather than a local copy. */
  external: boolean;
};

export class ToolError extends Error {}

const API = site.apiBaseUrl;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function runTool(
  engine: Engine,
  picked: PickedFile[],
  o: ToolOptions,
  onProgress: (p: Progress) => void,
  signal: AbortSignal,
): Promise<RunResult> {
  const files = picked.map((p) => p.file);
  const base = baseName(files[0].name);

  const s3 = async (slotsPath: string, startPath: string, body: (op: string, keys: string[]) => object, name: (ext: string) => string) => {
    const { operationId, keys } = await uploadAll(slotsPath, files, onProgress, signal);
    onProgress({ stage: "processing" });
    const res = await postJson<{ downloadUrl?: string; error?: string }>(startPath, body(operationId, keys), signal);
    if (!res.downloadUrl) throw new ToolError(res.error || "The server didn't return a result.");
    const ext = extFromUrl(res.downloadUrl);
    return download(res.downloadUrl, name(ext), onProgress, signal);
  };

  switch (engine.id) {
    case "imageToPdf":
      return s3("upload-urls", "convert/start", (op, keys) => ({ operationId: op, fileKeys: keys }), () =>
        files.length > 1 ? `${base}-and-${files.length - 1}-more.pdf` : `${base}.pdf`,
      );

    case "mergePdf":
      return s3("pdf/upload-urls", "pdf/merge/start", (op, keys) => ({ operationId: op, fileKeys: keys }), () => `${base}-merged.pdf`);

    case "compressPdf":
      return s3(
        "pdf/compress/upload-urls",
        "pdf/compress/start",
        (op, keys) => ({ operationId: op, fileKey: keys[0], compressionLevel: o.pdfLevel }),
        () => `${base}-compressed.pdf`,
      );

    case "pdfToJpg":
      return s3("pdf-to-jpg/upload-urls", "pdf/to-jpg/start", (op, keys) => ({ operationId: op, fileKey: keys[0] }), () => `${base}-jpg.zip`);

    case "unlockPdf":
      return s3(
        "pdf-to-jpg/upload-urls",
        "pdf/unlock/start",
        (op, keys) => ({ operationId: op, fileKey: keys[0], password: o.password }),
        () => `${base}-unlocked.pdf`,
      );

    case "compressImage":
      return s3(
        "image/upload-urls",
        "image/compress/start",
        (op, keys) => ({ operationId: op, fileKey: keys[0], targetSizeKb: Number(o.targetKb) }),
        (ext) => `${base}-${o.targetKb}kb.${ext}`,
      );

    case "convertImage":
      return s3(
        "image/upload-urls",
        "image/convert/start",
        (op, keys) => ({
          operationId: op,
          fileKey: keys[0],
          targetFormat: o.format,
          quality: o.format === "png" ? null : o.quality,
        }),
        (ext) => `${base}.${ext}`,
      );
  }
}

// ---------------------------------------------------------------------------
// S3 flow
// ---------------------------------------------------------------------------

type Slot = { fileKey?: string; url?: string; uploadUrl?: string };

async function uploadAll(path: string, files: File[], onProgress: (p: Progress) => void, signal: AbortSignal) {
  onProgress({ stage: "preparing" });
  const res = await postJson<{ operationId?: string; uploadUrls?: Slot[] }>(path, { fileCount: files.length }, signal);
  const slots = res.uploadUrls ?? [];
  if (!res.operationId || slots.length !== files.length) {
    throw new ToolError("The server didn't return upload links. Please try again.");
  }

  const total = files.reduce((n, f) => n + f.size, 0) || 1;
  const sent = new Array(files.length).fill(0);
  const report = () => onProgress({ stage: "uploading", fraction: Math.min(1, sent.reduce((a, b) => a + b, 0) / total) });
  report();

  // One failed upload stops the others instead of leaving them running in the background.
  const uploads = new AbortController();
  const stop = () => uploads.abort();
  signal.addEventListener("abort", stop, { once: true });

  // Three at a time: faster than one by one, gentle on slow connections.
  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const i = next++;
      const url = slots[i].url ?? slots[i].uploadUrl;
      if (!url) throw new ToolError("The server returned an incomplete upload link.");
      const r = await request({
        method: "PUT",
        url,
        body: files[i],
        signal: uploads.signal,
        onUpload: (loaded) => {
          sent[i] = loaded;
          report();
        },
      });
      if (r.status < 200 || r.status >= 300) throw new ToolError(`Uploading ${files[i].name} failed (${r.status}). Please try again.`);
      sent[i] = files[i].size;
      report();
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.min(3, files.length) }, worker));
  } catch (e) {
    uploads.abort();
    throw e;
  } finally {
    signal.removeEventListener("abort", stop);
  }

  return { operationId: res.operationId, keys: slots.map((s) => s.fileKey ?? "") };
}

async function download(url: string, filename: string, onProgress: (p: Progress) => void, signal: AbortSignal): Promise<RunResult> {
  onProgress({ stage: "downloading" });
  const mime = mimeFor(filename);
  let r: XMLHttpRequest;
  try {
    r = await request({
      method: "GET",
      url,
      responseType: "blob",
      signal,
      onDownload: (loaded, total) => onProgress({ stage: "downloading", fraction: total ? loaded / total : undefined }),
    });
  } catch (e) {
    if (isAbort(e)) throw e;
    // The bucket may not allow cross-origin GETs, which the browser reports as a network error.
    // The link still works as a plain download.
    return { filename, mime, href: url, external: true };
  }
  // A real error status means the link itself is bad, so falling back to it would only hand over a broken download.
  if (r.status < 200 || r.status >= 300) throw new ToolError(`Downloading the result failed (${r.status}). Please try again.`);
  const blob = new Blob([r.response as Blob], { type: mime });
  return { filename, mime, size: blob.size, href: URL.createObjectURL(blob), external: false };
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function postJson<T>(path: string, body: object, signal: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    if (isAbort(e)) throw e;
    throw new ToolError("Couldn't reach the server. Check your internet connection and try again.");
  }
  const text = await res.text();
  if (!res.ok) throw new ToolError(readError(text, res.status));
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ToolError("The server sent an unexpected response. Please try again.");
  }
}

type RequestOptions = {
  method: string;
  url: string;
  body?: XMLHttpRequestBodyInit;
  responseType?: XMLHttpRequestResponseType;
  signal: AbortSignal;
  onUpload?: (loaded: number, total: number) => void;
  onDownload?: (loaded: number, total: number) => void;
};

/** XHR rather than fetch, because fetch can't report upload progress. */
function request(opts: RequestOptions): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    if (opts.responseType) xhr.responseType = opts.responseType;
    if (opts.onUpload) xhr.upload.onprogress = (e) => opts.onUpload!(e.loaded, e.lengthComputable ? e.total : e.loaded);
    if (opts.onDownload) xhr.onprogress = (e) => opts.onDownload!(e.loaded, e.lengthComputable ? e.total : 0);
    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(new ToolError("Couldn't reach the server. Check your internet connection and try again."));
    xhr.ontimeout = () => reject(new ToolError("The server took too long to respond. Please try again."));
    xhr.onabort = () => reject(new DOMException("Cancelled", "AbortError"));

    if (opts.signal.aborted) return reject(new DOMException("Cancelled", "AbortError"));
    opts.signal.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(opts.body ?? null);
  });
}

/** The backend reports errors as {"error": "..."}, Spring's default JSON, or plain text. */
function readError(raw: string, status: number): string {
  const text = raw.trim();
  if (text.startsWith("{")) {
    try {
      const json = JSON.parse(text);
      for (const key of ["error", "message"]) {
        // The backend's catch-all handler prefixes "Internal error: ", which means nothing to a user.
        const v = typeof json[key] === "string" ? json[key].replace(/^Internal error:\s*/, "").trim() : "";
        if (v && v !== "null" && v !== "Internal Server Error" && v !== "Bad Request") return v;
      }
    } catch {
      // fall through
    }
  } else if (text && text.length < 300 && !text.startsWith("<")) {
    return text.replace(/^Error:\s*/, "");
  }
  if (status === 400) return "The server couldn't use these settings. Check them and try again.";
  if (status === 404) return "This tool isn't available right now.";
  if (status === 413) return "This file is too large for this tool.";
  if (status >= 500) return `The server ran into a problem (${status}). Please try again.`;
  return `The request failed (${status}).`;
}

export const isAbort = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

// ---------------------------------------------------------------------------
// Naming
// ---------------------------------------------------------------------------

function baseName(name: string) {
  const stem = name.replace(/\.[^.]+$/, "");
  const clean = stem.replace(/[^\p{L}\p{N}._ -]+/gu, "").trim().replace(/\s+/g, "-");
  return clean.slice(0, 80) || "file";
}

function extFromUrl(url: string) {
  const path = url.split("?")[0];
  const last = path.substring(path.lastIndexOf("/") + 1);
  const dot = last.lastIndexOf(".");
  return dot > 0 ? last.substring(dot + 1).toLowerCase() : "pdf";
}

function mimeFor(filename: string) {
  const ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
  const map: Record<string, string> = {
    pdf: "application/pdf",
    zip: "application/zip",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}
