// Meta Conversions API client helper.
// Sends server-side events to our `meta-capi` edge function for dedup with the
// browser Meta Pixel. Also provides Advanced Matching init for fbq.
import { supabase } from "@/integrations/supabase/client";

export type CapiUserData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string; // ISO-2 preferred, e.g. "in"
  external_id?: string;
};

export type CapiCustomData = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  num_items?: number;
  order_id?: string;
  [k: string]: unknown;
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "ev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Send an event to Meta CAPI via our edge function. Silently no-ops on failure. */
export async function sendCapiEvent(
  eventName: string,
  opts: {
    eventId?: string;
    user?: CapiUserData;
    custom?: CapiCustomData;
    sourceUrl?: string;
  } = {},
): Promise<string> {
  const eventId = opts.eventId || newEventId();
  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: opts.sourceUrl || (typeof window !== "undefined" ? window.location.href : undefined),
    action_source: "website",
    user_data: {
      ...(opts.user || {}),
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    },
    custom_data: opts.custom || {},
  };
  try {
    await supabase.functions.invoke("meta-capi", { body: payload });
  } catch (e) {
    console.error("meta-capi invoke failed", e);
  }
  return eventId;
}

/**
 * Track an event on BOTH the browser pixel and the Conversions API, sharing an
 * event_id so Meta deduplicates them. Use this for every conversion event that
 * matters (Purchase, InitiateCheckout, Lead, AddToCart, ViewContent).
 */
export function trackMetaEvent(
  eventName: string,
  opts: {
    eventId?: string;
    pixelParams?: Record<string, unknown>;
    user?: CapiUserData;
    custom?: CapiCustomData;
  } = {},
): string {
  const eventId = opts.eventId || newEventId();
  try {
    const w = window as any;
    if (w?.fbq) {
      w.fbq("track", eventName, opts.pixelParams || opts.custom || {}, { eventID: eventId });
    }
  } catch (e) {
    console.error("fbq track failed", e);
  }
  // Fire-and-forget CAPI
  void sendCapiEvent(eventName, {
    eventId,
    user: opts.user,
    custom: opts.custom,
  });
  return eventId;
}

/** Read _fbp / _fbc cookies for passing to server-side CAPI backups. */
export function readFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const m = (n: string) => {
    const r = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
    return r ? decodeURIComponent(r[1]) : undefined;
  };
  return { fbp: m("_fbp"), fbc: m("_fbc") };
}

/**
 * Re-init Meta Pixel with Advanced Matching parameters once we know the user's
 * email/phone/name/address. fbq hashes these client-side before sending.
 */
export function setPixelAdvancedMatching(user: CapiUserData) {
  try {
    const w = window as any;
    if (!w?.fbq) return;
    const pixelId = "321066337528686"; // matches index.html base pixel
    const params: Record<string, string> = {};
    if (user.email) params.em = user.email.trim().toLowerCase();
    if (user.phone) params.ph = user.phone.replace(/\D/g, "");
    if (user.first_name) params.fn = user.first_name.trim().toLowerCase();
    if (user.last_name) params.ln = user.last_name.trim().toLowerCase();
    if (user.city) params.ct = user.city.trim().toLowerCase().replace(/\s+/g, "");
    if (user.state) params.st = user.state.trim().toLowerCase().replace(/\s+/g, "");
    if (user.zip) params.zp = user.zip.trim().toLowerCase().replace(/\s+/g, "");
    if (user.country) params.country = user.country.trim().toLowerCase().slice(0, 2);
    if (user.external_id) params.external_id = user.external_id;
    if (Object.keys(params).length === 0) return;
    w.fbq("init", pixelId, params);
  } catch (e) {
    console.error("fbq advanced matching init failed", e);
  }
}

/** Split "First Middle Last" → { first_name, last_name } for CAPI. */
export function splitName(full: string): { first_name?: string; last_name?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return {};
  if (parts.length === 1) return { first_name: parts[0] };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

const COUNTRY_ISO2: Record<string, string> = {
  "India": "in", "United States": "us", "United Kingdom": "gb",
  "United Arab Emirates": "ae", "Saudi Arabia": "sa", "Qatar": "qa",
  "Kuwait": "kw", "Oman": "om", "Bahrain": "bh", "Singapore": "sg",
  "Malaysia": "my", "Australia": "au", "New Zealand": "nz", "Canada": "ca",
  "Germany": "de", "France": "fr", "Netherlands": "nl", "Spain": "es",
  "Italy": "it", "Switzerland": "ch", "Sweden": "se", "Ireland": "ie",
  "Japan": "jp", "Hong Kong": "hk", "South Korea": "kr", "Thailand": "th",
  "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn", "South Africa": "za",
  "Kenya": "ke", "Nigeria": "ng", "Nepal": "np", "Bangladesh": "bd",
  "Sri Lanka": "lk", "Bhutan": "bt",
};
export function toIso2(country: string): string | undefined {
  return COUNTRY_ISO2[country];
}
