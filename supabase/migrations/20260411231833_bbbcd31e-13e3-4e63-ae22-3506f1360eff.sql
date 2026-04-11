CREATE TABLE public.heritage_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  session_id TEXT,
  landed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  clicked_store TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.heritage_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert heritage visits"
ON public.heritage_visits
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can read heritage visits"
ON public.heritage_visits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage heritage visits"
ON public.heritage_visits
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages heritage visits"
ON public.heritage_visits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_heritage_visits_email ON public.heritage_visits (email);
CREATE INDEX idx_heritage_visits_landed_at ON public.heritage_visits (landed_at);