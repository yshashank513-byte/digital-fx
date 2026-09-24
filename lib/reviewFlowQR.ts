import QRCode from "qrcode";
import {
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_LOGO_DATA_URI,
} from "@/lib/companyBranding";

export interface QRCodeOptions {
  color?: string; // hex
  width?: number;
  margin?: number;
}

/**
 * Generates a clean, scannable QR Code PNG Data URL for a business URL.
 * Uses High Error Correction Level ('H') to ensure reliable scanning on iOS and Android.
 */
export async function generateQRCodeDataUrl(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { color = "#080d24", width = 512, margin = 1 } = options;
  return QRCode.toDataURL(url, {
    width,
    margin,
    color: {
      dark: color,
      light: "#ffffff",
    },
    errorCorrectionLevel: "H", // High error correction (30% redundancy)
  });
}

/**
 * Generates an SVG string representation of the raw QR Code.
 */
export async function generateQRCodeSVG(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { color = "#080d24", width = 512, margin = 1 } = options;
  return QRCode.toString(url, {
    type: "svg",
    width,
    margin,
    color: {
      dark: color,
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}

/**
 * Generates a professional, branded marketing QR card SVG.
 * Includes official Digital FX company logo at top, high-contrast QR with safe quiet zone in center,
 * and 'Managed by Digital FX • 📞 8860707797' footer branding.
 * Print-friendly, vector-scalable, and 100% self-contained.
 */
export async function generateBrandedQRCodeSVG(
  url: string,
  businessName?: string
): Promise<string> {
  // Generate high-resolution QR data URL with error correction H
  const qrDataUrl = await generateQRCodeDataUrl(url, {
    width: 600,
    margin: 1,
    color: "#080d24",
  });

  const subtitle = businessName ? `Rate ${businessName}` : "SCAN TO RATE YOUR EXPERIENCE";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 740" width="560" height="740">
  <defs>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#080d24" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Background Card with Clean White Finish & Rounded Corners -->
  <rect x="12" y="12" width="536" height="716" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#cardShadow)"/>

  <!-- Top Blue Brand Accent Stripe -->
  <rect x="40" y="16" width="480" height="4" rx="2" fill="#207de9"/>

  <!-- Official Company Logo at Top -->
  <image href="${COMPANY_LOGO_DATA_URI}" x="140" y="38" width="280" height="75" preserveAspectRatio="xMidYMid meet"/>

  <!-- Marketing Callout Badge -->
  <rect x="140" y="128" width="280" height="32" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  <text x="280" y="149" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#080d24" letter-spacing="0.5">${subtitle.toUpperCase()}</text>

  <!-- QR Container with Quiet Zone (No Finder Pattern Obstruction) -->
  <rect x="90" y="178" width="380" height="380" rx="20" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>

  <!-- High-Contrast QR Code Matrix (Error Correction Level H) -->
  <image href="${qrDataUrl}" x="110" y="198" width="340" height="340"/>

  <!-- Footer Branding Section -->
  <text x="280" y="594" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#64748b">Managed by</text>
  <text x="280" y="622" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#080d24" letter-spacing="-0.3">${COMPANY_NAME}</text>

  <!-- Centralized Company Phone Contact Pill -->
  <g transform="translate(165, 640)">
    <rect width="230" height="40" rx="20" fill="#080d24"/>
    <text x="115" y="25" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff">📞  ${COMPANY_PHONE}</text>
  </g>

  <!-- Verified Trust Microcopy -->
  <text x="280" y="706" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#94a3b8">Google Verified Reviews • Fast AI Feedback</text>
</svg>`;
}

/**
 * Returns the absolute short review URL for a given business ID.
 * Destination URL, routing, and tracking parameters remain 100% unchanged.
 */
export function getBusinessReviewUrl(businessId: string, origin?: string): string {
  const base = origin || process.env.NEXT_PUBLIC_SITE_URL || "https://www.digitalfx.in";
  return `${base.replace(/\/$/, "")}/r/${businessId}`;
}
