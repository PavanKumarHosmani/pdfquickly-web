// Tells Bing (and other IndexNow engines: Yandex, Seznam, Naver) which URLs changed,
// so they recrawl in minutes instead of days. Google doesn't use IndexNow; it reads the sitemap.
//
//   npm run indexnow                 submit every URL in the live sitemap
//   npm run indexnow -- /merge-pdf   submit only these paths
//
// The key must match the file public/<key>.txt, which proves you own the site.

const SITE = "https://pdfquickly.com";
const KEY = process.env.INDEXNOW_KEY || "ad0747afef834b76ab11f31fe71da6f0";

const paths = process.argv.slice(2);
let urls;
if (paths.length) {
  urls = paths.map((p) => SITE + (p.startsWith("/") ? p : "/" + p));
} else {
  const res = await fetch(SITE + "/sitemap.xml");
  if (!res.ok) throw new Error("Couldn't read the sitemap (" + res.status + "). Is the site deployed?");
  urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: SITE + "/" + KEY + ".txt", urlList: urls }),
});

// 200 and 202 both mean accepted. 403 means the key file isn't reachable at keyLocation.
console.log("IndexNow: " + res.status + " for " + urls.length + " URL(s)");
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
