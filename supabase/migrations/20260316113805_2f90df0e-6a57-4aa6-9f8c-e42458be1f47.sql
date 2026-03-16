
CREATE TABLE public.tracking_pixels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL UNIQUE,
  is_enabled boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.tracking_pixels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tracking pixels"
  ON public.tracking_pixels
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read pixels"
  ON public.tracking_pixels
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_tracking_pixels_updated_at
  BEFORE UPDATE ON public.tracking_pixels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tracking_pixels (platform, is_enabled, config) VALUES
  ('gtm',          false, '{"container_id": ""}'),
  ('ga4',          false, '{"measurement_id": ""}'),
  ('meta_pixel',   false, '{"pixel_id": ""}'),
  ('meta_capi',    false, '{"pixel_id": "", "access_token": ""}'),
  ('tiktok',       false, '{"pixel_id": ""}'),
  ('pinterest',    false, '{"tag_id": ""}')
ON CONFLICT (platform) DO NOTHING;
