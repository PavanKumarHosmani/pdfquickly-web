import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PDF Quickly handles the files you upload: encrypted transfer, processing only, and automatic deletion within 24 hours.",
  alternates: { canonical: "/privacy" },
};

// Review this with your own legal advice before launch, and keep it in step with what the backend actually does.
export default function PrivacyPage() {
  return (
    <TextPage title="Privacy Policy" updated="1 November 2026">
      <p>
        This policy explains what happens to the files and information you give the PDF Quickly website (
        {site.url.replace("https://", "")}). The PDF Quickly Android app, which shows ads, has its own{" "}
        <Link href="/app-privacy">app privacy policy</Link>.
      </p>

      <h2>Your files</h2>
      <ul>
        <li>Files you add to a tool are uploaded over an encrypted HTTPS connection to private cloud storage.</li>
        <li>They are used only to produce the result you asked for. Nobody looks at them, and they are not used for any other purpose.</li>
        <li>Uploaded files and results are deleted automatically within 24 hours.</li>
        <li>Download links for results expire after 10 minutes.</li>
        <li>Passwords you enter in Unlock PDF are used once to open the file and are not stored.</li>
      </ul>

      <h2>Information we don&apos;t collect</h2>
      <p>
        You don&apos;t need an account, so we don&apos;t ask for your name, email address or any other personal details to use
        the tools.
      </p>

      <h2>Technical information</h2>
      <p>
        Like any website, our servers and hosting provider receive standard technical information when you visit, such as
        your IP address, browser type and the pages you request. This is used to keep the service running and secure.
      </p>

      <h2>Cookies</h2>
      <p>The PDF Quickly website doesn&apos;t show ads or use cookies for advertising or tracking.</p>

      <h2>Changes</h2>
      <p>If this policy changes, the new version will be posted on this page with a new date.</p>

      <h2>Contact</h2>
      <p>
        Questions about privacy: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </TextPage>
  );
}
