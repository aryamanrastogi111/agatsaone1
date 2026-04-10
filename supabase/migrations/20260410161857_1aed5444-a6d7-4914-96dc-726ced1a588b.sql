CREATE TABLE public.ai_analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggestion_outcomes jsonb DEFAULT NULL,
  overall_health text NOT NULL DEFAULT 'warning',
  headline text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ai_analysis_history"
  ON public.ai_analysis_history
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage ai_analysis_history"
  ON public.ai_analysis_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);