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
  id: string; // slug, e.g. "digital-fx"
  name: string;
  category: BusinessCategory;
  logoUrl?: string;
  address: string;
  city?: string;
  phone?: string;
  website?: string;
  googleReviewUrl: string;
  placeId?: string;
  brandColor?: string; // hex
  active: boolean;
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
  totalScans: number;
  totalVisits: number;
  totalDrafts: number;
  totalGoogleClicks: number;
  conversionRate: number; // (googleClicks / visits) * 100
  recentSessions: ReviewSession[];
  categoryBreakdown: Record<string, number>;
}
