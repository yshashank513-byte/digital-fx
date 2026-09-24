import fs from "fs";
import path from "path";
import { BusinessProfile, ReviewSession, ReviewFlowAnalyticsSummary } from "./reviewFlowTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "reviewflow_store.json");

const SEED_BUSINESSES: BusinessProfile[] = [
  {
    id: "digital-fx",
    name: "Digital FX",
    category: "Digital Marketing Agency",
    logoUrl: "/logo.png",
    address: "Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016",
    city: "Ghaziabad",
    phone: "+91 93198 07273",
    website: "https://www.digitalfx.in",
    googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Digital+FX+Shop+No+210+Orbit+Plaza+Crossings+Republik+Ghaziabad",
    placeId: "",
    brandColor: "#207de9",
    active: true,
    totalScans: 248,
    totalVisits: 215,
    totalDrafts: 182,
    totalGoogleClicks: 146,
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-24T12:00:00.000Z",
  },
  {
    id: "speedy-packers",
    name: "Speedy Safe Packers & Movers",
    category: "Packers & Movers",
    logoUrl: "",
    address: "Sector 62, Noida & Indirapuram, Ghaziabad",
    city: "Noida",
    phone: "+91 98712 34567",
    website: "https://speedypackers.in",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJspeedy_packers_ncr",
    placeId: "ChIJspeedy_packers_ncr",
    brandColor: "#0284c7",
    active: true,
    totalScans: 165,
    totalVisits: 142,
    totalDrafts: 119,
    totalGoogleClicks: 98,
    createdAt: "2026-09-05T11:30:00.000Z",
    updatedAt: "2026-09-23T16:00:00.000Z",
  },
  {
    id: "shree-jewellers",
    name: "Shree Laxmi Jewellers",
    category: "Jewellery Store",
    logoUrl: "",
    address: "Main Market, RDC Raj Nagar, Ghaziabad",
    city: "Ghaziabad",
    phone: "+91 98110 54321",
    website: "https://shreejewellers.in",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJshree_jewellers_rdc",
    placeId: "ChIJshree_jewellers_rdc",
    brandColor: "#d97706",
    active: true,
    totalScans: 312,
    totalVisits: 289,
    totalDrafts: 245,
    totalGoogleClicks: 210,
    createdAt: "2026-09-10T09:15:00.000Z",
    updatedAt: "2026-09-24T14:20:00.000Z",
  },
];

interface StoreData {
  businesses: BusinessProfile[];
  sessions: ReviewSession[];
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
    return JSON.parse(raw);
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
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving reviewflow store:", err);
  }
}

export async function getAllBusinesses(): Promise<BusinessProfile[]> {
  const store = ensureStore();
  return store.businesses;
}

export async function getBusinessById(id: string): Promise<BusinessProfile | null> {
  const store = ensureStore();
  const cleanId = id.trim().toLowerCase();
  const found = store.businesses.find(
    (b) => b.id.toLowerCase() === cleanId || b.id.toLowerCase().replace(/-/g, "") === cleanId.replace(/-/g, "")
  );
  return found || null;
}

export async function saveBusiness(business: Partial<BusinessProfile> & { name: string; category: any; googleReviewUrl: string }): Promise<BusinessProfile> {
  const store = ensureStore();
  const id = (business.id || business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-+|-+$/g, "");
  
  const existingIdx = store.businesses.findIndex((b) => b.id === id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const updated: BusinessProfile = {
      ...store.businesses[existingIdx],
      ...business,
      id,
      updatedAt: now,
    };
    store.businesses[existingIdx] = updated;
    saveStore(store);
    return updated;
  }

  const created: BusinessProfile = {
    id,
    name: business.name,
    category: business.category,
    logoUrl: business.logoUrl || "",
    address: business.address || "",
    city: business.city || "",
    phone: business.phone || "",
    website: business.website || "",
    googleReviewUrl: business.googleReviewUrl,
    placeId: business.placeId || "",
    brandColor: business.brandColor || "#207de9",
    active: true,
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

export async function recordScan(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === businessId);
  if (biz) {
    biz.totalScans += 1;
    saveStore(store);
  }
}

export async function recordVisit(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === businessId);
  if (biz) {
    biz.totalVisits += 1;
    saveStore(store);
  }
}

export async function recordDraft(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === businessId);
  if (biz) {
    biz.totalDrafts += 1;
    saveStore(store);
  }
}

export async function recordGoogleClick(businessId: string): Promise<void> {
  const store = ensureStore();
  const biz = store.businesses.find((b) => b.id === businessId);
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
  let totalScans = 0;
  let totalVisits = 0;
  let totalDrafts = 0;
  let totalGoogleClicks = 0;

  const categoryBreakdown: Record<string, number> = {};

  for (const b of store.businesses) {
    totalScans += b.totalScans;
    totalVisits += b.totalVisits;
    totalDrafts += b.totalDrafts;
    totalGoogleClicks += b.totalGoogleClicks;
    categoryBreakdown[b.category] = (categoryBreakdown[b.category] || 0) + 1;
  }

  const conversionRate = totalVisits > 0 ? Math.round((totalGoogleClicks / totalVisits) * 100) : 0;

  return {
    totalBusinesses: store.businesses.length,
    totalQRCodes: store.businesses.length,
    totalScans,
    totalVisits,
    totalDrafts,
    totalGoogleClicks,
    conversionRate,
    recentSessions: store.sessions.slice(0, 10),
    categoryBreakdown,
  };
}
