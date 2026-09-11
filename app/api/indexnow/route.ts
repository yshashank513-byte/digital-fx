import { NextResponse } from "next/server";

const INDEXNOW_KEY = "dfx7e29b14c3894a0f684c9823eb512a";
const HOST = "www.digitalfx.in";

export async function GET() {
  const urlList = [
    "https://www.digitalfx.in",
    "https://www.digitalfx.in/sitemap.xml",
    "https://www.digitalfx.in/locations",
    "https://www.digitalfx.in/blog",
    "https://www.digitalfx.in/privacy-policy",
    "https://www.digitalfx.in/terms-and-conditions",
    "https://www.digitalfx.in/refund-policy",
    // Core State Hubs
    "https://www.digitalfx.in/locations/uttar-pradesh",
    "https://www.digitalfx.in/locations/delhi",
    "https://www.digitalfx.in/locations/maharashtra",
    "https://www.digitalfx.in/locations/punjab",
    "https://www.digitalfx.in/locations/haryana",
    "https://www.digitalfx.in/locations/karnataka",
    // Top Strategic City Hubs
    "https://www.digitalfx.in/locations/ghaziabad",
    "https://www.digitalfx.in/locations/noida",
    "https://www.digitalfx.in/locations/mohali",
    "https://www.digitalfx.in/locations/mumbai",
    "https://www.digitalfx.in/locations/bengaluru",
    "https://www.digitalfx.in/locations/gurugram",
    "https://www.digitalfx.in/locations/lucknow",
    // Top Blog Insights
    "https://www.digitalfx.in/blog/google-maps-3-pack-domination-2026",
    "https://www.digitalfx.in/blog/geo-generative-engine-optimization-guide",
    "https://www.digitalfx.in/blog/zero-click-searches-ai-overviews-strategy",
  ];

  const results: Record<string, any> = {};

  // 1. Submit to IndexNow (Bing, Yahoo, Seznam, AI search bots)
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
          ? "Successfully submitted to IndexNow (Bing/Yahoo/AI Crawlers)"
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
