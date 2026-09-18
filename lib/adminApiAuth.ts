import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export interface AdminPayload {
  email: string;
  role: string;
  name?: string;
  exp: number;
}

/**
 * Signs a tamper-proof admin session token valid for `maxAgeSeconds` (default 30 days).
 */
export function signAdminToken(
  payload: { email: string; role?: string; name?: string },
  maxAgeSeconds = 30 * 24 * 60 * 60
): string {
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "digitalfx_admin_secret_key_2026";
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const tokenData: AdminPayload = {
    email: payload.email.toLowerCase(),
    role: payload.role || "admin",
    name: payload.name || "Administrator",
    exp,
  };
  const dataB64 = Buffer.from(JSON.stringify(tokenData)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataB64)
    .digest("base64url");
  return `${dataB64}.${signature}`;
}

/**
 * Validates a signed admin session token.
 */
export function verifySignedAdminToken(token: string): {
  valid: boolean;
  payload?: AdminPayload;
} {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };
    const [dataB64, signature] = parts;
    const secret =
      process.env.SUPABASE_SERVICE_ROLE_KEY || "digitalfx_admin_secret_key_2026";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataB64)
      .digest("base64url");

    if (signature !== expectedSignature) return { valid: false };

    const payload: AdminPayload = JSON.parse(
      Buffer.from(dataB64, "base64url").toString("utf8")
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false }; // Expired
    }
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

/**
 * Extracts a cookie value by name from request headers.
 */
function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function verifyAdminAuth(
  request: Request
): Promise<{
  authorized: boolean;
  response?: NextResponse;
  user?: { email: string; role: string; name?: string };
}> {
  const authHeader = request.headers.get("authorization") || "";
  let token = authHeader.replace(/^Bearer\s+/i, "").trim();

  // Fallback to cookie if authorization header is absent
  if (!token) {
    token = getCookieValue(request, "admin_session_token") || "";
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !anonKey) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Authentication service unconfigured." },
        { status: 500 }
      ),
    };
  }

  // If no bearer token or cookie provided, deny access immediately
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing administrative credentials.",
        },
        { status: 401 }
      ),
    };
  }

  // Check 1: Direct match against Supabase Service Role Key (for internal service calls)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey && token === serviceKey) {
    return {
      authorized: true,
      user: { email: "yshashank513@gmail.com", role: "admin", name: "System Admin" },
    };
  }

  // Check 2: Valid signed Admin Token (30-day persistent session)
  const signedResult = verifySignedAdminToken(token);
  if (signedResult.valid && signedResult.payload) {
    const p = signedResult.payload;
    if (p.email === "yshashank513@gmail.com" || p.role === "admin") {
      return {
        authorized: true,
        user: { email: p.email, role: p.role, name: p.name },
      };
    }
  }

  // Check 3: Supabase JWT User session verification
  try {
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Unauthorized: Invalid or expired session token.",
          },
          { status: 401 }
        ),
      };
    }

    const userEmail = user.email?.toLowerCase();
    const userRole = user.user_metadata?.role;

    // Authorized administrator verification
    if (userEmail !== "yshashank513@gmail.com" && userRole !== "admin") {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Forbidden: Administrator privileges required.",
          },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user: {
        email: userEmail || "yshashank513@gmail.com",
        role: userRole || "admin",
        name: user.user_metadata?.name || "Shashank Yadav",
      },
    };
  } catch (err) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Authentication verification failed." },
        { status: 500 }
      ),
    };
  }
}
