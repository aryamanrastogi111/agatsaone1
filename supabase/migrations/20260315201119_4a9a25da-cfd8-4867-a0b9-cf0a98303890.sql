ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code text NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric NULL DEFAULT 0;