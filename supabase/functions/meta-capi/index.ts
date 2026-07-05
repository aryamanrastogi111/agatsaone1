// Meta Conversions API forwarder
// Reads pixel_id + access_token from tracking_pixels table (platform='meta_capi'),
// hashes user PII (SHA-256), and forwards events to Meta Graph API.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const normEmail = (s: string) => s.trim().toLowerCase();
const normPhone = (s: string) => s.replace(/\D/g, "");
const normName = (s: string) => s.trim().toLowerCase();
const normCity = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
const normState = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
const normZip = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
const normCountry = (s: string) => s.trim().toLowerCase().slice(0, 2);

async function hashIf(v: string | undefined | null, normalizer: (x: string) => string) {
  if (!v) return undefined;
  const n = normalizer(String(v));
  if (!n) return undefined;
  return await sha256Hex(n);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      event_name,
      event_id,
      event_source_url,
      action_source = "website",
      user_data = {},
      custom_data = {},
      test_event_code,
    } = body ?? {};

    if (!event_name || typeof event_name !== "string") {
      return new Response(JSON.stringify({ error: "event_name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: pixel } = await supabase
      .from("tracking_pixels")
      .select("config, is_enabled")
      .eq("platform", "meta_capi")
      .maybeSingle();

    if (!pixel?.is_enabled) {
      return new Response(JSON.stringify({ skipped: "meta_capi disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const cfg = (pixel.config ?? {}) as Record<string, string>;
    const pixelId = cfg.pixel_id;
    const accessToken = cfg.access_token;
    if (!pixelId || !accessToken) {
      return new Response(JSON.stringify({ skipped: "missing pixel_id/access_token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive client IP + UA from request headers when caller didn't supply them
    const xff = req.headers.get("x-forwarded-for") || "";
    const ip = user_data.client_ip_address || xff.split(",")[0].trim() || undefined;
    const ua = user_data.client_user_agent || req.headers.get("user-agent") || undefined;

    const hashedUserData: Record<string, unknown> = {};
    const em = await hashIf(user_data.email, normEmail);
    const ph = await hashIf(user_data.phone, normPhone);
    const fn = await hashIf(user_data.first_name, normName);
    const ln = await hashIf(user_data.last_name, normName);
    const ct = await hashIf(user_data.city, normCity);
    const st = await hashIf(user_data.state, normState);
    const zp = await hashIf(user_data.zip, normZip);
    const country = await hashIf(user_data.country, normCountry);
    const external_id = await hashIf(user_data.external_id, (x) => x.trim().toLowerCase());

    if (em) hashedUserData.em = [em];
    if (ph) hashedUserData.ph = [ph];
    if (fn) hashedUserData.fn = [fn];
    if (ln) hashedUserData.ln = [ln];
    if (ct) hashedUserData.ct = [ct];
    if (st) hashedUserData.st = [st];
    if (zp) hashedUserData.zp = [zp];
    if (country) hashedUserData.country = [country];
    if (external_id) hashedUserData.external_id = [external_id];
    if (ip) hashedUserData.client_ip_address = ip;
    if (ua) hashedUserData.client_user_agent = ua;
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;

    const event = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event_id || crypto.randomUUID(),
      event_source_url,
      action_source,
      user_data: hashedUserData,
      custom_data,
    };

    const payload: Record<string, unknown> = { data: [event] };
    if (test_event_code) payload.test_event_code = test_event_code;

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const fbJson = await fbRes.json().catch(() => ({}));

    if (!fbRes.ok) {
      console.error("meta-capi error", fbRes.status, fbJson);
      return new Response(JSON.stringify({ error: "meta_api_error", status: fbRes.status, fb: fbJson }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, event_id: event.event_id, fb: fbJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("meta-capi exception", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
