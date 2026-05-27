
-- Partnership enquiries
CREATE TABLE public.partnership_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_number TEXT UNIQUE,
  partner_type TEXT NOT NULL,
  organisation_name TEXT NOT NULL,
  website TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  contact_name TEXT NOT NULL,
  contact_designation TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_contact_method TEXT,
  preferred_contact_window TEXT,
  heard_from TEXT,
  goal_summary TEXT,
  questionnaire_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'medium',
  score INTEGER NOT NULL DEFAULT 0,
  assigned_to UUID,
  tags TEXT[],
  internal_notes TEXT,
  qualification_reason TEXT,
  next_step_date DATE,
  last_customer_message_at TIMESTAMPTZ,
  last_staff_message_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.partnership_enquiries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnership_enquiries TO authenticated;
GRANT ALL ON public.partnership_enquiries TO service_role;

ALTER TABLE public.partnership_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage partnership_enquiries"
  ON public.partnership_enquiries FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can insert partnership enquiries"
  ON public.partnership_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role manages partnership_enquiries"
  ON public.partnership_enquiries FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Enquiry number trigger
CREATE OR REPLACE FUNCTION public.generate_enquiry_number()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  year_part TEXT;
  seq_num INTEGER;
BEGIN
  IF NEW.enquiry_number IS NOT NULL AND NEW.enquiry_number <> '' THEN
    RETURN NEW;
  END IF;
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  SELECT COALESCE(MAX(
    CASE WHEN enquiry_number LIKE 'AGT-PRT-' || year_part || '-%'
      THEN CAST(SPLIT_PART(enquiry_number, '-', 4) AS INTEGER)
      ELSE 0 END
  ), 0) + 1 INTO seq_num
  FROM public.partnership_enquiries;
  NEW.enquiry_number := 'AGT-PRT-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_enquiry_number
  BEFORE INSERT ON public.partnership_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.generate_enquiry_number();

CREATE TRIGGER update_partnership_enquiries_updated_at
  BEFORE UPDATE ON public.partnership_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partnership messages
CREATE TABLE public.partnership_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES public.partnership_enquiries(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  sender_name TEXT,
  sender_email TEXT,
  body TEXT NOT NULL,
  is_internal_note BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  email_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnership_messages TO authenticated;
GRANT ALL ON public.partnership_messages TO service_role;

ALTER TABLE public.partnership_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage partnership_messages"
  ON public.partnership_messages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages partnership_messages"
  ON public.partnership_messages FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX idx_partnership_messages_enquiry ON public.partnership_messages(enquiry_id, created_at);
CREATE INDEX idx_partnership_enquiries_status ON public.partnership_enquiries(status, created_at DESC);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('partnership-attachments', 'partnership-attachments', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins read partnership attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'partnership-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages partnership attachments"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'partnership-attachments') WITH CHECK (bucket_id = 'partnership-attachments');

CREATE POLICY "Public can upload partnership attachments"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'partnership-attachments');
