export type BusinessCategory =
  | "Packers & Movers"
  | "Jewellery Store"
  | "Restaurant"
  | "Salon"
  | "Hotel"
  | "Real Estate"
  | "Digital Marketing Agency"
  | "Automobile Dealer"
  | "Clothing Store"
  | "Electronics Store"
  | "Clinic"
  | "Education/Coaching"
  | "Local Services"
  | "Other";

export type QRStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "active"
  | "deactivated"
  | "rejected";

export interface QuestionTemplate {
  id: string;
  question: string;
  category: BusinessCategory;
  shortKey: string;
  type: "chips" | "rating" | "text";
  options: string[];
  placeholder?: string;
}

export interface BusinessProfile {
  id: string; // unique slug or identifier, e.g. "digital-fx" or "biz_abc123"
  qrId: string; // unique dynamic QR identifier, e.g. "rf_digital_fx" or "rf_9a2f1c"
  name: string;
  category: BusinessCategory;
  ownerName?: string;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  googleReviewUrl: string;
  placeId?: string;
  logoUrl?: string;
  brandColor?: string; // hex
  additionalNotes?: string;

  // Status & Approval workflow
  status: QRStatus;
  active: boolean; // true when status === 'active'
  submittedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  deactivatedReason?: string;
  deleted?: boolean; // soft-delete flag

  // Analytics
  totalScans: number;
  totalVisits: number;
  totalDrafts: number;
  totalGoogleClicks: number;

  createdAt: string;
  updatedAt: string;
}

export interface CustomerAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface ReviewSession {
  sessionId: string;
  businessId: string;
  category: BusinessCategory;
  customerRating: number; // 1-5
  answers: Record<string, string>;
  generatedDraft: string;
  finalReviewText: string;
  completed: boolean;
  clickedGoogleReview: boolean;
  createdAt: string;
}

export interface ReviewFlowAnalyticsSummary {
  totalBusinesses: number;
  totalQRCodes: number;
  pendingApprovals: number;
  activeQRCodes: number;
  deactivatedQRCodes: number;
  rejectedBusinesses: number;
  draftBusinesses: number;
  totalScans: number;
  totalVisits: number;
  totalDrafts: number;
  totalGoogleClicks: number;
  conversionRate: number; // (googleClicks / visits) * 100
  recentSessions: ReviewSession[];
  categoryBreakdown: Record<string, number>;
}
