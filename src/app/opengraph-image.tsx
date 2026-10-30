import { ogImage, ogSize } from "@/lib/og";

export const alt = "PDF Quickly: free online PDF and image tools";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Free PDF and image tools", "Merge, compress and convert in seconds");
}
