import { NextResponse, type NextRequest } from "next/server";

function base64UrlToUint8Array(b64url: string): Uint8Array {
  const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const raw = atob(base64 + pad);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

async function verifyTokenSignature(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [dataB64, signature] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlToUint8Array(signature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      encoder.encode(dataB64)
    );

    if (!isValid) return false;

    // Check expiration
    const payloadJson = atob(dataB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Intercept legacy standalone ReviewFlow dashboard and cleanly route into unified admin
  if (pathname === "/reviewflow/dashboard" || pathname.startsWith("/reviewflow/dashboard/")) {
    const targetUrl = new URL("/admin/reviewflow", request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 1. Protect administrative backend API endpoints against unauthenticated calls
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/auth/login";

  if (isAdminApi) {
    const authHeader = request.headers.get("authorization") || "";
    let token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      const cookie = request.cookies.get("admin_session_token");
      token = cookie?.value?.trim() || "";
    }

    let isAuthorized = false;

    if (token) {
      const signingSecret =
        process.env.ADMIN_JWT_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "";

      // If service role key matches directly
      if (
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        token === process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        isAuthorized = true;
      } else if (signingSecret) {
        isAuthorized = await verifyTokenSignature(token, signingSecret);
      } else {
        // Fallback: token present, let downstream API route perform Supabase verification
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrator session token required.",
        },
        { status: 401 }
      );
    }
  }

  // 2. Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Prevent clickjacking on admin routes completely (DENY) and prevent caching sensitive screens
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("Pragma", "no-cache");
  } else {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/reviewflow/dashboard",
    "/reviewflow/dashboard/:path*",
  ],
};
