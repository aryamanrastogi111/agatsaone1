
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city TEXT,
  ADD COLUMN IF NOT EXISTS shipping_state TEXT,
  ADD COLUMN IF NOT EXISTS shipping_pincode TEXT;
