export type UserRole = "super_admin" | "owner" | "admin" | "manager" | "agent";

export interface SaasUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  businessId?: string; // Tenant association if not super_admin
  createdAt: string;
  lastLoginAt?: string;
}

export type BusinessStatus = "active" | "trial" | "suspended" | "pending";
export type PlanTier = "starter" | "growth" | "business" | "enterprise";

export interface PlanLimits {
  users: number;
  contacts: number;
  automations: number;
  monthlyMessages: number;
  campaignsPerMonth: number;
  whatsappNumbers: number;
  storageMb: number;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  limits: PlanLimits;
  features: string[];
  isActive: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  industry: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  googleBusinessUrl?: string;
  status: BusinessStatus;
  planId: string;
  planTier: PlanTier;
  trialEndsAt?: string;
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled" | "paused";
  whatsappConnected: boolean;
  whatsappNumber?: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface WhatsAppAccount {
  id: string;
  businessId: string;
  businessName: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  status: "CONNECTED" | "DISCONNECTED" | "PENDING_VERIFICATION" | "RATE_LIMITED";
  webhookStatus: "VERIFIED" | "FAILED" | "PENDING";
  lastSyncAt: string;
  messagingLimitTier: "TIER_250" | "TIER_1K" | "TIER_10K" | "TIER_100K" | "UNLIMITED";
  dailyMessagesSentToday: number;
  dailyMessagesLimit: number;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "quotation_sent" | "negotiation" | "won" | "lost";

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  source: string; // e.g. "WhatsApp Inbound", "Website Ad", "Google Maps", "Referral"
  industry?: string;
  requirement: string;
  status: LeadStatus;
  assignedToAgentId?: string;
  assignedToAgentName?: string;
  estimatedValue: number;
  tags: string[];
  lastContactAt: string;
  nextFollowUpAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  totalOrdersOrDeals?: number;
  totalSpent?: number;
  tags: string[];
  notes?: string;
  leadId?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Conversation {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSender: "customer" | "business" | "bot";
  unreadCount: number;
  status: "open" | "unread" | "assigned" | "follow_up" | "closed";
  assignedAgentId?: string;
  assignedAgentName?: string;
  leadStatus?: LeadStatus;
  tags: string[];
  notesCount: number;
  createdAt: string;
}

export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatMessage {
  id: string;
  conversationId: string;
  businessId: string;
  sender: "customer" | "agent" | "bot";
  senderName?: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  templateName?: string;
  mediaUrl?: string;
  mediaType?: "image" | "document" | "audio" | "video";
}

export type TemplateStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type TemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

export interface MessageTemplate {
  id: string;
  businessId: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  headerType?: "TEXT" | "IMAGE" | "DOCUMENT" | "NONE";
  headerText?: string;
  body: string;
  footer?: string;
  buttons?: Array<{
    type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    text: string;
    value?: string;
  }>;
  variables: string[]; // e.g. ["customer_name", "business_name", "appointment_date"]
  createdAt: string;
  metaTemplateId?: string;
  rejectionReason?: string;
}

export type AutomationTrigger =
  | "new_whatsapp_message"
  | "keyword"
  | "new_lead"
  | "new_customer"
  | "new_form_submission"
  | "time_date"
  | "followup_due"
  | "order_status"
  | "manual";

export type AutomationAction =
  | "send_whatsapp_message"
  | "send_template"
  | "ask_question"
  | "wait"
  | "condition"
  | "add_tag"
  | "remove_tag"
  | "assign_agent"
  | "create_lead"
  | "update_customer"
  | "create_followup"
  | "webhook"
  | "notify_admin";

export interface AutomationStep {
  id: string;
  type: "trigger" | "action" | "condition";
  actionType: AutomationAction | AutomationTrigger;
  title: string;
  config: Record<string, any>;
  nextStepId?: string;
  failureStepId?: string;
}

export interface Automation {
  id: string;
  businessId: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  triggerConfig: Record<string, any>;
  isActive: boolean;
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  steps: AutomationStep[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "paused";

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  templateId: string;
  templateName: string;
  targetAudience: string; // e.g. "VIP Customers", "High Value Leads (Won)"
  recipientCount: number;
  status: CampaignStatus;
  scheduledFor?: string;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  repliesCount: number;
  variables: Record<string, string>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Followup {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  leadId?: string;
  dueAt: string;
  notes: string;
  assignedAgentName: string;
  status: "pending" | "completed" | "overdue";
  createdAt: string;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  role: "owner" | "admin" | "manager" | "agent";
  status: "active" | "invited" | "deactivated";
  assignedConversationsCount: number;
  joinedAt: string;
}

export interface UsageRecord {
  businessId: string;
  month: string; // YYYY-MM
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  contactsTotal: number;
  automationsActive: number;
  campaignsRun: number;
  teamMembersCount: number;
  apiRequests: number;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  planName: string;
  date: string;
  dueDate: string;
  pdfUrl?: string;
  paymentMethod: string;
}

export interface PaymentTransaction {
  id: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: string;
  gateway: "PayU" | "Razorpay" | "Stripe" | "Manual";
  gatewayTransactionId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  businessId?: string;
  businessName?: string;
  action: string;
  ipAddress?: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  businessId: string;
  businessName: string;
  subject: string;
  category: "Billing" | "WhatsApp API" | "Automations" | "Templates" | "Other";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  lastReplyAt: string;
  messagesCount: number;
}
