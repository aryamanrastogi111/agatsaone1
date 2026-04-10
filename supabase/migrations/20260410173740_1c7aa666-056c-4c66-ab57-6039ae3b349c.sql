
-- Allow anonymous users to increment total_visitors via a secure function
CREATE OR REPLACE FUNCTION public.increment_daily_visitor(target_date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.daily_stats (stat_date, total_visitors)
  VALUES (target_date, 1)
  ON CONFLICT (stat_date)
  DO UPDATE SET total_visitors = daily_stats.total_visitors + 1;
END;
$$;
