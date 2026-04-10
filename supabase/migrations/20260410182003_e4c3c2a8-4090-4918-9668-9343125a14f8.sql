
-- Allow anonymous users to SELECT visitor_sessions (needed for upsert conflict resolution)
CREATE POLICY "Anon can select own visitor sessions"
ON public.visitor_sessions
FOR SELECT
TO anon
USING (true);
