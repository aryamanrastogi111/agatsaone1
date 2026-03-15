
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'percentage',
  value numeric NOT NULL DEFAULT 0,
  minimum_order_amount numeric NOT NULL DEFAULT 0,
  maximum_discount_amount numeric NULL,
  usage_limit integer NULL,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can validate coupons"
  ON public.coupons FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

INSERT INTO public.coupons (code, type, value, minimum_order_amount, usage_limit, is_active, expires_at)
VALUES ('TEST10', 'fixed_amount', 9990, 0, 100, true, '2027-12-31 23:59:59+00')
ON CONFLICT (code) DO UPDATE SET value = 9990, is_active = true, usage_limit = 100;
