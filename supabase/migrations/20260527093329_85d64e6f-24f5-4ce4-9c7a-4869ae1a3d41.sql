
-- 1. Extend support_tickets
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS ticket_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS sub_issue TEXT,
  ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS last_customer_message_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_staff_message_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_due_at TIMESTAMPTZ;

-- Allow public inserts (tickets submitted from the website by anonymous customers)
DROP POLICY IF EXISTS "Public can insert support tickets" ON public.support_tickets;
CREATE POLICY "Public can insert support tickets"
  ON public.support_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Service role manages support tickets (used by edge functions)
DROP POLICY IF EXISTS "Service role manages support_tickets" ON public.support_tickets;
CREATE POLICY "Service role manages support_tickets"
  ON public.support_tickets FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

GRANT INSERT ON public.support_tickets TO anon, authenticated;

-- 2. Ticket number generator
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_part TEXT;
  seq_num INTEGER;
BEGIN
  IF NEW.ticket_number IS NOT NULL AND NEW.ticket_number <> '' THEN
    RETURN NEW;
  END IF;
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  SELECT COALESCE(MAX(
    CASE WHEN ticket_number LIKE 'AGT-TKT-' || year_part || '-%'
      THEN CAST(SPLIT_PART(ticket_number, '-', 4) AS INTEGER)
      ELSE 0 END
  ), 0) + 1 INTO seq_num
  FROM public.support_tickets;
  NEW.ticket_number := 'AGT-TKT-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS support_tickets_set_number ON public.support_tickets;
CREATE TRIGGER support_tickets_set_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_number();

-- 3. ticket_messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer','staff','system')),
  sender_name TEXT,
  sender_email TEXT,
  body TEXT NOT NULL,
  is_internal_note BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  email_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage ticket_messages"
  ON public.ticket_messages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages ticket_messages"
  ON public.ticket_messages FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- 4. Storage bucket for attachments (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to ticket-attachments (validated by edge function path naming).
CREATE POLICY "Anyone can upload ticket attachments"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'ticket-attachments');

CREATE POLICY "Admins can read ticket attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'ticket-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages ticket attachments"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'ticket-attachments')
  WITH CHECK (bucket_id = 'ticket-attachments');
