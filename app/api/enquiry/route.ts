import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const service = String(body.service || "").trim();
    const message = String(body.message || "").trim();

    // Required fields
    if (!name || !phone || !service) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, phone number and service are required.",
        },
        { status: 400 }
      );
    }

    // Save enquiry to Supabase
    const { data, error } = await supabase
      .from("enquiries")
      .insert([
        {
          name,
          phone,
          email: email || null,
          service,
          message,
          status: "New",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Unable to save enquiry.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiry: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while submitting your enquiry.",
      },
      { status: 500 }
    );
  }
}