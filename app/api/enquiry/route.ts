import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`enquiry:${clientIp}`, {
      windowMs: 10 * 60 * 1000,
      max: 8,
    });

    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }

    const body = await request.json().catch(() => ({}));

    const name = String(body.name || "").trim().slice(0, 100);
    const phone = String(body.phone || "").trim().slice(0, 20);
    const email = String(body.email || "").trim().slice(0, 120);
    const service = String(body.service || "").trim().slice(0, 100);
    const message = String(body.message || "").trim().slice(0, 2000);
    const website = String(body.website || "").trim().slice(0, 255);
    const isProposal = Boolean(body.is_proposal);

    // Required fields
    if (!name || !phone || !service) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone number and service are required.",
        },
        { status: 400 }
      );
    }

    if (phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid contact phone number.",
        },
        { status: 400 }
      );
    }

    let finalService = service;
    if (isProposal && !finalService.startsWith("Strategic Proposal")) {
      finalService = `Strategic Proposal - ${service}`;
    }

    let finalMessage = message;
    if (website) {
      finalMessage = `Target Website: ${website}` + (message ? `\n\nRequirement Details:\n${message}` : "");
    }

    // Save enquiry to Supabase
    const { error } = await supabase
      .from("enquiries")
      .insert([
        {
          name,
          phone,
          email: email || null,
          service: finalService,
          message: finalMessage,
          status: "New",
        },
      ]);

    if (error) {
      console.error("Supabase enquiry error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to save enquiry at this time. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully. Our team will contact you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while submitting your enquiry.",
      },
      { status: 500 }
    );
  }
}