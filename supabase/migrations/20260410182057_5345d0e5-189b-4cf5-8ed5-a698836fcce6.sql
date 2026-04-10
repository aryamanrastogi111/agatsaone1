
-- Allow anonymous users to insert orders (from checkout)
CREATE POLICY "Public can insert orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);
