-- ==============================================================================
-- DATABASE SECURITY HARDENING: ROW LEVEL SECURITY (RLS) POLICIES
-- Prevents unauthorized public data dumping, tampering, or deletion
-- ==============================================================================

-- 1. HARDEN ENQUIRIES TABLE
ALTER TABLE IF EXISTS public.enquiries ENABLE ROW LEVEL SECURITY;

-- Revoke all direct permissions from anon on enquiries except INSERT
REVOKE SELECT, UPDATE, DELETE ON public.enquiries FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.enquiries FROM authenticated;

-- Drop any legacy insecure open policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.enquiries;
DROP POLICY IF EXISTS "Public select enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public delete enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.enquiries;
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;

-- Policy: Anyone can submit a new enquiry/lead via contact form
CREATE POLICY "Public insert enquiries"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only service_role (Next.js server-side backend) can read, update, or delete enquiries
CREATE POLICY "Service role full access on enquiries"
ON public.enquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 2. HARDEN PAYMENTS TABLE
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;

-- Revoke all direct client-side permissions on payments
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.payments FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.payments FROM authenticated;

-- Drop legacy open policies if present
DROP POLICY IF EXISTS "Enable read access for all users" ON public.payments;
DROP POLICY IF EXISTS "Public select payments" ON public.payments;
DROP POLICY IF EXISTS "Public insert payments" ON public.payments;

-- Policy: Strictly service_role can access and modify payments
CREATE POLICY "Service role full access on payments"
ON public.payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 3. HARDEN GEO_ANALYSES TABLE
ALTER TABLE IF EXISTS public.geo_analyses ENABLE ROW LEVEL SECURITY;

-- Revoke all direct client-side permissions
REVOKE SELECT, UPDATE, DELETE ON public.geo_analyses FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.geo_analyses FROM authenticated;

-- Drop legacy open policies if present
DROP POLICY IF EXISTS "Enable read access for all users" ON public.geo_analyses;
DROP POLICY IF EXISTS "Public select geo_analyses" ON public.geo_analyses;

-- Policy: Anyone can insert analysis result
CREATE POLICY "Public insert geo_analyses"
ON public.geo_analyses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Strictly service_role can manage and read past analyses
CREATE POLICY "Service role full access on geo_analyses"
ON public.geo_analyses
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
