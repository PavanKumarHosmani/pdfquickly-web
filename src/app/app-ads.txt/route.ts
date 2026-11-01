// app-ads.txt for the PDF Quickly Android app (AdMob).
//
// AdMob only pays fully for ad requests from apps whose developer website lists the publisher here.
// pdfquickly.com must be the "Website" on the app's Google Play listing for AdMob to find it.
//
// Set ADMOB_PUBLISHER_ID in Vercel (Project > Settings > Environment Variables) to your AdMob
// publisher ID, e.g. pub-1234567890123456 (AdMob > Settings > Account information), then redeploy.
// Until it's set, this URL returns 404 rather than a wrong entry.

export const dynamic = "force-static";

// Google's certification authority ID, the same for every AdMob publisher.
const GOOGLE_TAG_ID = "f08c47fec0942fa0";

export function GET() {
  const publisherId = (process.env.ADMOB_PUBLISHER_ID ?? "").trim().replace(/^ca-app-/, "");
  if (!/^pub-\d{10,20}$/.test(publisherId)) {
    return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(`google.com, ${publisherId}, DIRECT, ${GOOGLE_TAG_ID}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
