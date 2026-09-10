import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import dns from "dns/promises";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputUrl = String(body?.url || body?.website || "").trim();

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
    // REAL TECHNICAL INFRASTRUCTURE & DOMAIN DATA
    // =====================================================

    const parsedUrl = new URL(websiteUrl);
    const domainHost = parsedUrl.hostname.replace(/^www\./i, "");

    let serverIp = "Not resolved";
    let emailProvider = "Not configured";

    try {
      const ipResult = await dns.lookup(domainHost);
      serverIp = ipResult.address;
    } catch {}

    try {
      const mxRecords = await dns.resolveMx(domainHost);
      if (mxRecords && mxRecords.length > 0) {
        const mxHost = mxRecords[0].exchange.toLowerCase();
        if (mxHost.includes("google") || mxHost.includes("l.google.com")) {
          emailProvider = "Google Workspace";
        } else if (mxHost.includes("outlook") || mxHost.includes("microsoft")) {
          emailProvider = "Microsoft 365";
        } else if (mxHost.includes("zoho")) {
          emailProvider = "Zoho Mail";
        } else if (mxHost.includes("hostinger")) {
          emailProvider = "Hostinger Business Mail";
        } else if (mxHost.includes("godaddy") || mxHost.includes("secureserver")) {
          emailProvider = "GoDaddy Workspace";
        } else {
          emailProvider = mxRecords[0].exchange;
        }
      }
    } catch {}

    // =====================================================
    // REAL GOOGLE ANALYTICS & TAG MANAGER DETECTION
    // =====================================================

    const hasGa4 =
      /G-[A-Z0-9]{6,12}/i.test(html) ||
      /gtag\s*\(\s*["']config["']\s*,\s*["']G-/i.test(html);
    const hasGtm =
      /GTM-[A-Z0-9]{4,10}/i.test(html) ||
      /googletagmanager\.com\/gtm\.js/i.test(html);
    const hasLegacyUa = /UA-\d+-\d+/i.test(html);
    const analyticsIdMatch = html.match(
      /\b(G-[A-Z0-9]{6,12}|GTM-[A-Z0-9]{4,10}|UA-\d+-\d+)\b/i
    );
    const analyticsId = analyticsIdMatch ? analyticsIdMatch[1] : null;
    const hasAnalytics = Boolean(hasGa4 || hasGtm || hasLegacyUa);

    // =====================================================
    // REAL SCHEMA.ORG & REVIEW DATA EXTRACTION
    // =====================================================

    const jsonLdMatches =
      html.match(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
      ) || [];
    const detectedSchemas: string[] = [];
    let schemaRating: number | null = null;
    let schemaReviewCount: number | null = null;

    for (const tag of jsonLdMatches) {
      try {
        const jsonText = tag.replace(/<\/?script[^>]*>/gi, "").trim();
        const parsed = JSON.parse(jsonText);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item["@type"]) {
            detectedSchemas.push(String(item["@type"]));
          }
          if (
            item["@type"] === "AggregateRating" ||
            item.aggregateRating
          ) {
            const agg = item.aggregateRating || item;
            if (agg.ratingValue) schemaRating = Number(agg.ratingValue);
            if (agg.reviewCount) schemaReviewCount = Number(agg.reviewCount);
          }
        }
      } catch {}
    }

    // Google Maps link in HTML
    const mapsLinkMatch = html.match(
      /https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.google\.com|goo\.gl\/maps)[^\s"'<>]+/i
    );
    const googleMapsUrl = mapsLinkMatch ? mapsLinkMatch[0] : null;

    // Real content word count & H2 count
    const textOnly = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
    const h2Matches = html.match(/<h2\b[^>]*>/gi) || [];
    const h2Count = h2Matches.length;
    const isHttps = websiteUrl.startsWith("https://");

    // =====================================================
    // TRANCO GLOBAL TRAFFIC RANK (100% Free Open API)
    // =====================================================

    let trancoRank: number | null = null;
    try {
      const trancoRes = await fetch(
        `https://tranco-list.eu/api/ranks/domain/${domainHost}`,
        {
          signal: AbortSignal.timeout(2500),
        }
      );
      if (trancoRes.ok) {
        const trancoData = await trancoRes.json();
        if (
          Array.isArray(trancoData?.ranks) &&
          trancoData.ranks.length > 0
        ) {
          trancoRank = trancoData.ranks[0].rank;
        }
      }
    } catch {}

    // =====================================================
    // REAL GOOGLE PLACES / BUSINESS API INTEGRATION
    // =====================================================

    const googlePlacesKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
    let realGooglePlaces: {
      rating: number | null;
      reviewCount: number | null;
      status: string;
      source: string;
      address?: string;
      placeId?: string;
      url?: string;
    } = {
      rating: schemaRating,
      reviewCount: schemaReviewCount,
      status: schemaRating
        ? "Verified via Schema.org"
        : "Unlinked / Missing Review Schema",
      source: schemaRating ? "Website Schema.org" : "None",
      url: googleMapsUrl || undefined,
    };

    if (googlePlacesKey) {
      try {
        const brandSearch = title.split(/[|\-–]/)[0].trim() || domainHost;
        const placeSearchRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
            brandSearch + " " + (body?.city || "")
          )}&key=${googlePlacesKey}`,
          { signal: AbortSignal.timeout(3500) }
        );
        if (placeSearchRes.ok) {
          const placeData = await placeSearchRes.json();
          if (placeData.results && placeData.results.length > 0) {
            const topPlace = placeData.results[0];
            realGooglePlaces = {
              rating: topPlace.rating || schemaRating || null,
              reviewCount:
                topPlace.user_ratings_total || schemaReviewCount || null,
              status: topPlace.business_status || "OPERATIONAL",
              source: "Google Places API (Live)",
              address: topPlace.formatted_address,
              placeId: topPlace.place_id,
              url: `https://www.google.com/maps/place/?q=place_id:${topPlace.place_id}`,
            };
          }
        }
      } catch (err) {
        console.warn("Google Places API fetch error:", err);
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

    const customerName = String(body?.name || body?.customer_name || "").trim();
    const customerPhone = String(body?.phone || body?.customer_phone || "").trim();
    const customerEmail = String(body?.email || body?.customer_email || "").trim();
    const requestedService = String(body?.service || "GEO & AI Search Audit").trim();
    const analysisType = String(body?.analysis_type || "free").trim();
    const paymentStatus = analysisType === "paid" ? "paid" : "free";

    const aiAnalysisPayload = {
      customer_name: customerName || "Website Visitor",
      customer_phone: customerPhone || "",
      customer_email: customerEmail || "",
      service: requestedService,
      analysis_type: analysisType,
      analysis_status: "completed",
      payment_status: paymentStatus,
      overall_score: overall,
      seo_score: seo,
      geo_score: geo,
      mobile_score: mobile,
      performance_score: performance,
      created_at: new Date().toISOString(),
    };

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
            ai_analysis: aiAnalysisPayload,
          });

      if (saveError) {
        console.error(
          "GEO SAVE ERROR:",
          saveError
        );
      }

      // Also persist customer lead in enquiries so admin can track & follow up
      if (customerName || customerPhone || customerEmail) {
        await supabase.from("enquiries").insert({
          name: customerName || "Audit Visitor",
          phone: customerPhone || "Not Provided",
          email: customerEmail || null,
          service: `Free Website Analysis - ${requestedService}`,
          message: `Website: ${websiteUrl} | Overall Score: ${overall}/100 | SEO: ${seo}% | GEO: ${geo}% | Mobile: ${mobile}% | Speed: ${responseTime}ms`,
          status: "New",
        });
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
        realInfrastructure: {
          serverIp,
          emailProvider,
          isHttps,
          hasAnalytics,
          analyticsId,
        },
        realGooglePlaces,
        realContentStats: {
          wordCount,
          h1Count,
          h2Count,
          imageCount,
          imagesWithoutAlt,
        },
        detectedSchemas,
        trancoRank,
        googleMapsUrl,
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