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
  deleteBusiness,
  clearAllReviewFlowData,
  regenerateBusinessQR,
  checkDuplicateBusiness,
  getAnalyticsSummary,
} from "@/lib/reviewFlowStore";
import { verifyAdminAuth } from "@/lib/adminApiAuth";
import { BusinessCategory, QRStatus } from "@/lib/reviewFlowTypes";

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

    // Clean & normalize review URL
    let cleanReviewUrl = typeof googleReviewUrl === "string" ? googleReviewUrl.trim() : "";
    if (cleanReviewUrl && !cleanReviewUrl.startsWith("http://") && !cleanReviewUrl.startsWith("https://")) {
      cleanReviewUrl = `https://${cleanReviewUrl}`;
    }

    if (!cleanReviewUrl || !isValidUrl(cleanReviewUrl)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid HTTP/HTTPS Google Review URL." },
        { status: 400 }
      );
    }

    const cleanAddress = address && typeof address === "string" && address.trim().length >= 2
      ? address.trim()
      : (city ? `${city}, India` : "NCR, India");

    const cleanPhone = phone && typeof phone === "string" && phone.replace(/\D/g, "").length >= 10
      ? phone.trim()
      : "+91 93198 07273";

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

    // Duplicate Check: If exact business name exists and no ID provided, update it seamlessly
    const duplicateCheck = await checkDuplicateBusiness(name, cleanReviewUrl);
    let targetId = body.id || (duplicateCheck.isDuplicate && duplicateCheck.matchedField === "Business Name" ? duplicateCheck.matchedId : undefined);

    // Default status: Active for admin generation, unless draft or pending_approval explicitly requested
    const initialStatus: QRStatus =
      requestedStatus === "draft"
        ? "draft"
        : requestedStatus === "pending_approval"
        ? "pending_approval"
        : "active";

    const saved = await saveBusiness({
      id: targetId,
      name: name.trim(),
      category: category as BusinessCategory,
      ownerName: ownerName ? String(ownerName).trim() : undefined,
      phone: cleanPhone,
      email: email ? String(email).trim() : undefined,
      website: website ? String(website).trim() : undefined,
      address: cleanAddress,
      city: city ? String(city).trim() : undefined,
      state: state ? String(state).trim() : undefined,
      pincode: pincode ? String(pincode).trim() : undefined,
      googleReviewUrl: cleanReviewUrl,
      brandColor: brandColor || "#207de9",
      logoUrl: logoUrl ? String(logoUrl).trim() : undefined,
      qrStyle: qrStyle === "rounded" || qrStyle === "circle" ? qrStyle : "square",
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
      status: initialStatus,
    });

    return NextResponse.json({
      success: true,
      message:
        initialStatus === "active"
          ? "Business registered successfully and dynamic QR is active!"
          : initialStatus === "pending_approval"
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

    if (body.clearAll) {
      await clearAllReviewFlowData();
      return NextResponse.json({
        success: true,
        message: "All businesses and QR codes permanently deleted.",
      });
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Business ID is required." },
        { status: 400 }
      );
    }

    const success = await deleteBusiness(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Business not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business, QR code, and associated reviews permanently deleted.",
    });
  } catch (error: any) {
    console.error("DELETE BUSINESS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete business." },
      { status: 500 }
    );
  }
}
