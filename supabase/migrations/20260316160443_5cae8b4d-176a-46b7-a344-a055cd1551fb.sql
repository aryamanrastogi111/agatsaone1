CREATE TABLE public.cart_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL UNIQUE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  email text,
  phone text,
  subtotal numeric NOT NULL DEFAULT 0,
  item_count integer NOT NULL DEFAULT 0,
  last_page text,
  converted_order_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert cart sessions"
  ON public.cart_sessions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Public can update cart sessions"
  ON public.cart_sessions FOR UPDATE TO public
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can read all cart sessions"
  ON public.cart_sessions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_cart_sessions_updated_at
  BEFORE UPDATE ON public.cart_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_sessions;