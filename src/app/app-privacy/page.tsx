import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Android App Privacy Policy",
  description:
    "How the PDF Quickly Android app handles your files, photos and advertising data: what is collected, why, who it is shared with, and when it is deleted.",
  alternates: { canonical: "/app-privacy" },
};

// This is the privacy policy URL entered in Google Play Console, and it is linked from the app's menu.
// Keep it in step with the app and with the Play Console Data safety form: Google checks they match.
// Have it reviewed with your own legal advice before launch.
export default function AppPrivacyPage() {
  return (
    <TextPage title="Android App Privacy Policy" updated="1 November 2026">
      <p>
        This policy covers the <strong>PDF Quickly</strong> Android app (package
        <code> com.softcodeai.pdfquickly</code>), published on Google Play by SoftCodeAI (&quot;we&quot;). It explains what
        the app does with your information. For the pdfquickly.com website, see the{" "}
        <Link href="/privacy">website privacy policy</Link>.
      </p>

      <h2>Files and photos you choose to process</h2>
      <ul>
        <li>
          When you use a tool, the files you pick (PDFs and images) and any photos you take with the camera inside the app
          are uploaded over an encrypted HTTPS connection to our servers on Amazon Web Services in India (Mumbai region).
        </li>
        <li>They are used only to produce the result you asked for: converting, merging, splitting, compressing or unlocking.</li>
        <li>Nobody looks at your files, and they are not used for advertising, analytics or any other purpose.</li>
        <li>Uploaded files and results are deleted from our servers automatically within 24 hours. Download links stop working after 10 minutes.</li>
        <li>Passwords you type into Unlock PDF are used once to open that file and are never stored.</li>
        <li>
          Photos taken with the camera are kept in the app&apos;s private storage on your phone only until they are uploaded, and
          are removed automatically within a day. The app does not save them to your gallery.
        </li>
      </ul>

      <h2>Information we don&apos;t collect</h2>
      <p>
        The app has no accounts and never asks for your name, email address, phone number or location. It does not read your
        contacts, call logs or other files: it only sees the files you pick yourself, through Android&apos;s file picker.
      </p>

      <h2>Advertising</h2>
      <p>
        The app is free and shows banner ads provided by Google AdMob. To show and measure ads, and to prevent fraud, Google may
        collect and process information from your device, including:
      </p>
      <ul>
        <li>your device&apos;s advertising ID</li>
        <li>your IP address, and the approximate location derived from it</li>
        <li>device and app information, such as model, operating system and language</li>
        <li>how you interact with ads, such as views and taps</li>
      </ul>
      <p>
        In the European Economic Area, the UK and Switzerland, the app asks for your consent using Google&apos;s consent form
        before ads are personalised. You can change your choice at any time from the app&apos;s menu under &quot;Privacy and ad
        choices&quot;. Elsewhere, you can turn off personalised ads or delete your advertising ID in your phone&apos;s settings
        (Settings &gt; Google &gt; Ads, or Settings &gt; Privacy &gt; Ads, depending on your phone).
      </p>
      <p>
        Google&apos;s use of this data is described in{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
          How Google uses information from sites or apps that use its services
        </a>
        .
      </p>

      <h2>App updates</h2>
      <p>
        When the app opens, it asks Google Play whether a newer version is available so it can update. This check is handled by
        Google Play on your phone; we don&apos;t receive any information from it.
      </p>

      <h2>Who your data is shared with</h2>
      <ul>
        <li>
          <strong>Amazon Web Services</strong> hosts our servers and stores your files for processing, under our instructions.
        </li>
        <li>
          <strong>Google</strong> (AdMob) receives the advertising data described above.
        </li>
      </ul>
      <p>We do not sell your information.</p>

      <h2>Security</h2>
      <p>
        All data between the app and our servers is encrypted in transit with HTTPS. Files are kept in private storage that only
        our service can access, and only for as long as it takes to process them.
      </p>

      <h2>Children</h2>
      <p>The app is not directed at children under 13, and we do not knowingly collect information from them.</p>

      <h2>Deleting your data</h2>
      <p>
        Your files are deleted automatically within 24 hours, so there is nothing to request. Uninstalling the app removes
        everything it stored on your phone. For anything else, email us at the address below.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the new version will be posted on this page with a new date.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </TextPage>
  );
}
