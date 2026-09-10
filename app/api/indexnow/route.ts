import { NextResponse } from "next/server";

const INDEXNOW_KEY = "dfx7e29b14c3894a0f684c9823eb512a";
const HOST = "www.digitalfx.in";

export async function GET() {
  const urlList = [
    "https://www.digitalfx.in",
    "https://www.digitalfx.in/sitemap.xml",
  ];

  const results: Record<string, any> = {};

  // 1. Submit to IndexNow (Bing, Yandex, Seznam, AI search bots)
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
      message: indexNowRes.status === 200 || indexNowRes.status === 202
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
    timestamp: new Date().toISOString(),
    results,
  });
}
