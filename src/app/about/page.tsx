import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/TextPage";

export const metadata: Metadata = {
  title: "About",
  description: "PDF Quickly is a set of free online tools for everyday PDF and image jobs, built to be fast, simple and private.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <TextPage title="About PDF Quickly">
      <p>
        PDF Quickly is a set of free tools for the small file jobs that come up every day: turning photos into a PDF for a
        form, getting an attachment under an email limit, pulling one page out of a long document, or shrinking a photo to
        the size an application portal demands.
      </p>
      <p>
        Every tool works in your browser on any phone or computer. There&apos;s no account to create, no watermark on your
        files and no software to install.
      </p>
      <h2>How it works</h2>
      <p>
        When you use a tool, your file is sent over an encrypted connection to our servers, processed, and sent back to you.
        Files are deleted automatically within 24 hours. You can read the details in our <Link href="/privacy">privacy policy</Link>.
      </p>
      <h2>Get in touch</h2>
      <p>
        Found a bug or want a new tool? <Link href="/contact">Contact us</Link>.
      </p>
    </TextPage>
  );
}
