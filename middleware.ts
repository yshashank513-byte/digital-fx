import { NextRequest, NextResponse } from "next/server";
import { verifySignedAdminTokenEdge } from "@/lib/edgeAdminAuth";

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/tenant/:path*",
    "/api/whatsapp/:path*",
    "/api/reviewflow/businesses",
    "/api/reviewflow/businesses/:path*",
  ],
};

function setNoCacheHeaders(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Whitelisted Public Sub-endpoints
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/auth/login";
  const isWhatsAppWebhook = pathname === "/api/whatsapp/webhook";

  if (isLoginApi || isWhatsAppWebhook) {
    return NextResponse.next();
  }

  // 2. Extract session token from HttpOnly cookie or Authorization header (Bearer)
  let token = request.cookies.get("admin_session_token")?.value || "";
  if (!token) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  // 3. Verify session token in Edge runtime
  const auth = await verifySignedAdminTokenEdge(token);
  const isAuthenticated = auth.valid;

  // 4. Handle Login Page Access
  if (isLoginPage) {
    if (isAuthenticated) {
      // Already logged in with a valid admin session -> redirect to /admin
      const adminUrl = new URL("/admin", request.url);
      const redirectRes = NextResponse.redirect(adminUrl);
      setNoCacheHeaders(redirectRes);
      return redirectRes;
    }
    // Unauthenticated user -> allow viewing the login form
    const nextRes = NextResponse.next();
    setNoCacheHeaders(nextRes);
    return nextRes;
  }

  // 5. Handle Protected Routes (Admin Pages, Dashboard Pages, Admin & Tenant APIs)
  if (!isAuthenticated) {
    const isApiRequest = pathname.startsWith("/api/");

    if (isApiRequest) {
      // API call: return strict 401 Unauthorized JSON
      const unauthorizedRes = NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing or invalid administrator credentials.",
        },
        { status: 401 }
      );
      setNoCacheHeaders(unauthorizedRes);
      return unauthorizedRes;
    }

    // Page navigation: redirect unauthenticated visitor immediately to /admin/login
    const loginUrl = new URL("/admin/login", request.url);
    const redirectRes = NextResponse.redirect(loginUrl);
    setNoCacheHeaders(redirectRes);

    // Invalidate any stale or corrupted cookie
    if (token) {
      redirectRes.cookies.set("admin_session_token", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return redirectRes;
  }

  // 6. User is authenticated -> proceed and append anti-cache security headers
  const response = NextResponse.next();
  setNoCacheHeaders(response);
  return response;
}
