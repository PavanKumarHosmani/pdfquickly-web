"use client";

import { useId, useState } from "react";
import type { EngineId, ImageFormat, PdfLevel, PickedFile, ToolOptions } from "@/lib/engines";
import { formatBytes } from "@/lib/format";

type Props = {
  engineId: EngineId;
  options: ToolOptions;
  files: PickedFile[];
  disabled: boolean;
  onChange: (o: ToolOptions) => void;
};

export function OptionsPanel({ engineId, options: o, files, disabled, onChange }: Props) {
  const set = (patch: Partial<ToolOptions>) => onChange({ ...o, ...patch });
  const file = files[0];

  switch (engineId) {
    case "compressPdf":
      return (
        <Group title="How small should it be?">
          <RadioList<PdfLevel>
            label="Compression level"
            value={o.pdfLevel}
            disabled={disabled}
            onChange={(pdfLevel) => set({ pdfLevel })}
            items={[
              ["SCREEN", "Smallest file", "Lower image quality. Best for email, WhatsApp and upload limits."],
              ["EBOOK", "Balanced", "Clear on screen with a large size reduction. Right for most files."],
              ["PRINTER", "High quality", "Keeps images sharp enough to print. Smaller savings."],
            ]}
          />
        </Group>
      );

    case "unlockPdf":
      return (
        <Group title="Enter the password">
          <PasswordField value={o.password} disabled={disabled} onChange={(password) => set({ password })} />
          <Hint>You need the password that opens this PDF now. We remove it so the file opens without one. Only unlock files you own or have permission to change.</Hint>
        </Group>
      );

    case "compressImage": {
      const presets = ["20", "50", "100", "200", "500"];
      return (
        <Group title="Target file size">
          <Choices<string>
            label="Target size"
            value={presets.includes(o.targetKb) ? o.targetKb : ""}
            disabled={disabled}
            onChange={(targetKb) => set({ targetKb })}
            items={presets.map((kb) => [kb, `${kb} KB`])}
          />
          <div className="max-w-[14rem]">
            <NumberField label="Or type a size" suffix="KB" value={o.targetKb} disabled={disabled} onChange={(targetKb) => set({ targetKb })} />
          </div>
          {file && <Hint>Your image is {formatBytes(file.file.size)} now.</Hint>}
        </Group>
      );
    }

    case "convertImage":
      return (
        <Group title="Convert to">
          <Choices<ImageFormat>
            label="Output format"
            value={o.format}
            disabled={disabled}
            onChange={(format) => set({ format })}
            items={[
              ["jpg", "JPG"],
              ["png", "PNG"],
              // WebP output is left out: the backend's WebP plugin can read WebP but not write it.
            ]}
          />
          {o.format === "png" ? (
            <Hint>PNG is lossless and keeps transparent backgrounds.</Hint>
          ) : (
            <QualitySlider value={o.quality} disabled={disabled} onChange={(quality) => set({ quality })} />
          )}
          {o.format === "jpg" && <Hint>JPG has no transparency, so transparent areas become white.</Hint>}
        </Group>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Small form pieces
// ---------------------------------------------------------------------------

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6 border-t-2 border-rule pt-6">
      <legend className="sr-only">{title}</legend>
      <p className="heading mb-4 text-xl" aria-hidden="true">
        {title}
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="max-w-prose text-[0.95rem] text-ink-soft">{children}</p>;
}

function Choices<T extends string>({
  label,
  value,
  items,
  disabled,
  onChange,
}: {
  label: string;
  value: T | "";
  items: [T, string][];
  disabled: boolean;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {items.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={v === value}
          disabled={disabled}
          onClick={() => onChange(v)}
          className="chip"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function RadioList<T extends string>({
  label,
  value,
  items,
  disabled,
  onChange,
}: {
  label: string;
  value: T;
  items: [T, string, string][];
  disabled: boolean;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label={label}>
      {items.map(([v, title, desc]) => (
        <label
          key={v}
          className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 ${v === value ? "border-ink bg-mark-soft" : "border-rule bg-surface"} ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <input
            type="radio"
            name={name}
            value={v}
            checked={v === value}
            disabled={disabled}
            onChange={() => onChange(v)}
            className="mt-1 h-5 w-5 accent-[#172036]"
          />
          <span>
            <span className="block font-semibold">{title}</span>
            <span className="block text-[0.95rem] text-ink-soft">{desc}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

function NumberField({
  label,
  value,
  suffix,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  suffix?: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className={`field tabular-nums ${suffix ? "pr-12" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">{suffix}</span>}
      </div>
    </div>
  );
}

function PasswordField({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (v: string) => void }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="max-w-md">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        PDF password
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="field pr-20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold hover:bg-page"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function QualitySlider({ value, disabled, onChange }: { value: number; disabled: boolean; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="max-w-md">
      <label htmlFor={id} className="mb-1 flex justify-between text-sm font-semibold">
        <span>Quality</span>
        <span className="tabular-nums">{Math.round(value * 100)}%</span>
      </label>
      <input
        id={id}
        type="range"
        min={10}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full accent-[#172036]"
      />
      <p className="mt-1 text-sm text-ink-soft">Lower quality makes a smaller file.</p>
    </div>
  );
}
