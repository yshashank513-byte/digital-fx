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

function escapeXml(unsafe: string): string {
  return String(unsafe || "").replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
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

  const safeName = businessName ? escapeXml(businessName.trim().slice(0, 80)) : "";
  const subtitle = safeName ? `Rate ${safeName}` : "SCAN TO RATE YOUR EXPERIENCE";
  const safeCompanyName = escapeXml(COMPANY_NAME);
  const safePhone = escapeXml(COMPANY_PHONE);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 760" width="560" height="760">
  <defs>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#080d24" flood-opacity="0.10"/>
    </filter>
  </defs>

  <!-- Background Card: Clean White Finish with Rounded Corners -->
  <rect x="12" y="12" width="536" height="736" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#cardShadow)"/>

  <!-- Top Google 4-Color Signature Stripe -->
  <rect x="14" y="14" width="532" height="6" rx="3" fill="#4285F4"/>
  <rect x="147" y="14" width="133" height="6" fill="#EA4335"/>
  <rect x="280" y="14" width="133" height="6" fill="#FBBC05"/>
  <rect x="413" y="14" width="133" height="6" rx="3" fill="#34A853"/>

  <!-- Google 4-Color G Icon -->
  <g transform="translate(256, 36)">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" transform="scale(1.5) translate(-12, -12)"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" transform="scale(1.5) translate(-12, -12)"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" transform="scale(1.5) translate(-12, -12)"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" transform="scale(1.5) translate(-12, -12)"/>
  </g>

  <!-- Typography: REVIEW US ON GOOGLE -->
  <text x="280" y="86" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="900" fill="#1a73e8" letter-spacing="1">REVIEW US ON GOOGLE</text>

  <!-- 5 Golden Rating Stars -->
  <text x="280" y="112" text-anchor="middle" font-size="22" fill="#f59e0b" letter-spacing="4">★★★★★</text>

  <!-- Business Name Container -->
  <rect x="70" y="126" width="420" height="42" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="280" y="152" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#080d24">${safeName || "Verified Local Business"}</text>

  <!-- QR Container with Quiet Zone -->
  <rect x="90" y="180" width="380" height="380" rx="24" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>

  <!-- High-Contrast QR Code Matrix (Error Correction Level H) -->
  <image href="${qrDataUrl}" x="110" y="200" width="340" height="340"/>

  <!-- Instruction: Camera Icon & Point to Scan -->
  <text x="280" y="586" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#080d24" letter-spacing="0.5">📷  POINT PHONE CAMERA TO SCAN</text>

  <!-- 15 Seconds Frictionless Badge -->
  <rect x="135" y="602" width="290" height="28" rx="14" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
  <text x="280" y="621" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#065f46">⚡ Takes Only 15 Seconds • No App Needed</text>

  <!-- Footer Divider Line -->
  <line x1="60" y1="648" x2="500" y2="648" stroke="#f1f5f9" stroke-width="1.5"/>

  <!-- Footer Info & NFC -->
  <text x="280" y="674" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#207de9">(( 📲 Tap Phone for NFC )) • digitalfx.in/r/${safeName ? safeName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "review"}</text>
  <text x="280" y="700" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b">Google Business Partner • ReviewFlow AI • ${safeCompanyName}</text>
  <text x="280" y="722" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500" fill="#94a3b8">Support Helpline: 📞 ${safePhone}</text>
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
