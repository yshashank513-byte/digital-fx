export interface EdgeAdminPayload {
  email: string;
  role: string;
  name?: string;
  exp: number;
}

export function getEdgeSigningSecret(): string {
  const envSecret =
    process.env.ADMIN_JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  return envSecret?.trim() || "";
}

function base64UrlToUint8Array(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) {
    b64 += "=";
  }
  // Standard atob is universally supported in Edge Runtime & modern Node.js
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlDecodeToString(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) {
    b64 += "=";
  }
  return atob(b64);
}

/**
 * Validates a signed admin session token in the Edge runtime using constant-time Web Crypto API.
 */
export async function verifySignedAdminTokenEdge(
  token: string,
  secretOverride?: string
): Promise<{ valid: boolean; payload?: EdgeAdminPayload }> {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false };
    }

    const [dataB64, sigB64] = parts;
    if (!dataB64 || !sigB64) {
      return { valid: false };
    }

    const secret = secretOverride || getEdgeSigningSecret();
    if (!secret || secret.length < 16) {
      return { valid: false };
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlToUint8Array(sigB64);
    const dataBytes = encoder.encode(dataB64);

    const isSigValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      dataBytes as unknown as BufferSource
    );

    if (!isSigValid) {
      return { valid: false };
    }

    const jsonStr = base64UrlDecodeToString(dataB64);
    const payload: EdgeAdminPayload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false }; // Expired
    }

    const email = payload.email?.toLowerCase().trim();
    if (email !== "yshashank513@gmail.com" && payload.role !== "admin") {
      return { valid: false }; // Non-admin role
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
