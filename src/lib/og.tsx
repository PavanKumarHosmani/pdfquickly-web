import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Share images are rendered at build time, so the font is read straight from node_modules.
const fontDir = join(process.cwd(), "node_modules/@fontsource/archivo/files");
const fonts = Promise.all([
  readFile(join(fontDir, "archivo-latin-800-normal.woff")),
  readFile(join(fontDir, "archivo-latin-500-normal.woff")),
]);

/** Social share card: big title on ink, highlighter stripe, domain. */
export async function ogImage(title: string, subtitle: string) {
  const [heavy, medium] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#172036",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 54, background: "#ffffff", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 8px" }}>
            <div style={{ width: "100%", height: 12, background: "#FFD43B", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>PDF Quickly</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 120, height: 14, background: "#FFD43B", marginBottom: 28 }} />
          <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em" }}>{title}</div>
          <div style={{ fontSize: 40, fontWeight: 500, color: "rgba(255,255,255,0.75)", marginTop: 22 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>pdfquickly.com</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: heavy, weight: 800, style: "normal" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
