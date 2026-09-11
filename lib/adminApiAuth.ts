import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function verifyAdminAuth(
  request: Request
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

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

  // If no bearer token provided, deny access immediately
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

  // Check against Supabase Service Role Key (for internal service calls)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey && token === serviceKey) {
    return { authorized: true };
  }

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

    return { authorized: true };
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
