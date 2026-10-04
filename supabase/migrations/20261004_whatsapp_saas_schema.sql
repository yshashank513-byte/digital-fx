-- =========================================================================
-- B2B WhatsApp Automation SaaS Production Multi-Tenant Schema & RLS
-- =========================================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to extract tenant ID from JWT claims
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claim.business_id', true),
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'business_id')
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to check if current user is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(
      current_setting('request.jwt.claim.role', true),
      (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role')
    ) = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 1. PLANS
CREATE TABLE IF NOT EXISTS saas_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('starter', 'growth', 'business', 'enterprise')),
    price_monthly NUMERIC NOT NULL DEFAULT 0,
    price_annual NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BUSINESSES (TENANTS)
CREATE TABLE IF NOT EXISTS saas_businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    industry TEXT NOT NULL,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    google_business_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trial', 'suspended', 'pending')),
    plan_id TEXT REFERENCES saas_plans(id),
    plan_tier TEXT NOT NULL DEFAULT 'growth',
    trial_ends_at TIMESTAMPTZ,
    subscription_status TEXT NOT NULL DEFAULT 'active',
    whatsapp_connected BOOLEAN NOT NULL DEFAULT false,
    whatsapp_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WHATSAPP ACCOUNTS
CREATE TABLE IF NOT EXISTS saas_whatsapp_accounts (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    waba_id TEXT NOT NULL,
    phone_number_id TEXT NOT NULL,
    display_phone_number TEXT NOT NULL,
    verified_name TEXT NOT NULL,
    quality_rating TEXT NOT NULL DEFAULT 'GREEN',
    status TEXT NOT NULL DEFAULT 'CONNECTED',
    webhook_status TEXT NOT NULL DEFAULT 'VERIFIED',
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    messaging_limit_tier TEXT NOT NULL DEFAULT 'TIER_10K',
    daily_messages_sent_today INT NOT NULL DEFAULT 0,
    daily_messages_limit INT NOT NULL DEFAULT 10000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LEADS CRM
CREATE TABLE IF NOT EXISTS saas_leads (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    source TEXT NOT NULL DEFAULT 'WhatsApp Inbound',
    industry TEXT,
    requirement TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'quotation_sent', 'negotiation', 'won', 'lost')),
    assigned_to_agent_id TEXT,
    assigned_to_agent_name TEXT,
    estimated_value NUMERIC NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    last_contact_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_follow_up_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CUSTOMERS
CREATE TABLE IF NOT EXISTS saas_customers (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    total_orders_or_deals INT NOT NULL DEFAULT 0,
    total_spent NUMERIC NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    lead_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONVERSATIONS
CREATE TABLE IF NOT EXISTS saas_conversations (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_avatar TEXT,
    last_message TEXT NOT NULL,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_sender TEXT NOT NULL DEFAULT 'customer',
    unread_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'unread', 'assigned', 'follow_up', 'closed')),
    assigned_agent_id TEXT,
    assigned_agent_name TEXT,
    lead_status TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    notes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS saas_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES saas_conversations(id) ON DELETE CASCADE,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('customer', 'agent', 'bot')),
    sender_name TEXT,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    template_name TEXT,
    media_url TEXT,
    media_type TEXT
);

-- 8. MESSAGE TEMPLATES
CREATE TABLE IF NOT EXISTS saas_templates (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
    language TEXT NOT NULL DEFAULT 'en_US',
    status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
    header_type TEXT DEFAULT 'NONE',
    header_text TEXT,
    body TEXT NOT NULL,
    footer TEXT,
    buttons JSONB DEFAULT '[]'::jsonb,
    variables TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meta_template_id TEXT,
    rejection_reason TEXT
);

-- 9. AUTOMATIONS
CREATE TABLE IF NOT EXISTS saas_automations (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger TEXT NOT NULL,
    trigger_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    total_runs INT NOT NULL DEFAULT 0,
    success_runs INT NOT NULL DEFAULT 0,
    failed_runs INT NOT NULL DEFAULT 0,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CAMPAIGNS & BROADCASTS
CREATE TABLE IF NOT EXISTS saas_campaigns (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    template_name TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    recipient_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'completed', 'paused')),
    scheduled_for TIMESTAMPTZ,
    sent_count INT NOT NULL DEFAULT 0,
    delivered_count INT NOT NULL DEFAULT 0,
    read_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    replies_count INT NOT NULL DEFAULT 0,
    variables JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 11. FOLLOW-UPS
CREATE TABLE IF NOT EXISTS saas_followups (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    lead_id TEXT,
    due_at TIMESTAMPTZ NOT NULL,
    notes TEXT NOT NULL,
    assigned_agent_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TEAM MEMBERS (RBAC)
CREATE TABLE IF NOT EXISTS saas_team_members (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'agent')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'deactivated')),
    assigned_conversations_count INT NOT NULL DEFAULT 0,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. USAGE & LIMITS
CREATE TABLE IF NOT EXISTS saas_usage (
    business_id TEXT PRIMARY KEY REFERENCES saas_businesses(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    messages_sent INT NOT NULL DEFAULT 0,
    messages_delivered INT NOT NULL DEFAULT 0,
    messages_failed INT NOT NULL DEFAULT 0,
    contacts_total INT NOT NULL DEFAULT 0,
    automations_active INT NOT NULL DEFAULT 0,
    campaigns_run INT NOT NULL DEFAULT 0,
    team_members_count INT NOT NULL DEFAULT 0,
    api_requests INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. INVOICES & PAYMENTS
CREATE TABLE IF NOT EXISTS saas_invoices (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    plan_name TEXT NOT NULL,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    pdf_url TEXT,
    payment_method TEXT NOT NULL DEFAULT 'Credit Card'
);

CREATE TABLE IF NOT EXISTS saas_payments (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    gateway TEXT NOT NULL CHECK (gateway IN ('PayU', 'Razorpay', 'Stripe', 'Manual')),
    gateway_transaction_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS saas_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    business_id TEXT,
    business_name TEXT,
    action TEXT NOT NULL,
    ip_address TEXT,
    details TEXT NOT NULL
);

-- 16. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS saas_support_tickets (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES saas_businesses(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Billing', 'WhatsApp API', 'Automations', 'Templates', 'Other')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reply_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    messages_count INT NOT NULL DEFAULT 1
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict multi-tenant isolation
-- =========================================================================

-- Enable RLS on all tenant tables
ALTER TABLE saas_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_support_tickets ENABLE ROW LEVEL SECURITY;

-- 1. Businesses: Super Admin can see all, tenant can see only own record
CREATE POLICY tenant_isolation_businesses ON saas_businesses
    FOR ALL
    USING (is_super_admin() OR id = current_tenant_id());

-- 2. Generic tenant table policies
CREATE POLICY tenant_isolation_leads ON saas_leads
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_customers ON saas_customers
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_conversations ON saas_conversations
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_messages ON saas_messages
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_templates ON saas_templates
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_automations ON saas_automations
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_campaigns ON saas_campaigns
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_followups ON saas_followups
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_team ON saas_team_members
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_whatsapp ON saas_whatsapp_accounts
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_usage ON saas_usage
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_invoices ON saas_invoices
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_payments ON saas_payments
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

CREATE POLICY tenant_isolation_tickets ON saas_support_tickets
    FOR ALL
    USING (is_super_admin() OR business_id = current_tenant_id());

-- Index for high performance multi-tenant lookups
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON saas_leads(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON saas_customers(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON saas_conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_convo ON saas_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_templates_tenant ON saas_templates(business_id);
CREATE INDEX IF NOT EXISTS idx_automations_tenant ON saas_automations(business_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant ON saas_campaigns(business_id);
