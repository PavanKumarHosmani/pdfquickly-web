// What each tool accepts and how its options are checked.
// Shared by the server-rendered pages and the client-side tool runner.

export type EngineId =
  | "imageToPdf"
  | "mergePdf"
  | "compressPdf"
  | "pdfToJpg"
  | "unlockPdf"
  | "compressImage"
  | "convertImage";

export type InputKind = "image" | "pdf";

export type Engine = {
  id: EngineId;
  input: InputKind;
  minFiles: number;
  maxFiles: number;
  /** Per-file limit. */
  maxFileMb: number;
  /** Button label, e.g. "Merge PDF". */
  action: string;
};

export const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff";
export const PDF_ACCEPT = "application/pdf,.pdf";

export const engines: Record<EngineId, Engine> = {
  imageToPdf: { id: "imageToPdf", input: "image", minFiles: 1, maxFiles: 20, maxFileMb: 25, action: "Convert to PDF" },
  mergePdf: { id: "mergePdf", input: "pdf", minFiles: 2, maxFiles: 20, maxFileMb: 50, action: "Merge PDF" },
  compressPdf: { id: "compressPdf", input: "pdf", minFiles: 1, maxFiles: 1, maxFileMb: 50, action: "Compress PDF" },
  pdfToJpg: { id: "pdfToJpg", input: "pdf", minFiles: 1, maxFiles: 1, maxFileMb: 50, action: "Convert to JPG" },
  unlockPdf: { id: "unlockPdf", input: "pdf", minFiles: 1, maxFiles: 1, maxFileMb: 50, action: "Unlock PDF" },
  compressImage: { id: "compressImage", input: "image", minFiles: 1, maxFiles: 1, maxFileMb: 25, action: "Compress image" },
  convertImage: { id: "convertImage", input: "image", minFiles: 1, maxFiles: 1, maxFileMb: 25, action: "Convert image" },
};

export type PdfLevel = "SCREEN" | "EBOOK" | "PRINTER";
export type ImageFormat = "jpg" | "png";

/** Every option any tool uses. Each tool reads only its own fields. Numbers typed by the user stay strings. */
export type ToolOptions = {
  pdfLevel: PdfLevel;
  password: string;
  targetKb: string;
  format: ImageFormat;
  quality: number;
};

export const defaultOptions: ToolOptions = {
  pdfLevel: "EBOOK",
  password: "",
  targetKb: "100",
  format: "png",
  quality: 0.85,
};

export type PickedFile = {
  id: string;
  file: File;
  /** Object URL for image thumbnails. */
  previewUrl?: string;
  width?: number;
  height?: number;
};

const int = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s) : NaN);

/** Why the tool can't start yet, or null when it can. Shown under the button. */
export function validate(engine: Engine, files: PickedFile[], o: ToolOptions): string | null {
  if (files.length < engine.minFiles) {
    return engine.minFiles > 1 ? `Add at least ${engine.minFiles} files to continue.` : null;
  }
  const first = files[0];

  switch (engine.id) {
    case "unlockPdf":
      return o.password ? null : "Enter the PDF's current password.";
    case "compressImage": {
      const kb = int(o.targetKb);
      if (!(kb >= 5)) return "Target size must be at least 5 KB.";
      if (first && first.file.size <= kb * 1024) {
        return `This image is already ${Math.ceil(first.file.size / 1024)} KB, which is under your ${kb} KB target.`;
      }
      return null;
    }
    default:
      return null;
  }
}
