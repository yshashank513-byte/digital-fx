import { NextResponse } from "next/server";
import { generateQRCodeDataUrl, generateQRCodeSVG, getBusinessReviewUrl } from "@/lib/reviewFlowQR";
import { getBusinessById } from "@/lib/reviewFlowStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId") || "digital-fx";
    const format = url.searchParams.get("format") || "json"; // 'json', 'svg', 'png'
    const color = url.searchParams.get("color") || "#080d24";

    const business = await getBusinessById(businessId);
    if (!business) {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    const reviewUrl = getBusinessReviewUrl(business.id, url.origin);

    if (format === "svg") {
      const svg = await generateQRCodeSVG(reviewUrl, { color, width: 400 });
      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${business.id}-review-qr.svg"`,
        },
      });
    }

    const dataUrl = await generateQRCodeDataUrl(reviewUrl, { color, width: 512 });

    if (format === "png") {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="${business.id}-review-qr.png"`,
        },
      });
    }

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
