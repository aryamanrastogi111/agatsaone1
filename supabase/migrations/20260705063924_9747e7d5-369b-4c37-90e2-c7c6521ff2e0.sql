INSERT INTO public.tracking_pixels (platform, is_enabled, config)
VALUES ('meta_capi', true, jsonb_build_object(
  'pixel_id', '321066337528686',
  'access_token', 'EAAOuWfNal40BRw4AZCntlEJLnvi4H8YGNZAsWwiIi6sKr6tajB2DIq40i8VkBAUSVPKIAXvB9uDT4aSbFGnZBwsVjlfvkJggKOialxhvOZAfwHz6ztD7BBOYDE9Nz7t5QenZB0dG4aN9OTcbUfZAUYtqxXOYr3ssu5n8WhCZCCfnyYwIZCT1GBCW47IbH5SLECjSoQZDZD'
))
ON CONFLICT (platform) DO UPDATE
SET is_enabled = true,
    config = EXCLUDED.config,
    updated_at = now();