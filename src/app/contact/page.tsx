import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with PDF Quickly to report a problem or suggest a new tool.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <TextPage title="Contact">
      <p>Report a problem, suggest a tool or ask a question by email:</p>
      <p>
        <a href={`mailto:${site.contactEmail}`} className="text-xl font-semibold">
          {site.contactEmail}
        </a>
      </p>
      <p>
        If a file didn&apos;t convert as expected, tell us which tool you used and what went wrong. Please don&apos;t send
        the file itself if it contains private information.
      </p>
    </TextPage>
  );
}
