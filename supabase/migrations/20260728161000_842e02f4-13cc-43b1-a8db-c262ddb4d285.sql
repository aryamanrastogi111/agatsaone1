CREATE POLICY "Public can read visitor cart sessions for upsert"
  ON public.cart_sessions
  FOR SELECT
  TO anon, authenticated
  USING (session_id LIKE 'v\_%' ESCAPE '\\');