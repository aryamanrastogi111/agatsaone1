
CREATE TABLE public.lose_belly_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  tier TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  second_person_name TEXT,
  second_person_phone TEXT,
  referral_code TEXT,
  quiz_answers JSONB,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lose_belly_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert enrollments"
ON public.lose_belly_enrollments FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins manage enrollments"
ON public.lose_belly_enrollments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages enrollments"
ON public.lose_belly_enrollments FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE TRIGGER update_lose_belly_enrollments_updated_at
BEFORE UPDATE ON public.lose_belly_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_lose_belly_phone ON public.lose_belly_enrollments(customer_phone);
CREATE INDEX idx_lose_belly_status ON public.lose_belly_enrollments(status);
