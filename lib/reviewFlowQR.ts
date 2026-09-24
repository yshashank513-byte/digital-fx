import QRCode from "qrcode";

export interface QRCodeOptions {
  color?: string; // hex
  width?: number;
  margin?: number;
}

/**
 * Generates a clean, scannable QR Code PNG Data URL for a business URL.
 */
export async function generateQRCodeDataUrl(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { color = "#080d24", width = 512, margin = 2 } = options;
  return QRCode.toDataURL(url, {
    width,
    margin,
    color: {
      dark: color,
      light: "#ffffff",
    },
    errorCorrectionLevel: "H", // High error correction allows adding logo in center
  });
}

/**
 * Generates an SVG string representation of the QR Code for vector downloads.
 */
export async function generateQRCodeSVG(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { color = "#080d24", width = 512, margin = 2 } = options;
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
 * Returns the absolute short review URL for a given business ID.
 */
export function getBusinessReviewUrl(businessId: string, origin?: string): string {
  const base = origin || process.env.NEXT_PUBLIC_SITE_URL || "https://www.digitalfx.in";
  return `${base.replace(/\/$/, "")}/r/${businessId}`;
}
