import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputUrl = String(body?.url || "").trim();

    if (!inputUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Website URL is required.",
        },
        { status: 400 }
      );
    }

    let websiteUrl = inputUrl;

    if (
      !websiteUrl.startsWith("http://") &&
      !websiteUrl.startsWith("https://")
    ) {
      websiteUrl = `https://${websiteUrl}`;
    }

    try {
      new URL(websiteUrl);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid website URL.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // FETCH WEBSITE
    // =====================================================

    const startTime = Date.now();

    const response = await fetch(websiteUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DigitalFXChecker/1.0)",
        Accept:
          "text/html,application/xhtml+xml,text/html",
      },
      redirect: "follow",
      cache: "no-store",
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Website returned HTTP ${response.status}.`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();

    // =====================================================
    // BASIC HTML ANALYSIS
    // =====================================================

    const titleMatch = html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i
    );

    const descriptionMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
    );

    const viewportMatch = html.match(
      /<meta[^>]+name=["']viewport["'][^>]*>/i
    );

    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    );

    const robotsMatch = html.match(
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i
    );

    const h1Matches =
      html.match(/<h1\b[^>]*>/gi) || [];

    const imageMatches =
      html.match(/<img\b[^>]*>/gi) || [];

    const title = titleMatch
      ? titleMatch[1]
          .replace(/<[^>]+>/g, "")
          .trim()
      : "";

    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : "";

    const hasViewport = Boolean(viewportMatch);
    const hasCanonical = Boolean(canonicalMatch);
    const hasRobots = Boolean(robotsMatch);

    const h1Count = h1Matches.length;
    const imageCount = imageMatches.length;

    // =====================================================
    // IMAGE ALT
    // =====================================================

    let imagesWithoutAlt = 0;

    for (const image of imageMatches) {
      const altMatch = image.match(
        /\balt\s*=\s*["']([^"']*)["']/i
      );

      if (!altMatch || !altMatch[1].trim()) {
        imagesWithoutAlt++;
      }
    }

    // =====================================================
    // SEO SCORE
    // =====================================================

    let seo = 40;

    if (title) {
      seo += 15;
    }

    if (
      title.length >= 30 &&
      title.length <= 65
    ) {
      seo += 8;
    }

    if (description) {
      seo += 12;
    }

    if (
      description.length >= 120 &&
      description.length <= 170
    ) {
      seo += 5;
    }

    if (h1Count === 1) {
      seo += 10;
    }

    if (hasCanonical) {
      seo += 5;
    }

    if (hasRobots) {
      seo += 5;
    }

    seo = Math.min(100, seo);

    // =====================================================
    // MOBILE SCORE
    // =====================================================

    let mobile = 45;

    if (hasViewport) {
      mobile += 35;
    }

    if (html.length > 10000) {
      mobile += 5;
    }

    if (imageCount > 0) {
      mobile += 5;
    }

    if (html.includes("width=device-width")) {
      mobile += 5;
    }

    mobile = Math.min(100, mobile);

    // =====================================================
    // CONTENT SCORE
    // =====================================================

    let content = 45;

    if (title) {
      content += 10;
    }

    if (description) {
      content += 10;
    }

    if (h1Count > 0) {
      content += 15;
    }

    if (html.length > 20000) {
      content += 10;
    }

    content = Math.min(100, content);

    // =====================================================
    // PERFORMANCE SCORE
    // =====================================================

    let performance = 70;

    if (responseTime < 1000) {
      performance += 15;
    } else if (responseTime < 2000) {
      performance += 8;
    } else if (responseTime > 5000) {
      performance -= 20;
    } else if (responseTime > 3000) {
      performance -= 10;
    }

    if (html.length > 500000) {
      performance -= 20;
    } else if (html.length > 250000) {
      performance -= 10;
    }

    performance = Math.max(
      0,
      Math.min(100, performance)
    );

    // =====================================================
    // GEO SCORE
    // =====================================================

    const lowerHtml = html.toLowerCase();

    const geoKeywords = [
      "address",
      "location",
      "local",
      "service area",
      "city",
      "contact",
      "google",
      "business",
      "near me",
      "area served",
    ];

    let geoSignals = 0;

    for (const keyword of geoKeywords) {
      if (lowerHtml.includes(keyword)) {
        geoSignals++;
      }
    }

    let geo = 40 + geoSignals * 6;

    if (description) {
      geo += 5;
    }

    if (
      lowerHtml.includes("schema.org") ||
      lowerHtml.includes("localbusiness")
    ) {
      geo += 10;
    }

    geo = Math.min(100, geo);

    // =====================================================
    // OVERALL
    // =====================================================

    const overall = Math.round(
      (
        seo +
        performance +
        mobile +
        content +
        geo
      ) / 5
    );

    // =====================================================
    // RECOMMENDATIONS
    // =====================================================

    const recommendations: string[] = [];

    if (!title) {
      recommendations.push(
        "Add a unique and descriptive page title."
      );
    } else if (
      title.length < 30 ||
      title.length > 65
    ) {
      recommendations.push(
        "Optimize the page title length for better search visibility."
      );
    }

    if (!description) {
      recommendations.push(
        "Add a unique meta description to the page."
      );
    }

    if (h1Count === 0) {
      recommendations.push(
        "Add a clear primary H1 heading."
      );
    }

    if (h1Count > 1) {
      recommendations.push(
        "Review the page structure and keep one primary H1."
      );
    }

    if (!hasViewport) {
      recommendations.push(
        "Add a responsive viewport meta tag for mobile devices."
      );
    }

    if (imagesWithoutAlt > 0) {
      recommendations.push(
        `Add descriptive alt text to ${imagesWithoutAlt} image(s).`
      );
    }

    if (!hasCanonical) {
      recommendations.push(
        "Add a canonical URL for better technical SEO."
      );
    }

    if (!hasRobots) {
      recommendations.push(
        "Add a robots meta directive where appropriate."
      );
    }

    if (geo < 70) {
      recommendations.push(
        "Add stronger local business, location and service-area signals."
      );
    }

    if (performance < 70) {
      recommendations.push(
        "Improve page loading speed and reduce unnecessary page weight."
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Your basic website signals look healthy. Continue improving content and local relevance."
      );
    }

    // =====================================================
    // SAVE TO SUPABASE
    // =====================================================

    try {
      const { error: saveError } =
        await supabase
          .from("geo_analyses")
          .insert({
            url: websiteUrl,
            seo,
            performance,
            mobile,
            content,
            geo,
            overall,
            title,
            description,
            h1_count: h1Count,
            image_count: imageCount,
            images_without_alt:
              imagesWithoutAlt,
            has_viewport: hasViewport,
            has_canonical: hasCanonical,
            has_robots: hasRobots,
            response_time: responseTime,
            recommendations,
          });

      if (saveError) {
        console.error(
          "GEO SAVE ERROR:",
          saveError
        );
      }
    } catch (databaseError) {
      console.error(
        "GEO DATABASE ERROR:",
        databaseError
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      data: {
        url: websiteUrl,
        seo,
        performance,
        mobile,
        content,
        geo,
        overall,
        title,
        description,
        h1Count,
        imageCount,
        imagesWithoutAlt,
        hasViewport,
        hasCanonical,
        hasRobots,
        responseTime,
        recommendations,
      },
    });
  } catch (error) {
    console.error(
      "GEO CHECK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze this website.",
      },
      { status: 500 }
    );
  }
}