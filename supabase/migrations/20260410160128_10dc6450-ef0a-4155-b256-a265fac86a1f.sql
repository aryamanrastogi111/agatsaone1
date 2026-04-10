CREATE TABLE public.daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL UNIQUE,
  total_orders integer NOT NULL DEFAULT 0,
  total_revenue numeric NOT NULL DEFAULT 0,
  avg_order_value numeric NOT NULL DEFAULT 0,
  peak_visitors integer NOT NULL DEFAULT 0,
  peak_checkout_visitors integer NOT NULL DEFAULT 0,
  pending_payments integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage daily_stats"
  ON public.daily_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage daily_stats"
  ON public.daily_stats
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);