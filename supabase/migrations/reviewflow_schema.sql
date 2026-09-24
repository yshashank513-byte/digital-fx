-- ==============================================================================
-- ReviewFlow AI - Enterprise Database Schema for Google Review Automation
-- ==============================================================================

-- 1. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY, -- Slug or UUID (e.g. 'digital-fx')
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  address TEXT NOT NULL,
  city TEXT,
  phone TEXT,
  website TEXT,
  google_review_url TEXT NOT NULL,
  place_id TEXT,
  color TEXT DEFAULT '#207de9',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUESTION TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.question_templates (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'chips', -- 'chips', 'rating', 'text'
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QR CODES TABLE
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  qr_url TEXT NOT NULL,
  design_options JSONB DEFAULT '{"color": "#207de9", "logo": true}'::jsonb,
  scans_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEW SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.review_sessions (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  customer_rating INT,
  answers JSONB DEFAULT '{}'::jsonb,
  generated_draft TEXT,
  final_review_text TEXT,
  completed BOOLEAN DEFAULT false,
  clicked_google_review BOOLEAN DEFAULT false,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWFLOW ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.reviewflow_analytics (
  id BIGSERIAL PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'qr_scan', 'page_visit', 'draft_generated', 'google_click'
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON public.businesses(active);
CREATE INDEX IF NOT EXISTS idx_review_sessions_business ON public.review_sessions(business_id);
CREATE INDEX IF NOT EXISTS idx_review_sessions_created ON public.review_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_business_event ON public.reviewflow_analytics(business_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.reviewflow_analytics(created_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviewflow_analytics ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR ACTIVE BUSINESSES & TEMPLATES (FOR CUSTOMER REVIEW SCAN FLOW)
CREATE POLICY "Public read active businesses" ON public.businesses FOR SELECT USING (active = true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read templates" ON public.question_templates FOR SELECT USING (true);
CREATE POLICY "Public insert review sessions" ON public.review_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update own session" ON public.review_sessions FOR UPDATE USING (true);
CREATE POLICY "Public insert analytics" ON public.reviewflow_analytics FOR INSERT WITH CHECK (true);
