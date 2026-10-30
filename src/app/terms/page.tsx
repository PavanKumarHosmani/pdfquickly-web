import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using PDF Quickly's free online PDF and image tools.",
  alternates: { canonical: "/terms" },
};

// Review this with your own legal advice before launch.
export default function TermsPage() {
  return (
    <TextPage title="Terms of Use" updated="29 October 2026">
      <p>By using PDF Quickly you agree to these terms.</p>

      <h2>Using the tools</h2>
      <ul>
        <li>The tools are free to use for personal and business purposes.</li>
        <li>Only upload files you own or have the right to use and change.</li>
        <li>Don&apos;t use the service for anything illegal, or try to disrupt or overload it.</li>
        <li>Unlock PDF only works with the file&apos;s current password. Use it only on files you are allowed to change.</li>
      </ul>

      <h2>Your content</h2>
      <p>You keep all rights to your files. We only process them to give you the result you asked for, then delete them.</p>

      <h2>No warranty</h2>
      <p>
        The service is provided as it is. We work to make the results accurate, but we can&apos;t guarantee every file will
        convert perfectly. Keep your original files, and check results before relying on them.
      </p>

      <h2>Limitation of liability</h2>
      <p>To the extent the law allows, PDF Quickly isn&apos;t liable for any loss arising from use of the service.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </TextPage>
  );
}
