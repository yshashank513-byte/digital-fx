import { NextResponse } from "next/server";
import {
  getAllBusinesses,
  getBusinessById,
  saveBusiness,
  approveBusiness,
  rejectBusiness,
  activateBusiness,
  deactivateBusiness,
  softDeleteBusiness,
  regenerateBusinessQR,
  checkDuplicateBusiness,
  getAnalyticsSummary,
} from "@/lib/reviewFlowStore";
import { verifyAdminAuth } from "@/lib/adminApiAuth";
import { BusinessCategory } from "@/lib/reviewFlowTypes";

export const dynamic = "force-dynamic";

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withAnalytics = url.searchParams.get("analytics") === "true";
    const status = url.searchParams.get("status") || "all";
    const search = url.searchParams.get("search") || "";
    const id = url.searchParams.get("id");

    if (id) {
      const biz = await getBusinessById(id);
      if (!biz) {
        return NextResponse.json(
          { success: false, error: "Business not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, business: biz });
    }

    const businesses = await getAllBusinesses({ status, search });

    if (withAnalytics) {
      const summary = await getAnalyticsSummary();
      return NextResponse.json({
        success: true,
        businesses,
        analytics: summary,
      });
    }

    return NextResponse.json({ success: true, businesses });
  } catch (error: any) {
    console.error("GET BUSINESSES ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load businesses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      category,
      ownerName,
      phone,
      email,
      website,
      address,
      city,
      state,
      pincode,
      googleReviewUrl,
      brandColor,
      additionalNotes,
      status: requestedStatus,
      logoUrl,
      qrStyle,
    } = body;

    // Required Field Validations
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Business Name is required." },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json(
        { success: false, error: "Business Category is required." },
        { status: 400 }
      );
    }

    if (!googleReviewUrl || typeof googleReviewUrl !== "string" || !googleReviewUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Google Business Profile or Review URL is required." },
        { status: 400 }
      );
    }

    if (!isValidUrl(googleReviewUrl.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid HTTP/HTTPS Google Review URL." },
        { status: 400 }
      );
    }

    if (!address || typeof address !== "string" || address.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "Complete Business Address is required (min 4 characters)." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: "A valid contact mobile number (minimum 10 digits) is required." },
        { status: 400 }
      );
    }

    if (email && typeof email === "string" && email.trim() && !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (website && typeof website === "string" && website.trim() && !isValidUrl(website.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid website URL (including https://)." },
        { status: 400 }
      );
    }

    // Duplicate Business Detection
    const duplicateCheck = await checkDuplicateBusiness(name, googleReviewUrl);
    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `A business with this ${duplicateCheck.matchedField} already exists in the system.`,
        },
        { status: 409 }
      );
    }

    // Default status: Pending Approval (or Draft if explicitly requested)
    const initialStatus = requestedStatus === "draft" ? "draft" : "pending_approval";

    const saved = await saveBusiness({
      name: name.trim(),
      category: category as BusinessCategory,
      ownerName: ownerName ? String(ownerName).trim() : undefined,
      phone: phone.trim(),
      email: email ? String(email).trim() : undefined,
      website: website ? String(website).trim() : undefined,
      address: address.trim(),
      city: city ? String(city).trim() : undefined,
      state: state ? String(state).trim() : undefined,
      pincode: pincode ? String(pincode).trim() : undefined,
      googleReviewUrl: googleReviewUrl.trim(),
      brandColor: brandColor || "#207de9",
      logoUrl: logoUrl ? String(logoUrl).trim() : undefined,
      qrStyle: qrStyle === "rounded" || qrStyle === "circle" ? qrStyle : "square",
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
      status: initialStatus,
    });

    return NextResponse.json({
      success: true,
      message:
        initialStatus === "pending_approval"
          ? "Business registered successfully and queued for approval."
          : "Business draft saved successfully.",
      business: saved,
    });
  } catch (error: any) {
    console.error("POST BUSINESS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create business profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Authenticate Admin
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response || NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const id = String(body.id || body.businessId || "").trim();
    const { action, reason, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Business ID is required." },
        { status: 400 }
      );
    }

    const existing = await getBusinessById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Business not found." },
        { status: 404 }
      );
    }

    // 1. Status Actions
    if (action === "approve") {
      const updated = await approveBusiness(id);
      return NextResponse.json({
        success: true,
        message: "Business approved. Dynamic QR is now active.",
        business: updated,
      });
    }

    if (action === "reject") {
      const updated = await rejectBusiness(id, reason);
      return NextResponse.json({
        success: true,
        message: "Business registration rejected.",
        business: updated,
      });
    }

    if (action === "activate") {
      const updated = await activateBusiness(id);
      return NextResponse.json({
        success: true,
        message: "Business QR reactivated successfully.",
        business: updated,
      });
    }

    if (action === "deactivate") {
      const updated = await deactivateBusiness(id, reason);
      return NextResponse.json({
        success: true,
        message: "Business QR deactivated.",
        business: updated,
      });
    }

    if (action === "regenerate_qr") {
      const updated = await regenerateBusinessQR(id);
      return NextResponse.json({
        success: true,
        message: "New dynamic QR identifier generated successfully.",
        business: updated,
      });
    }

    // 2. Direct Field Edit
    if (updates.name && updates.name !== existing.name) {
      const dup = await checkDuplicateBusiness(updates.name, updates.googleReviewUrl, id);
      if (dup.isDuplicate) {
        return NextResponse.json(
          { success: false, error: `A business with this ${dup.matchedField} already exists.` },
          { status: 409 }
        );
      }
    }

    if (updates.googleReviewUrl && !isValidUrl(updates.googleReviewUrl)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Google Review URL." },
        { status: 400 }
      );
    }

    const saved = await saveBusiness({
      ...existing,
      ...updates,
      id,
    });

    return NextResponse.json({
      success: true,
      message: "Business updated successfully.",
      business: saved,
    });
  } catch (error: any) {
    console.error("PATCH BUSINESS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update business." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response || NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Business ID is required." },
        { status: 400 }
      );
    }

    const success = await softDeleteBusiness(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Business not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business and QR code removed safely.",
    });
  } catch (error: any) {
    console.error("DELETE BUSINESS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete business." },
      { status: 500 }
    );
  }
}
