DROP POLICY IF EXISTS "Public can read visitor cart sessions for upsert" ON public.cart_sessions;

CREATE OR REPLACE FUNCTION public.save_cart_session(
  _session_id text,
  _items jsonb DEFAULT '[]'::jsonb,
  _email text DEFAULT NULL,
  _phone text DEFAULT NULL,
  _subtotal numeric DEFAULT 0,
  _item_count integer DEFAULT 0,
  _last_page text DEFAULT '/checkout',
  _converted_order_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  clean_email text;
  clean_phone text;
  clean_last_page text;
  clean_items jsonb;
BEGIN
  IF _session_id IS NULL OR _session_id !~ '^v_[0-9]{10,}_[a-z0-9]{3,32}$' THEN
    RAISE EXCEPTION 'Invalid checkout session';
  END IF;

  clean_email := NULLIF(lower(trim(COALESCE(_email, ''))), '');
  IF clean_email IS NOT NULL AND (length(clean_email) > 255 OR clean_email ~ '[[:cntrl:]<>"'']') THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  clean_phone := regexp_replace(COALESCE(_phone, ''), '\D', '', 'g');
  clean_phone := NULLIF(left(clean_phone, 15), '');

  clean_last_page := left(COALESCE(NULLIF(trim(_last_page), ''), '/checkout'), 80);
  IF clean_last_page NOT LIKE '%checkout%' THEN
    clean_last_page := '/checkout';
  END IF;

  clean_items := CASE WHEN jsonb_typeof(COALESCE(_items, '[]'::jsonb)) = 'array' THEN _items ELSE '[]'::jsonb END;
  IF jsonb_array_length(clean_items) > 20 THEN
    RAISE EXCEPTION 'Too many checkout items';
  END IF;

  IF COALESCE(_item_count, 0) < 0 OR COALESCE(_item_count, 0) > 50 THEN
    RAISE EXCEPTION 'Invalid item count';
  END IF;

  IF COALESCE(_subtotal, 0) < 0 OR COALESCE(_subtotal, 0) > 500000 THEN
    RAISE EXCEPTION 'Invalid checkout amount';
  END IF;

  INSERT INTO public.cart_sessions (
    session_id,
    items,
    email,
    phone,
    subtotal,
    item_count,
    last_page,
    converted_order_id,
    updated_at
  ) VALUES (
    _session_id,
    clean_items,
    clean_email,
    clean_phone,
    COALESCE(_subtotal, 0),
    COALESCE(_item_count, 0),
    clean_last_page,
    NULLIF(left(COALESCE(_converted_order_id, ''), 120), ''),
    now()
  )
  ON CONFLICT (session_id) DO UPDATE SET
    items = CASE WHEN jsonb_array_length(EXCLUDED.items) > 0 THEN EXCLUDED.items ELSE cart_sessions.items END,
    email = COALESCE(EXCLUDED.email, cart_sessions.email),
    phone = COALESCE(EXCLUDED.phone, cart_sessions.phone),
    subtotal = CASE WHEN EXCLUDED.subtotal > 0 THEN EXCLUDED.subtotal ELSE cart_sessions.subtotal END,
    item_count = CASE WHEN EXCLUDED.item_count > 0 THEN EXCLUDED.item_count ELSE cart_sessions.item_count END,
    last_page = EXCLUDED.last_page,
    converted_order_id = COALESCE(EXCLUDED.converted_order_id, cart_sessions.converted_order_id),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_cart_session(text, jsonb, text, text, numeric, integer, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_cart_session(text, jsonb, text, text, numeric, integer, text, text) TO service_role;