import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  BusinessProfile,
  ReviewSession,
  ReviewFlowAnalyticsSummary,
  QRStatus,
  BusinessCategory,
} from "./reviewFlowTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "reviewflow_store.json");

const SEED_BUSINESSES: BusinessProfile[] = [
  {
    id: "digital-fx",
    qrId: "digital-fx",
    name: "Digital FX",
    category: "Digital Marketing Agency",
    ownerName: "Shashank Yadav",
    phone: "+91 93198 07273",
    email: "contact@digitalfx.in",
    website: "https://www.digitalfx.in",
    address: "Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    pincode: "201016",
    googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Digital+FX+Shop+No+210+Orbit+Plaza+Crossings+Republik+Ghaziabad",
    placeId: "",
    logoUrl: "/logo.png",
    brandColor: "#207de9",
    status: "active",
    active: true,
    totalScans: 248,
    totalVisits: 215,
    totalDrafts: 182,
    totalGoogleClicks: 146,
    approvalDate: "2026-09-01T10:00:00.000Z",
    deleted: false,
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-24T12:00:00.000Z",
  },
  {
    id: "speedy-packers",
    qrId: "speedy-packers",
    name: "Speedy Safe Packers & Movers",
    category: "Packers & Movers",
    ownerName: "Rajesh Kumar",
    phone: "+91 98712 34567",
    email: "support@speedypackers.in",
    website: "https://speedypackers.in",
    address: "Sector 62, Noida & Indirapuram, Ghaziabad",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJspeedy_packers_ncr",
    placeId: "ChIJspeedy_packers_ncr",
    logoUrl: "",
    brandColor: "#0284c7",
    status: "active",
    active: true,
    totalScans: 165,
    totalVisits: 142,
    totalDrafts: 119,
    totalGoogleClicks: 98,
    approvalDate: "2026-09-05T11:30:00.000Z",
    deleted: false,
    createdAt: "2026-09-05T11:30:00.000Z",
    updatedAt: "2026-09-23T16:00:00.000Z",
  },
  {
    id: "shree-jewellers",
    qrId: "shree-jewellers",
    name: "Shree Laxmi Jewellers",
    category: "Jewellery Store",
    ownerName: "Amit Verma",
    phone: "+91 98110 54321",
    email: "info@shreejewellers.in",
    website: "https://shreejewellers.in",
    address: "Main Market, RDC Raj Nagar, Ghaziabad",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    pincode: "201002",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJshree_jewellers_rdc",
    placeId: "ChIJshree_jewellers_rdc",
    logoUrl: "",
    brandColor: "#d97706",
    status: "active",
    active: true,
    totalScans: 312,
    totalVisits: 289,
    totalDrafts: 245,
    totalGoogleClicks: 210,
    approvalDate: "2026-09-10T09:15:00.000Z",
    deleted: false,
    createdAt: "2026-09-10T09:15:00.000Z",
    updatedAt: "2026-09-24T14:20:00.000Z",
  },
];

interface StoreData {
  businesses: BusinessProfile[];
  sessions: ReviewSession[];
}

function normalizeBusiness(raw: any): BusinessProfile {
  const activeStatus: QRStatus = raw.status || (raw.active ? "active" : "deactivated");
  const isActive = activeStatus === "active";

  return {
    id: String(raw.id || "").trim(),
    qrId: String(raw.qrId || raw.id || "").trim(),
    name: String(raw.name || "").trim(),
    category: (raw.category || "Other") as BusinessCategory,
    ownerName: raw.ownerName ? String(raw.ownerName).trim() : undefined,
    phone: String(raw.phone || "").trim(),
    email: raw.email ? String(raw.email).trim() : undefined,
    website: raw.website ? String(raw.website).trim() : undefined,
    address: String(raw.address || "").trim(),
    city: raw.city ? String(raw.city).trim() : undefined,
    state: raw.state ? String(raw.state).trim() : undefined,
    pincode: raw.pincode ? String(raw.pincode).trim() : undefined,
    googleReviewUrl: String(raw.googleReviewUrl || "").trim(),
    placeId: raw.placeId ? String(raw.placeId).trim() : undefined,
    logoUrl: raw.logoUrl ? String(raw.logoUrl).trim() : undefined,
    brandColor: raw.brandColor ? String(raw.brandColor).trim() : "#207de9",
    qrStyle: raw.qrStyle === "rounded" || raw.qrStyle === "circle" ? raw.qrStyle : "square",
    additionalNotes: raw.additionalNotes ? String(raw.additionalNotes).trim() : undefined,

    status: activeStatus,
    active: isActive,
    submittedBy: raw.submittedBy ? String(raw.submittedBy).trim() : undefined,
    approvalDate: raw.approvalDate ? String(raw.approvalDate).trim() : undefined,
    rejectionReason: raw.rejectionReason ? String(raw.rejectionReason).trim() : undefined,
    deactivatedReason: raw.deactivatedReason ? String(raw.deactivatedReason).trim() : undefined,
    deleted: Boolean(raw.deleted),

    totalScans: Number(raw.totalScans) || 0,
    totalVisits: Number(raw.totalVisits) || 0,
    totalDrafts: Number(raw.totalDrafts) || 0,
    totalGoogleClicks: Number(raw.totalGoogleClicks) || 0,

    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function ensureStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial: StoreData = {
        businesses: SEED_BUSINESSES,
        sessions: [
          {
            sessionId: "sess-seed-1",
            businessId: "digital-fx",
            category: "Digital Marketing Agency",
            customerRating: 5,
            answers: {
              growth: "Significant boost in leads & calls",
              technical: "Deep SEO & Ads expertise",
              reporting: "Transparent dashboard & reports",
            },
            generatedDraft: "Outstanding digital growth partner! The Digital FX team delivered a significant boost in leads and transparent reporting throughout. Highly recommended!",
            finalReviewText: "Outstanding digital growth partner! The Digital FX team delivered a significant boost in leads and transparent reporting throughout. Highly recommended!",
            completed: true,
            clickedGoogleReview: true,
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
        ],
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const normalizedBusinesses = (parsed.businesses || []).map(normalizeBusiness);
    return {
      businesses: normalizedBusinesses,
      sessions: parsed.sessions || [],
    };
  } catch (err) {
    console.error("Error reading reviewflow store:", err);
    return { businesses: SEED_BUSINESSES, sessions: [] };
  }
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Cap stored sessions to 500 to avoid unbounded disk growth
    if (data.sessions.length > 500) {
      data.sessions = data.sessions.slice(0, 500);
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving reviewflow store:", err);
  }
}

/**
 * Checks if a business with similar name or review URL already exists.
 */
export async function checkDuplicateBusiness(name: string, googleReviewUrl?: string, excludeId?: string): Promise<{ isDuplicate: boolean; matchedField?: string }> {
  const store = ensureStore();
  const cleanName = name.trim().toLowerCase();
  const cleanUrl = (googleReviewUrl || "").trim().toLowerCase();

  const found = store.businesses.find((b) => {
    if (b.deleted) return false;
    if (excludeId && b.id === excludeId) return false;

    if (b.name.trim().toLowerCase() === cleanName) {
      return true;
    }
    if (cleanUrl && b.googleReviewUrl && b.googleReviewUrl.trim().toLowerCase() === cleanUrl) {
      return true;
    }
    return false;
  });

  if (found) {
    return {
      isDuplicate: true,
      matchedField: found.name.trim().toLowerCase() === cleanName ? "Business Name" : "Google Review URL",
    };
  }

  return { isDuplicate: false };
}

export async function getAllBusinesses(options: {
  includeDeleted?: boolean;
  status?: string;
  search?: string;
} = {}): Promise<BusinessProfile[]> {
  const store = ensureStore();
  let list = store.businesses;

  if (!options.includeDeleted) {
    list = list.filter((b) => !b.deleted);
  }

  if (options.status && options.status !== "all") {
    const s = options.status.toLowerCase();
    list = list.filter((b) => b.status.toLowerCase() === s);
  }

  if (options.search) {
    const term = options.search.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term) ||
        (b.city && b.city.toLowerCase().includes(term)) ||
        (b.ownerName && b.ownerName.toLowerCase().includes(term)) ||
        (b.phone && b.phone.includes(term))
    );
  }

  return list;
}

export async function getBusinessById(idOrQrId: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const clean = idOrQrId.trim().toLowerCase();

  const found = store.businesses.find((b) => {
    if (b.deleted) return false;
    return (
      b.id.toLowerCase() === clean ||
      b.qrId.toLowerCase() === clean ||
      b.id.toLowerCase().replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
    );
  });

  return found || null;
}

export async function saveBusiness(
  business: Partial<BusinessProfile> & {
    name: string;
    category: BusinessCategory;
    googleReviewUrl: string;
  }
): Promise<BusinessProfile> {
  const store = ensureStore();
  const now = new Date().toISOString();

  // If ID provided and exists, update existing
  if (business.id) {
    const existingIdx = store.businesses.findIndex((b) => b.id === business.id);
    if (existingIdx >= 0) {
      const current = store.businesses[existingIdx];
      const updatedStatus: QRStatus = business.status || current.status || "active";
      const updated: BusinessProfile = {
        ...current,
        ...business,
        id: current.id,
        qrId: business.qrId || current.qrId || current.id,
        status: updatedStatus,
        active: updatedStatus === "active",
        deleted: business.deleted !== undefined ? business.deleted : current.deleted,
        updatedAt: now,
      };
      store.businesses[existingIdx] = updated;
      saveStore(store);
      return updated;
    }
  }

  // Create new business record
  const slugBase = business.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "business";

  // Ensure unique slug ID
  let id = slugBase;
  let counter = 1;
  while (store.businesses.some((b) => b.id === id)) {
    id = `${slugBase}-${counter}`;
    counter++;
  }

  const qrId = `rf_${crypto.randomBytes(4).toString("hex")}`;
  const initialStatus: QRStatus = business.status || "pending_approval";

  const created: BusinessProfile = {
    id,
    qrId,
    name: business.name.trim(),
    category: business.category,
    ownerName: business.ownerName?.trim() || undefined,
    phone: (business.phone || "").trim(),
    email: business.email?.trim() || undefined,
    website: business.website?.trim() || undefined,
    address: (business.address || "").trim(),
    city: business.city?.trim() || undefined,
    state: business.state?.trim() || undefined,
    pincode: business.pincode?.trim() || undefined,
    googleReviewUrl: business.googleReviewUrl.trim(),
    placeId: business.placeId?.trim() || undefined,
    logoUrl: business.logoUrl?.trim() || undefined,
    brandColor: business.brandColor || "#207de9",
    additionalNotes: business.additionalNotes?.trim() || undefined,

    status: initialStatus,
    active: initialStatus === "active",
    submittedBy: business.submittedBy || "Admin Console",
    approvalDate: initialStatus === "active" ? now : undefined,
    deleted: false,

    totalScans: 0,
    totalVisits: 0,
    totalDrafts: 0,
    totalGoogleClicks: 0,
    createdAt: now,
    updatedAt: now,
  };

  store.businesses.unshift(created);
  saveStore(store);
  return created;
}

export async function approveBusiness(id: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return null;

  const now = new Date().toISOString();
  biz.status = "active";
  biz.active = true;
  biz.approvalDate = now;
  biz.rejectionReason = undefined;
  biz.updatedAt = now;

  saveStore(store);
  return biz;
}

export async function rejectBusiness(id: string, reason?: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return null;

  const now = new Date().toISOString();
  biz.status = "rejected";
  biz.active = false;
  biz.rejectionReason = reason || "Rejected by administrator.";
  biz.updatedAt = now;

  saveStore(store);
  return biz;
}

export async function activateBusiness(id: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return null;

  const now = new Date().toISOString();
  biz.status = "active";
  biz.active = true;
  biz.deactivatedReason = undefined;
  biz.updatedAt = now;

  saveStore(store);
  return biz;
}

export async function deactivateBusiness(id: string, reason?: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return null;

  const now = new Date().toISOString();
  biz.status = "deactivated";
  biz.active = false;
  biz.deactivatedReason = reason || "Deactivated by administrator.";
  biz.updatedAt = now;

  saveStore(store);
  return biz;
}

export async function softDeleteBusiness(id: string): Promise<boolean> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return false;

  const now = new Date().toISOString();
  biz.deleted = true;
  biz.active = false;
  biz.updatedAt = now;

  saveStore(store);
  return true;
}

export async function regenerateBusinessQR(id: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === id);
  if (!biz) return null;

  const now = new Date().toISOString();
  biz.qrId = `rf_${crypto.randomBytes(4).toString("hex")}`;
  biz.updatedAt = now;

  saveStore(store);
  return biz;
}

export async function recordScan(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find(
    (b) => b.id === businessId || b.qrId === businessId
  );
  if (biz) {
    biz.totalScans += 1;
    saveStore(store);
  }
}

export async function recordVisit(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find(
    (b) => b.id === businessId || b.qrId === businessId
  );
  if (biz) {
    biz.totalVisits += 1;
    saveStore(store);
  }
}

export async function recordDraft(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find(
    (b) => b.id === businessId || b.qrId === businessId
  );
  if (biz) {
    biz.totalDrafts += 1;
    saveStore(store);
  }
}

export async function recordGoogleClick(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find(
    (b) => b.id === businessId || b.qrId === businessId
  );
  if (biz) {
    biz.totalGoogleClicks += 1;
    saveStore(store);
  }
}

export async function saveReviewSession(session: ReviewSession): Promise<void> {
  const store = ensureStore();
  const idx = store.sessions.findIndex((s) => s.sessionId === session.sessionId);
  if (idx >= 0) {
    store.sessions[idx] = session;
  } else {
    store.sessions.unshift(session);
  }
  saveStore(store);
}

export async function getAnalyticsSummary(): Promise<ReviewFlowAnalyticsSummary> {
  const store = ensureStore();
  const validBusinesses = store.businesses.filter((b) => !b.deleted);

  let totalScans = 0;
  let totalVisits = 0;
  let totalDrafts = 0;
  let totalGoogleClicks = 0;

  let pendingApprovals = 0;
  let activeQRCodes = 0;
  let deactivatedQRCodes = 0;
  let rejectedBusinesses = 0;
  let draftBusinesses = 0;

  const categoryBreakdown: Record<string, number> = {};

  for (const b of validBusinesses) {
    totalScans += b.totalScans || 0;
    totalVisits += b.totalVisits || 0;
    totalDrafts += b.totalDrafts || 0;
    totalGoogleClicks += b.totalGoogleClicks || 0;

    const st = b.status || (b.active ? "active" : "deactivated");
    if (st === "pending_approval") pendingApprovals++;
    else if (st === "active") activeQRCodes++;
    else if (st === "deactivated") deactivatedQRCodes++;
    else if (st === "rejected") rejectedBusinesses++;
    else if (st === "draft") draftBusinesses++;

    categoryBreakdown[b.category] = (categoryBreakdown[b.category] || 0) + 1;
  }

  const conversionRate =
    totalVisits > 0 ? Math.round((totalGoogleClicks / totalVisits) * 100) : 0;

  return {
    totalBusinesses: validBusinesses.length,
    totalQRCodes: validBusinesses.length,
    pendingApprovals,
    activeQRCodes,
    deactivatedQRCodes,
    rejectedBusinesses,
    draftBusinesses,
    totalScans,
    totalVisits,
    totalDrafts,
    totalGoogleClicks,
    conversionRate,
    recentSessions: store.sessions.slice(0, 10),
    categoryBreakdown,
  };
}
