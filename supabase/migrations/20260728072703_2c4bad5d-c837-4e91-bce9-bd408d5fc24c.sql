
ALTER TABLE public.visitor_sessions
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text;

ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text;

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_utm_source ON public.visitor_sessions (utm_source);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_started_at ON public.visitor_sessions (started_at DESC);
