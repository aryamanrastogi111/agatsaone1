CREATE TABLE public.nera_ai_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid,
  email text,
  phone text,
  plan text NOT NULL DEFAULT 'premium',
  duration_days integer NOT NULL DEFAULT 90,
  activated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  source text NOT NULL DEFAULT 'complete_kit_bundle',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nera_ai_grants TO authenticated;
GRANT ALL ON public.nera_ai_grants TO service_role;

ALTER TABLE public.nera_ai_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own grants by email"
ON public.nera_ai_grants FOR SELECT
TO authenticated
USING (email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid()));

CREATE TRIGGER update_nera_ai_grants_updated_at
BEFORE UPDATE ON public.nera_ai_grants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_nera_ai_grants_email ON public.nera_ai_grants(email);
CREATE INDEX idx_nera_ai_grants_phone ON public.nera_ai_grants(phone);
CREATE INDEX idx_nera_ai_grants_order_id ON public.nera_ai_grants(order_id);