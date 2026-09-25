import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import {
  generateQRCodeDataUrl,
  generateQRCodeSVG,
  generateBrandedQRCodeSVG,
  getBusinessReviewUrl,
} from "@/lib/reviewFlowQR";
import { getBusinessById } from "@/lib/reviewFlowStore";
import {
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_LOGO_DATA_URI,
} from "@/lib/companyBranding";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`qr-gen:${clientIp}`, {
      windowMs: 60 * 1000,
      max: 60,
    });
    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId") || "digital-fx";
    const format = url.searchParams.get("format") || "json"; // 'json', 'svg', 'png'
    const color = url.searchParams.get("color") || "#080d24";
    const isRaw = url.searchParams.get("raw") === "true";

    const business = await getBusinessById(businessId);
    if (!business) {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    const reviewUrl = getBusinessReviewUrl(business.id, url.origin);

    // 1. Vector SVG format
    if (format === "svg") {
      let svgContent: string;
      if (isRaw) {
        svgContent = await generateQRCodeSVG(reviewUrl, { color, width: 400 });
      } else {
        svgContent = await generateBrandedQRCodeSVG(reviewUrl, business.name);
      }

      return new Response(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${business.id}-review-qr.svg"`,
          "Cache-Control": "public, max-age=120",
        },
      });
    }

    // High-resolution QR matrix for PNG / JSON
    const dataUrl = await generateQRCodeDataUrl(reviewUrl, { color, width: 600, margin: 1 });

    // 2. High-Resolution PNG format
    if (format === "png") {
      if (isRaw) {
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        return new Response(buffer, {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition": `attachment; filename="${business.id}-review-qr.png"`,
          },
        });
      }

      // Professional Branded Marketing QR Card PNG
      const subtitle = business.name
        ? `Rate ${business.name}`
        : "SCAN TO RATE YOUR EXPERIENCE";

      try {
        const imgRes = new ImageResponse(
          (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
                padding: "36px 30px 30px 30px",
                fontFamily: "sans-serif",
              }}
            >
              {/* Header: Official Company Logo */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <img
                  src={COMPANY_LOGO_DATA_URI}
                  style={{ width: "260px", height: "70px", objectFit: "contain" }}
                  alt={COMPANY_NAME}
                />

                {/* Callout Instruction Badge */}
                <div
                  style={{
                    marginTop: "14px",
                    padding: "6px 20px",
                    borderRadius: "9999px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#080d24",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {subtitle}
                </div>
              </div>

              {/* Center: High-contrast QR with safe quiet zone */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  padding: "16px",
                  borderRadius: "20px",
                  border: "2px solid #f1f5f9",
                }}
              >
                <img
                  src={dataUrl}
                  style={{ width: "320px", height: "320px", objectFit: "contain" }}
                  alt="Review QR"
                />
              </div>

              {/* Footer: Managed by & Contact Phone */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>
                  Managed by
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#080d24",
                    letterSpacing: "-0.3px",
                    marginTop: "2px",
                  }}
                >
                  {COMPANY_NAME}
                </div>

                {/* Centralized Phone Contact Pill */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                    padding: "8px 24px",
                    borderRadius: "9999px",
                    backgroundColor: "#080d24",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "8px" }}
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {COMPANY_PHONE}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    marginTop: "10px",
                  }}
                >
                  Google Verified Reviews | Fast AI Feedback
                </div>
              </div>
            </div>
          ),
          {
            width: 560,
            height: 740,
          }
        );

        const arrayBuf = await imgRes.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuf);

        return new Response(uint8, {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition": `attachment; filename="${business.id}-review-qr.png"`,
            "Cache-Control": "public, max-age=120",
          },
        });
      } catch (pngErr) {
        console.error("ImageResponse error, falling back to dataUrl PNG:", pngErr);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        return new Response(buffer, {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition": `attachment; filename="${business.id}-review-qr.png"`,
          },
        });
      }
    }

    // 3. JSON format fallback
    return NextResponse.json({
      success: true,
      businessId: business.id,
      name: business.name,
      reviewUrl,
      qrDataUrl: dataUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate QR" },
      { status: 500 }
    );
  }
}
