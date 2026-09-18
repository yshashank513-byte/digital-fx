import { NextResponse } from "next/server";
import { verifyAdminAuth, signAdminToken } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminAuth(request);

    if (!authResult.authorized) {
      return NextResponse.json(
        { authorized: false, error: "Administrative session invalid or expired." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      authorized: true,
      user: authResult.user,
    });

    // If authorized, ensure a fresh 30-day cookie is refreshed
    if (authResult.user) {
      const refreshedToken = signAdminToken(
        {
          email: authResult.user.email,
          role: authResult.user.role,
          name: authResult.user.name,
        },
        30 * 24 * 60 * 60
      );

      response.cookies.set("admin_session_token", refreshedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { authorized: false, error: "Session verification error." },
      { status: 500 }
    );
  }
}
