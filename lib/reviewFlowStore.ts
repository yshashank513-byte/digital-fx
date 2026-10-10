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
const TMP_FILE = path.join(process.platform === "win32" ? DATA_DIR : "/tmp", "reviewflow_store.json");

declare global {
  // eslint-disable-next-line no-var
  var _reviewFlowStore: StoreData | undefined;
}

const SEED_BUSINESSES: BusinessProfile[] = [
  {
    id: "digital-fx",
    qrId: "rf_b893bcd1",
    name: "DIGITAL FX",
    category: "Digital Marketing Agency",
    ownerName: "Shashank Yadav",
    phone: "1234567890",
    email: "yshashank513@gmail.com",
    address: "Second Floor, Orbit Plaza",
    city: "GHAZIABAD",
    state: "Uttar Pradesh",
    pincode: "201016",
    googleReviewUrl: "https://g.page/r/CUe2G4Eq9NQSEAE/review",
    logoUrl: "/icon.png",
    brandColor: "#207de9",
    qrStyle: "square",
    status: "active",
    active: true,
    totalScans: 48,
    totalVisits: 36,
    totalDrafts: 24,
    totalGoogleClicks: 18,
    createdAt: "2026-09-24T00:00:00.000Z",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  {
    id: "om-packers-and-movers",
    qrId: "rf_16984107",
    name: "OM PACKERS AND MOVERS",
    category: "Packers & Movers",
    ownerName: "Om Prakash",
    phone: "9876543210",
    email: "ompackers@gmail.com",
    address: "Plot 42, Sector 12",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    pincode: "201012",
    googleReviewUrl: "https://g.page/r/CUe2G4Eq9NQSEAI/review",
    brandColor: "#0284c7",
    qrStyle: "square",
    status: "active",
    active: true,
    totalScans: 22,
    totalVisits: 17,
    totalDrafts: 9,
    totalGoogleClicks: 6,
    createdAt: "2026-09-24T00:00:00.000Z",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  {
    id: "indus-iti",
    qrId: "rf_indus_iti",
    name: "Indus (Pvt) Industrial Training Institute",
    category: "Education/Coaching",
    ownerName: "Director, Indus ITI",
    phone: "+91 93198 07273",
    email: "info@indusiti.org",
    address: "Motihari, East Champaran, Bihar",
    city: "Motihari",
    state: "Bihar",
    pincode: "845401",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ_YsndWMzkzkRg5V8Y-kAQmQ",
    placeId: "ChIJ_YsndWMzkzkRg5V8Y-kAQmQ",
    logoUrl: "/indus-iti-logo.png",
    brandColor: "#0a3a78",
    qrStyle: "rounded",
    additionalNotes: "Indus (Pvt) Industrial Training Institute (IITI), Motihari Bihar. Leading technical ITI institute for trades like Electrician & Fitter.",
    status: "active",
    active: true,
    totalScans: 15,
    totalVisits: 12,
    totalDrafts: 7,
    totalGoogleClicks: 5,
    createdAt: "2026-10-10T12:00:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
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

let lastStoreFileMtime = 0;

function ensureStore(): StoreData {
  try {
    let filePath = STORE_FILE;
    if (process.platform !== "win32" && fs.existsSync(TMP_FILE)) {
      filePath = TMP_FILE;
    } else if (!fs.existsSync(STORE_FILE)) {
      if (fs.existsSync(TMP_FILE)) {
        filePath = TMP_FILE;
      } else {
        if (!fs.existsSync(DATA_DIR)) {
          try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
        }
        const initial: StoreData = { businesses: [], sessions: [] };
        try { fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8"); } catch {}
        globalThis._reviewFlowStore = initial;
        return initial;
      }
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (
        globalThis._reviewFlowStore &&
        Array.isArray(globalThis._reviewFlowStore.businesses) &&
        stats.mtimeMs <= lastStoreFileMtime
      ) {
        return globalThis._reviewFlowStore;
      }

      const rawContent = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(rawContent);
      const normalizedBusinesses: BusinessProfile[] = (parsed.businesses || []).map(normalizeBusiness);
      for (const seedBiz of SEED_BUSINESSES) {
        if (!normalizedBusinesses.some((b: BusinessProfile) => b.id === seedBiz.id)) {
          normalizedBusinesses.push(seedBiz);
        }
      }
      const store: StoreData = {
        businesses: normalizedBusinesses,
        sessions: parsed.sessions || [],
      };
      globalThis._reviewFlowStore = store;
      lastStoreFileMtime = stats.mtimeMs;
      return store;
    }

    if (globalThis._reviewFlowStore && Array.isArray(globalThis._reviewFlowStore.businesses)) {
      return globalThis._reviewFlowStore;
    }

    const fallback: StoreData = { businesses: SEED_BUSINESSES, sessions: [] };
    globalThis._reviewFlowStore = fallback;
    return fallback;
  } catch (err) {
    console.error("Error reading reviewflow store:", err);
    if (globalThis._reviewFlowStore && Array.isArray(globalThis._reviewFlowStore.businesses)) {
      return globalThis._reviewFlowStore;
    }
    const fallback: StoreData = { businesses: SEED_BUSINESSES, sessions: [] };
    globalThis._reviewFlowStore = fallback;
    return fallback;
  }
}

function saveStore(data: StoreData) {
  // Always update in-memory global cache first
  globalThis._reviewFlowStore = data;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
    }
    if (data.sessions.length > 500) {
      data.sessions = data.sessions.slice(0, 500);
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Fallback to serverless /tmp if project directory is read-only
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (tmpErr) {
      console.error("Error saving reviewflow store to disk & tmp:", err, tmpErr);
    }
  }
}

/**
 * Checks if a business with similar name or review URL already exists.
 */
export async function checkDuplicateBusiness(name: string, googleReviewUrl?: string, excludeId?: string): Promise<{ isDuplicate: boolean; matchedField?: string; matchedId?: string }> {
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
      matchedId: found.id,
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
    const bid = b.id.toLowerCase();
    const bqr = b.qrId.toLowerCase();
    const bname = b.name.toLowerCase();
    return (
      bid === clean ||
      bqr === clean ||
      bid.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "") ||
      bqr.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "") ||
      bname === clean ||
      (clean.includes("indus") && (bid.includes("indus") || bname.includes("indus")))
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

export async function deleteBusiness(id: string): Promise<boolean> {
  const store = ensureStore();
  const clean = id.trim().toLowerCase();
  let found = false;

  for (const b of store.businesses) {
    if (b.id.toLowerCase() === clean || b.qrId.toLowerCase() === clean) {
      b.deleted = true;
      b.status = "deactivated";
      b.active = false;
      b.updatedAt = new Date().toISOString();
      found = true;
    }
  }

  // Completely remove custom/user businesses; retain deleted mark for seed items to prevent resurrection
  store.businesses = store.businesses.filter((b) => {
    const isTarget = b.id.toLowerCase() === clean || b.qrId.toLowerCase() === clean;
    if (!isTarget) return true;
    const isSeed = SEED_BUSINESSES.some((s) => s.id.toLowerCase() === b.id.toLowerCase());
    return isSeed; // keep with deleted: true if seed
  });

  store.sessions = store.sessions.filter(
    (s) => s.businessId.toLowerCase() !== clean
  );

  if (found) {
    saveStore(store);
  }
  return found;
}

export async function clearAllReviewFlowData(): Promise<void> {
  const store: StoreData = {
    businesses: [],
    sessions: [],
  };
  saveStore(store);
}

export async function softDeleteBusiness(id: string): Promise<boolean> {
  return deleteBusiness(id);
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
