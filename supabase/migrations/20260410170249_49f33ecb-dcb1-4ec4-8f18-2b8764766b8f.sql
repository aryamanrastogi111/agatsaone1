
-- Add UTM columns to page_views
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_campaign text;

-- Session-level summary for audience quality
CREATE TABLE public.visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  page_count integer NOT NULL DEFAULT 1,
  entry_page text,
  exit_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,
  referrer text,
  UNIQUE(session_id)
);

CREATE INDEX idx_visitor_sessions_started ON public.visitor_sessions (started_at);
CREATE INDEX idx_visitor_sessions_utm ON public.visitor_sessions (utm_source, utm_medium);

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitor sessions"
  ON public.visitor_sessions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update visitor sessions"
  ON public.visitor_sessions FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Admins can read visitor sessions"
  ON public.visitor_sessions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages visitor sessions"
  ON public.visitor_sessions FOR ALL TO service_role
  USING (true) WITH CHECK (true);
