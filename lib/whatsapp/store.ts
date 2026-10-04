import fs from "fs";
import path from "path";
import {
  Business,
  WhatsAppAccount,
  Lead,
  Customer,
  Conversation,
  ChatMessage,
  MessageTemplate,
  Automation,
  Campaign,
  Followup,
  TeamMember,
  UsageRecord,
  Invoice,
  PaymentTransaction,
  AuditLog,
  SupportTicket,
  Plan,
} from "./types";
import {
  INITIAL_PLANS,
  INITIAL_BUSINESSES,
  INITIAL_WHATSAPP_ACCOUNTS,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_TEMPLATES,
  INITIAL_AUTOMATIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_FOLLOWUPS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_USAGE,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUPPORT_TICKETS,
} from "./mockData";

export interface SaasStoreData {
  version: number;
  lastUpdated: string;
  plans: Plan[];
  businesses: Business[];
  whatsappAccounts: WhatsAppAccount[];
  leads: Lead[];
  customers: Customer[];
  conversations: Conversation[];
  messages: ChatMessage[];
  templates: MessageTemplate[];
  automations: Automation[];
  campaigns: Campaign[];
  followups: Followup[];
  teamMembers: TeamMember[];
  usage: UsageRecord[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
}

function getInitialStore(): SaasStoreData {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    plans: JSON.parse(JSON.stringify(INITIAL_PLANS)),
    businesses: JSON.parse(JSON.stringify(INITIAL_BUSINESSES)),
    whatsappAccounts: JSON.parse(JSON.stringify(INITIAL_WHATSAPP_ACCOUNTS)),
    leads: JSON.parse(JSON.stringify(INITIAL_LEADS)),
    customers: JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)),
    conversations: JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS)),
    messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
    templates: JSON.parse(JSON.stringify(INITIAL_TEMPLATES)),
    automations: JSON.parse(JSON.stringify(INITIAL_AUTOMATIONS)),
    campaigns: JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS)),
    followups: JSON.parse(JSON.stringify(INITIAL_FOLLOWUPS)),
    teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM_MEMBERS)),
    usage: JSON.parse(JSON.stringify(INITIAL_USAGE)),
    invoices: JSON.parse(JSON.stringify(INITIAL_INVOICES)),
    payments: JSON.parse(JSON.stringify(INITIAL_PAYMENTS)),
    auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
    supportTickets: JSON.parse(JSON.stringify(INITIAL_SUPPORT_TICKETS)),
  };
}

// In-memory singleton store for quick API calls
let memoryStore: SaasStoreData | null = null;

function getStoreFilePath(): string {
  // Check if running on Vercel (writable only in /tmp)
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const tmpDir = process.platform === "win32" ? process.env.TEMP || "C:\\Temp" : "/tmp";
    return path.join(tmpDir, "whatsapp_saas_store.json");
  }
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return path.join(dataDir, "whatsapp_saas_store.json");
}

export function loadStore(): SaasStoreData {
  if (memoryStore) {
    return memoryStore;
  }

  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (raw.trim()) {
        memoryStore = JSON.parse(raw);
        return memoryStore!;
      }
    }
  } catch (err) {
    console.warn("Could not load store from disk, initializing defaults:", err);
  }

  memoryStore = getInitialStore();
  persistStore(memoryStore);
  return memoryStore;
}

export function persistStore(store: SaasStoreData): void {
  memoryStore = store;
  store.lastUpdated = new Date().toISOString();
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write store to disk (ephemeral memory used):", err);
  }
}

export function resetDemoData(): SaasStoreData {
  memoryStore = getInitialStore();
  persistStore(memoryStore);
  return memoryStore;
}

// ==========================================
// TENANT SPECIFIC DATA SELECTORS & HELPERS
// ==========================================

export function getTenantData(businessId: string) {
  const store = loadStore();
  const business = store.businesses.find((b) => b.id === businessId) || store.businesses[0];
  const actualBusinessId = business.id;

  const whatsappAccount = store.whatsappAccounts.find((w) => w.businessId === actualBusinessId) || null;
  const leads = store.leads.filter((l) => l.businessId === actualBusinessId);
  const customers = store.customers.filter((c) => c.businessId === actualBusinessId);
  const conversations = store.conversations.filter((c) => c.businessId === actualBusinessId);
  const templates = store.templates.filter((t) => t.businessId === actualBusinessId);
  const automations = store.automations.filter((a) => a.businessId === actualBusinessId);
  const campaigns = store.campaigns.filter((c) => c.businessId === actualBusinessId);
  const followups = store.followups.filter((f) => f.businessId === actualBusinessId);
  const teamMembers = store.teamMembers.filter((t) => t.businessId === actualBusinessId);
  const usage = store.usage.find((u) => u.businessId === actualBusinessId) || {
    businessId: actualBusinessId,
    month: "2026-10",
    messagesSent: 0,
    messagesDelivered: 0,
    messagesFailed: 0,
    contactsTotal: customers.length,
    automationsActive: automations.filter((a) => a.isActive).length,
    campaignsRun: campaigns.length,
    teamMembersCount: teamMembers.length,
    apiRequests: 0,
    updatedAt: new Date().toISOString(),
  };

  const plan = store.plans.find((p) => p.id === business.planId) || store.plans[1];

  return {
    business,
    whatsappAccount,
    leads,
    customers,
    conversations,
    templates,
    automations,
    campaigns,
    followups,
    teamMembers,
    usage,
    plan,
    allBusinesses: store.businesses.map((b) => ({
      id: b.id,
      name: b.name,
      industry: b.industry,
      status: b.status,
      planTier: b.planTier,
      whatsappConnected: b.whatsappConnected,
      whatsappNumber: b.whatsappNumber,
    })),
  };
}

// ==========================================
// SUPER ADMIN SELECTORS & HELPERS
// ==========================================

export function getSuperAdminDashboardData() {
  const store = loadStore();

  const totalBusinesses = store.businesses.length;
  const activeBusinesses = store.businesses.filter((b) => b.status === "active").length;
  const trialBusinesses = store.businesses.filter((b) => b.status === "trial").length;
  const connectedWhatsapp = store.whatsappAccounts.filter((w) => w.status === "CONNECTED").length;

  let totalSent = 0;
  let totalDelivered = 0;
  let totalFailed = 0;
  store.usage.forEach((u) => {
    totalSent += u.messagesSent;
    totalDelivered += u.messagesDelivered;
    totalFailed += u.messagesFailed;
  });

  const activeAutomations = store.automations.filter((a) => a.isActive).length;

  // Calculate MRR from active businesses and plans
  let mrr = 0;
  store.businesses.forEach((b) => {
    if (b.status === "active" || b.subscriptionStatus === "active") {
      const plan = store.plans.find((p) => p.id === b.planId);
      if (plan) mrr += plan.priceMonthly;
    }
  });

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 98;

  return {
    metrics: {
      totalBusinesses,
      activeBusinesses,
      trialBusinesses,
      connectedWhatsappAccounts: connectedWhatsapp,
      messagesSent: totalSent,
      messagesDelivered: totalDelivered,
      messagesFailed: totalFailed,
      activeAutomations,
      mrr,
      newSignupsMonth: 3,
      churnedBusinesses: 0,
      deliveryRate,
    },
    businesses: store.businesses,
    whatsappAccounts: store.whatsappAccounts,
    plans: store.plans,
    invoices: store.invoices,
    payments: store.payments,
    auditLogs: store.auditLogs,
    supportTickets: store.supportTickets,
    growthChart: [
      { month: "May", businesses: 1, revenue: 29, messages: 1240 },
      { month: "Jun", businesses: 2, revenue: 108, messages: 3450 },
      { month: "Jul", businesses: 3, revenue: 307, messages: 9200 },
      { month: "Aug", businesses: 4, revenue: 506, messages: 18400 },
      { month: "Sep", businesses: 5, revenue: 805, messages: 32100 },
      { month: "Oct", businesses: 5, revenue: 805, messages: 45720 },
    ],
  };
}
