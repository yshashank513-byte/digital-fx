import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { signAdminToken } from "@/lib/adminApiAuth";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limiting: Max 5 failed/total login attempts per 15 minutes per IP to block brute force
    const rateLimit = checkRateLimit(`login:${clientIp}`, {
      windowMs: 15 * 60 * 1000,
      max: 8,
    });

    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }

    const body = await request.json().catch(() => ({}));
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    // Input length sanity bounds to avoid regex DoS or memory attacks
    if (cleanEmail.length > 120 || cleanPassword.length > 128 || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid administrative credentials." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { success: false, error: "Authentication service not configured." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (authError || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid administrative credentials. Please check your email and password.",
        },
        { status: 401 }
      );
    }

    const userEmail = data.user.email?.toLowerCase();
    const userRole = data.user.user_metadata?.role;

    if (userEmail !== "yshashank513@gmail.com" && userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. Administrator privileges required.",
        },
        { status: 403 }
      );
    }

    // 30 days if remember is selected, otherwise 7 days
    const maxAgeSeconds = remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    const safeEmail = userEmail || cleanEmail;
    const adminToken = signAdminToken(
      {
        email: safeEmail,
        role: userRole || "admin",
        name: data.user.user_metadata?.name || "Shashank Yadav",
      },
      maxAgeSeconds
    );

    const response = NextResponse.json({
      success: true,
      token: adminToken,
      user: {
        email: safeEmail,
        role: userRole || "admin",
        name: data.user.user_metadata?.name || "Shashank Yadav",
      },
      supabaseSession: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });

    // Set secure HTTP-only cookie with SameSite protection
    response.cookies.set("admin_session_token", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
