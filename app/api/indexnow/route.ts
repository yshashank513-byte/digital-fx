import { NextResponse } from "next/server";
import { CANONICAL_LOCATION_SLUGS } from "@/lib/citySeoData";
import { BLOG_POSTS } from "@/lib/blogData";

const INDEXNOW_KEY = "dfx7e29b14c3894a0f684c9823eb512a";
const HOST = "www.digitalfx.in";

export async function GET() {
  const staticUrls = [
    `https://${HOST}`,
    `https://${HOST}/sitemap.xml`,
    `https://${HOST}/locations`,
    `https://${HOST}/global-markets`,
    `https://${HOST}/blog`,
    `https://${HOST}/privacy-policy`,
    `https://${HOST}/terms-and-conditions`,
    `https://${HOST}/refund-policy`,
  ];

  const blogUrls = BLOG_POSTS.map((post) => `https://${HOST}/blog/${post.slug}`);
  const locationUrls = CANONICAL_LOCATION_SLUGS.map((slug) => `https://${HOST}/locations/${slug}`);

  const urlList = Array.from(new Set([...staticUrls, ...blogUrls, ...locationUrls]));

  const results: Record<string, any> = {};

  // 1. Submit all canonical URLs to IndexNow (Bing, Yahoo, Seznam, AI search bots)
  try {
    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
    results.indexnow = {
      status: indexNowRes.status,
      message:
        indexNowRes.status === 200 || indexNowRes.status === 202
          ? "Successfully submitted all canonical location & blog URLs to IndexNow"
          : `IndexNow returned status ${indexNowRes.status}`,
    };
  } catch (err: any) {
    results.indexnow = { status: 500, error: err?.message || String(err) };
  }

  // 2. Ping Google Sitemap
  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=https://${HOST}/sitemap.xml`);
    results.google_ping = { status: googleRes.status };
  } catch (err: any) {
    results.google_ping = { status: "skipped_or_offline" };
  }

  // 3. Ping Bing Sitemap
  try {
    const bingRes = await fetch(`https://www.bing.com/ping?sitemap=https://${HOST}/sitemap.xml`);
    results.bing_ping = { status: bingRes.status };
  } catch (err: any) {
    results.bing_ping = { status: "skipped_or_offline" };
  }

  return NextResponse.json({
    success: true,
    totalUrlsSubmitted: urlList.length,
    timestamp: new Date().toISOString(),
    results,
  });
}

