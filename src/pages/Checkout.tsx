import { useState, useEffect, useCallback, useRef } from "react";
import { MAY10_CODE, isMay10Active } from "@/components/sale";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, Lock, Plus, Minus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePricing, type DeviceSku } from "@/hooks/useDevicePricing";
import { useCurrency } from "@/contexts/CurrencyContext";
import { db } from "@/integrations/supabase/db";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import agatsaLogo from "@/assets/agatsa-logo.webp";
import { trackMetaEvent, setPixelAdvancedMatching, splitName, toIso2, sendCapiEvent, readFbCookies, newEventId } from "@/lib/metaCapi";
import { BAND_COLORS, BAND_SKU, decodeVariantsParam, findBandColorByName } from "@/lib/bandColors";

// ─── Device display names ───────────────────────────────────────
const DEVICE_NAMES: Record<string, string> = {
  ecg_bundle:         "SanketLife ECG",
  band_sub:           "EasyTouch Rhythm Band",
  heartguard_starter: "HeartGuard Doctor Starter Kit",
  scale_sub:       "Agatsa Smart Scale",
  wellness_sub:    "EasyTouch Wellness",
  multivital:      "Agatsa MultiVital",
  bundle_ecg_band: "ECG + Rhythm Band Bundle",
  lb90_standard:   "Lose Your Belly 90 — Standard",
  lb90_plus:       "Lose Your Belly 90 — Plus",
  er30_standard:   "Wake Up Like 25 Again — 30-Day Programme",
  complete_kit:    "Complete Health Kit (4 Devices + 3 months Nera AI Premium)",
};

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";

// Flat international shipping surcharge: ₹3000
const INTL_SHIPPING_PAISE = 300000;

// Country → { ISO-2, phone dial code }. ISO-2 also drives zippopotam.us postal lookup.
const COUNTRY_META: Record<string, { iso2: string; dial: string }> = {
  "India":                { iso2: "IN", dial: "+91"  },
  "United States":        { iso2: "US", dial: "+1"   },
  "United Kingdom":       { iso2: "GB", dial: "+44"  },
  "United Arab Emirates": { iso2: "AE", dial: "+971" },
  "Saudi Arabia":         { iso2: "SA", dial: "+966" },
  "Qatar":                { iso2: "QA", dial: "+974" },
  "Kuwait":               { iso2: "KW", dial: "+965" },
  "Oman":                 { iso2: "OM", dial: "+968" },
  "Bahrain":              { iso2: "BH", dial: "+973" },
  "Singapore":            { iso2: "SG", dial: "+65"  },
  "Malaysia":             { iso2: "MY", dial: "+60"  },
  "Australia":            { iso2: "AU", dial: "+61"  },
  "New Zealand":          { iso2: "NZ", dial: "+64"  },
  "Canada":               { iso2: "CA", dial: "+1"   },
  "Germany":              { iso2: "DE", dial: "+49"  },
  "France":               { iso2: "FR", dial: "+33"  },
  "Netherlands":          { iso2: "NL", dial: "+31"  },
  "Spain":                { iso2: "ES", dial: "+34"  },
  "Italy":                { iso2: "IT", dial: "+39"  },
  "Switzerland":          { iso2: "CH", dial: "+41"  },
  "Sweden":               { iso2: "SE", dial: "+46"  },
  "Ireland":              { iso2: "IE", dial: "+353" },
  "Japan":                { iso2: "JP", dial: "+81"  },
  "Hong Kong":            { iso2: "HK", dial: "+852" },
  "South Korea":          { iso2: "KR", dial: "+82"  },
  "Thailand":             { iso2: "TH", dial: "+66"  },
  "Indonesia":            { iso2: "ID", dial: "+62"  },
  "Philippines":          { iso2: "PH", dial: "+63"  },
  "Vietnam":              { iso2: "VN", dial: "+84"  },
  "South Africa":         { iso2: "ZA", dial: "+27"  },
  "Kenya":                { iso2: "KE", dial: "+254" },
  "Nigeria":              { iso2: "NG", dial: "+234" },
  "Nepal":                { iso2: "NP", dial: "+977" },
  "Bangladesh":           { iso2: "BD", dial: "+880" },
  "Sri Lanka":            { iso2: "LK", dial: "+94"  },
  "Bhutan":               { iso2: "BT", dial: "+975" },
  "Other":                { iso2: "",   dial: "+"    },
};
const COUNTRIES = Object.keys(COUNTRY_META);

// Countries that zippopotam.us supports reliably (auto-fill city/state from postal)
const ZIPPO_SUPPORTED = new Set([
  "US","GB","CA","AU","NZ","DE","FR","NL","ES","IT","CH","SE","IE","JP","MY","PH","BR","MX","BE","AT","DK","FI","NO","PT","CZ","PL","TR","IN",
]);

function getVisitorSessionId(): string {
  let id = sessionStorage.getItem("agatsa_vsid");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("agatsa_vsid", id);
    sessionStorage.setItem("agatsa_vsid_start", new Date().toISOString());
  }
  return id;
}

function getStableCheckoutEventId(cartKey: string): string {
  const key = `agatsa_meta_ic_${cartKey || "cart"}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const id = newEventId();
  sessionStorage.setItem(key, id);
  return id;
}

// ─── India pincode lookup (city + state) ────────────────────────
async function lookupPincode(pincode: string): Promise<{ city: string; state: string } | null> {
  if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length) {
      const po = data[0].PostOffice[0];
      return { city: po.District, state: po.State };
    }
  } catch {
    /* ignore */
  }
  return null;
}

// ─── International postal lookup via zippopotam.us ──────────────
async function lookupIntlPostal(iso2: string, postal: string): Promise<{ city: string; state: string } | null> {
  if (!iso2 || !postal || postal.trim().length < 3) return null;
  if (!ZIPPO_SUPPORTED.has(iso2)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/${iso2.toLowerCase()}/${encodeURIComponent(postal.trim())}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      city: place["place name"] || "",
      state: place["state"] || place["state abbreviation"] || "",
    };
  } catch {
    return null;
  }
}

// ─── Razorpay loader ────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// fmtPaise is defined inside CheckoutPage so it can read the visitor's
// display currency from CurrencyContext (INR for India, USD otherwise).

type CheckoutStep = 1 | 2;
type PageState = "form" | "processing" | "success" | "error";

export default function CheckoutPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { prices } = usePricing();
  const { currency, formatPaise: formatPaiseCcy, rate } = useCurrency();
  // Display-only currency conversion. Razorpay still charges in INR.
  const fmtPaise = (paise: number) => formatPaiseCcy(paise);
  const fmtPaiseINR = (paise: number) => "₹" + Math.round(paise / 100).toLocaleString("en-IN");
  const skuParam = searchParams.get("sku") || "";
  // Deduplicate SKUs — count occurrences as initial quantities
  const skuList = skuParam.split(",").filter((s) => s in DEVICE_NAMES);
  const uniqueSkus = [...new Set(skuList)];
  const initialQty: Record<string, number> = {};
  for (const s of skuList) {
    initialQty[s] = Math.min((initialQty[s] || 0) + 1, 5);
  }

  // ─── Form state ────────────────────────────────────────────
  const [step, setStep] = useState<CheckoutStep>(1);
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [successReference, setSuccessReference] = useState("");
  // Meta CAPI: stable event_id shared between browser Pixel, browser CAPI, and
  // server-side CAPI backup (send-order-confirmation) so Meta deduplicates.
  const purchaseEventIdRef = useRef<string>("");
  const visitorSessionIdRef = useRef(getVisitorSessionId());
  const cartSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkoutLiveChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const checkoutLiveSubscribedRef = useRef(false);
  const lastCheckoutLiveEventRef = useRef("");
  const checkoutStageRef = useRef("/checkout");
  const hotLeadFiredRef = useRef<Set<string>>(new Set());

  // Quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQty);

  // Per-SKU variant title (e.g. Rhythm Band color).
  // Seeded from ?variants=band_sub:Terracotta and defaults to Olive when the
  // Rhythm Band is in the cart but no color was passed.
  const initialVariants = decodeVariantsParam(searchParams.get("variants"));
  if (uniqueSkus.includes(BAND_SKU) && !initialVariants[BAND_SKU]) {
    initialVariants[BAND_SKU] = BAND_COLORS[0].name;
  }
  const [variantBySku, setVariantBySku] = useState<Record<string, string>>(initialVariants);

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [couponType, setCouponType] = useState<"percent" | "fixed" | null>(null);
  const [couponValue, setCouponValue] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Server-confirmed pricing
  const [subtotalPaise, setSubtotalPaise] = useState(0);
  const [discountPaise, setDiscountPaise] = useState(0);
  const [serverTotalPaise, setServerTotalPaise] = useState(0);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoaded, setQuoteLoaded] = useState(false);

  // Step 1
  const [country, setCountry] = useState<string>("India");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cityAutoFilled, setCityAutoFilled] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const isIntl = country.trim().toLowerCase() !== "india";

  // Step 2
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);

  // ─── Computed ──────────────────────────────────────────────
  const cartItems = uniqueSkus.map((s) => ({ sku: s, qty: quantities[s] || 1 }));
  const clientTotalPaise = uniqueSkus.reduce(
    (sum, s) => sum + (prices[s as DeviceSku] || 0) * 100 * (quantities[s] || 1),
    0
  );
  const baseTotalPaise = quoteLoaded ? serverTotalPaise : clientTotalPaise;
  const shippingPaise = isIntl ? INTL_SHIPPING_PAISE : 0;
  const displayTotalPaise = baseTotalPaise + shippingPaise;
  const displayTotalRupees = displayTotalPaise / 100;

  const items = uniqueSkus.map((s) => ({
    sku: s,
    name: DEVICE_NAMES[s],
    unitPricePaise: (prices[s as DeviceSku] || 0) * 100,
    qty: quantities[s] || 1,
    variantTitle: variantBySku[s] || undefined,
  }));
  const cartItemsWithVariants = items.map((d) => ({
    sku: d.sku,
    qty: d.qty,
    variantTitle: d.variantTitle,
  }));

  const syncCheckoutSession = useCallback(async (contactOnly = false, convertedOrderId?: string, checkoutStage?: string) => {
    const itemCount = items.reduce((sum, d) => sum + d.qty, 0);
    if (itemCount === 0) return;
    if (checkoutStage) checkoutStageRef.current = checkoutStage;

    const cleanPhone = phone.replace(/\D/g, "");
    const contactPhone = cleanPhone ? (isIntl ? cleanPhone.slice(0, 15) : cleanPhone.slice(-10)) : null;
    const cartPayload = items.map((d) => ({
        productId: d.sku,
        productName: d.name,
        variantTitle: d.variantTitle || "Default Title",
        price: d.unitPricePaise / 100,
        quantity: d.qty,
    }));

    const { error } = await db.rpc("save_cart_session", {
      _session_id: visitorSessionIdRef.current,
      _items: contactOnly ? [] : cartPayload,
      _email: email.trim().toLowerCase() || null,
      _phone: contactPhone,
      _subtotal: displayTotalPaise / 100,
      _item_count: itemCount,
      _last_page: checkoutStageRef.current,
      _converted_order_id: convertedOrderId || null,
    });
    if (error) console.error("[checkout] cart session sync failed:", error.message);
  }, [items, phone, email, isIntl, displayTotalPaise]);

  const emitCheckoutActivity = useCallback(async (
    eventType: "checkout_reached" | "contact_typing" | "payment_clicked" | "payment_window_opened" | "payment_cancelled" | "payment_failed" | "payment_success"
  ) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const contactPhone = cleanPhone ? (isIntl ? cleanPhone.slice(0, 15) : cleanPhone.slice(-10)) : "";
    const stage = `checkout_${eventType}`;
    const fingerprint = [eventType, email.trim().toLowerCase(), contactPhone, fullName.trim(), displayTotalPaise].join("|");

    if (lastCheckoutLiveEventRef.current !== fingerprint || eventType !== "contact_typing") {
      lastCheckoutLiveEventRef.current = fingerprint;
      const payload = {
        event_type: eventType,
        session_id: visitorSessionIdRef.current,
        email: email.trim().toLowerCase() || null,
        phone: contactPhone || null,
        name: fullName.trim() || null,
        item_count: items.reduce((sum, d) => sum + d.qty, 0),
        subtotal: displayTotalPaise / 100,
        items: items.map((d) => ({ sku: d.sku, name: d.name, variantTitle: d.variantTitle, qty: d.qty })),
        country,
        city: city.trim() || null,
        state: state.trim() || null,
        stage,
        occurred_at: new Date().toISOString(),
      };

      if (checkoutLiveChannelRef.current && checkoutLiveSubscribedRef.current) {
        await checkoutLiveChannelRef.current.send({
          type: "broadcast",
          event: "checkout_activity",
          payload,
        });
      }
    }

    await syncCheckoutSession(true, undefined, stage);
  }, [city, country, displayTotalPaise, email, fullName, isIntl, items, phone, state, syncCheckoutSession]);

  // ─── Hot lead notifier: email the internal team when a visitor captures a
  // phone (or clicks pay / fails / cancels) so they can WhatsApp immediately.
  // Deduped per (session, trigger) both client-side and server-side.
  const notifyHotLead = useCallback(async (
    trigger: "phone_captured" | "payment_clicked" | "payment_failed" | "payment_cancelled"
  ) => {
    const rawDigits = phone.replace(/\D/g, "");
    const phoneReady = isIntl ? rawDigits.length >= 6 : rawDigits.length === 10;
    const emailTrim = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
    if (!phoneReady && !emailOk) return;

    const dedupKey = `${trigger}:${visitorSessionIdRef.current}`;
    if (hotLeadFiredRef.current.has(dedupKey)) return;
    hotLeadFiredRef.current.add(dedupKey);

    const dial = COUNTRY_META[country]?.dial || "+91";
    try {
      await supabase.functions.invoke("notify-abandoned-checkout", {
        body: {
          sessionId: visitorSessionIdRef.current,
          email: emailOk ? emailTrim.toLowerCase() : null,
          phone: phoneReady ? (isIntl ? rawDigits.slice(0, 15) : rawDigits) : null,
          dialCode: dial,
          name: fullName.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          country,
          subtotalPaise: displayTotalPaise,
          itemCount: items.reduce((sum, d) => sum + d.qty, 0),
          items: items.map((d) => ({ name: d.name, qty: d.qty, variantTitle: d.variantTitle })),
          stage: checkoutStageRef.current,
          trigger,
        },
      });
    } catch (e) {
      console.error("[checkout] notifyHotLead failed:", e);
      hotLeadFiredRef.current.delete(dedupKey);
    }
  }, [phone, isIntl, email, fullName, city, state, country, displayTotalPaise, items]);



  // ─── Quote fetch ──────────────────────────────────────────
  const fetchQuote = useCallback(async (itemsArr: { sku: string; qty: number }[], coupon: string | null) => {
    setQuoteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/orders/website/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsArr, couponCode: coupon || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubtotalPaise(data.subtotalPaise);
        setDiscountPaise(data.discountPaise || 0);
        setServerTotalPaise(data.totalPaise);
        setQuoteLoaded(true);
      }
    } catch (e) {
      console.warn("Quote fetch failed:", e);
    }
    setQuoteLoading(false);
  }, []);

  // Re-fetch quote on qty change only (no coupon — quote is called at pay time)
  useEffect(() => {
    if (uniqueSkus.length > 0) {
      fetchQuote(cartItems, null);
    }
  }, [JSON.stringify(cartItems)]);

  // ─── Quantity helpers ─────────────────────────────────────
  const changeQty = (sku: string, delta: number) => {
    setQuantities((q) => ({
      ...q,
      [sku]: Math.max(1, Math.min(5, (q[sku] || 1) + delta)),
    }));
  };

  // ─── Coupon helpers ───────────────────────────────────────
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setApplyingCoupon(true);
    setCouponMessage("");
    try {
      const res = await fetch(`${API_BASE}/v1/orders/website/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: code }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponApplied(code);
        setCouponValid(true);
        setCouponType(data.type);
        setCouponValue(data.value);
        setCouponMessage(data.message || "Coupon applied!");
        // Re-fetch quote with coupon to get server-confirmed total
        await fetchQuote(cartItems, code);
      } else {
        setCouponValid(false);
        setCouponMessage(data.message || "Invalid coupon code");
      }
    } catch {
      setCouponMessage("Could not validate coupon. Try again.");
    }
    setApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponInput("");
    setCouponValid(false);
    setCouponType(null);
    setCouponValue(0);
    setCouponMessage("");
    setDiscountPaise(0);
    // Re-fetch quote without coupon
    fetchQuote(cartItems, null);
  };

  // ─── Preload Razorpay only (InitiateCheckout now fires on Pay click) ──
  useEffect(() => {
    loadRazorpay();
  }, []);


  useEffect(() => {
    const channel = supabase.channel("checkout-live-events");
    checkoutLiveChannelRef.current = channel;
    channel.subscribe((status) => {
      checkoutLiveSubscribedRef.current = status === "SUBSCRIBED";
      if (status === "SUBSCRIBED") {
        void emitCheckoutActivity("checkout_reached");
      }
    });

    return () => {
      checkoutLiveSubscribedRef.current = false;
      checkoutLiveChannelRef.current = null;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uniqueSkus.length === 0) return;
    if (cartSyncTimerRef.current) clearTimeout(cartSyncTimerRef.current);
    cartSyncTimerRef.current = setTimeout(() => {
      void syncCheckoutSession(false);
    }, 600);
    return () => {
      if (cartSyncTimerRef.current) clearTimeout(cartSyncTimerRef.current);
    };
  }, [uniqueSkus.length, JSON.stringify(items), displayTotalPaise, syncCheckoutSession]);


  // ─── Pincode / postal auto-fill ────────────────────────────
  const handlePincodeChange = useCallback(async (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    setPincodeChecked(false);
    setCityAutoFilled(false);

    if (clean.length === 6) {
      setPincodeLoading(true);
      const result = await lookupPincode(clean);
      setPincodeLoading(false);
      setPincodeChecked(true);
      if (result) {
        setCity(result.city);
        setState(result.state);
        setCityAutoFilled(true);
      } else {
        setCity("");
        setState("");
        setCityAutoFilled(false);
      }
    }
  }, []);

  // International postal lookup (zippopotam.us) — debounced
  const intlLookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleIntlPostalChange = useCallback((val: string) => {
    const clean = val.slice(0, 12);
    setPincode(clean);
    setPincodeChecked(false);
    setCityAutoFilled(false);
    if (intlLookupTimer.current) clearTimeout(intlLookupTimer.current);
    if (clean.trim().length < 3) return;

    const iso2 = COUNTRY_META[country]?.iso2 || "";
    if (!ZIPPO_SUPPORTED.has(iso2)) return;

    intlLookupTimer.current = setTimeout(async () => {
      setPincodeLoading(true);
      const result = await lookupIntlPostal(iso2, clean);
      setPincodeLoading(false);
      setPincodeChecked(true);
      if (result) {
        setCity(result.city);
        if (result.state) setState(result.state);
        setCityAutoFilled(true);
      }
    }, 450);
  }, [country]);

  const dialCode = COUNTRY_META[country]?.dial || "+91";
  const pincodeValid = isIntl ? pincode.trim().length >= 3 : pincode.length === 6;
  const step1Valid = pincodeValid && addressLine1.trim().length >= 2 && city.trim().length > 0 && state.trim().length > 0 && country.trim().length > 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = isIntl ? /^\d{6,15}$/.test(phone) : /^\d{10}$/.test(phone);
  const step2Valid = fullName.trim().length >= 2 && phoneValid && emailValid;

  // ─── Mark session as "reached checkout" on arrival so abandoned-cart
  // dashboards know the visitor got this far, even before any typing.
  useEffect(() => {
    void syncCheckoutSession(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Meta Pixel Advanced Matching + early contact capture ───────
  // Capture partial email/phone the moment the user starts typing so we can
  // recover abandoned checkouts (attribution, retargeting, follow-up).
  useEffect(() => {
    const emailLooksLikely = email.includes("@");
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneLooksLikely = cleanPhone.length >= 6;

    if (emailValid || phoneValid) {
      const { first_name, last_name } = splitName(fullName);
      setPixelAdvancedMatching({
        email: emailValid ? email : undefined,
        phone: phoneValid ? `${dialCode.replace("+", "")}${phone}` : undefined,
        first_name,
        last_name,
        city: city || undefined,
        state: state || undefined,
        zip: pincode || undefined,
        country: toIso2(country),
      });
    }

    // Sync to cart_sessions on any plausible partial contact — debounced by
    // React batching + upsert is idempotent per session_id.
    if (emailValid || phoneValid || emailLooksLikely || phoneLooksLikely || email.trim().length >= 3 || cleanPhone.length >= 3) {
      const t = setTimeout(() => { void emitCheckoutActivity("contact_typing"); }, 600);
      return () => clearTimeout(t);
    }
  }, [emailValid, phoneValid, email, phone, fullName, city, state, pincode, country, dialCode, emitCheckoutActivity]);

  // Purchase is fired inline in the Razorpay handler (immediate, before any
  // async work that could be interrupted by a tab close) and duplicated server
  // side by send-order-confirmation. Same event_id → Meta dedups.


  // ─── Auto-apply coupon from URL (?coupon=CODE) or MAY10 promo ─
  const autoAppliedRef = useRef(false);
  useEffect(() => {
    if (autoAppliedRef.current) return;
    if (couponApplied) return;
    if (uniqueSkus.length === 0) return;

    const urlCoupon = (searchParams.get("coupon") || "").trim().toUpperCase();
    const codeToTry = urlCoupon || (isMay10Active() ? MAY10_CODE : "");
    if (!codeToTry) return;

    autoAppliedRef.current = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/orders/website/validate-coupon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ couponCode: codeToTry }),
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setCouponInput(codeToTry);
          setCouponApplied(codeToTry);
          setCouponValid(true);
          setCouponType(data.type);
          setCouponValue(data.value);
          setCouponMessage(data.message || "Coupon auto-applied 🎉");
          await fetchQuote(cartItems, codeToTry);
        }
      } catch {
        // silent — user can still apply manually
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueSkus.length]);



  // ─── Success state ─────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            We've sent a confirmation to <strong className="text-foreground">{email}</strong>. Your device ships within 24 hours on business days.
          </p>
          <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1">
            <p className="font-medium text-foreground">Shipping to</p>
            <p className="text-muted-foreground">{fullName}</p>
            <p className="text-muted-foreground">{addressLine1}, {city}, {state} - {pincode}{isIntl ? `, ${country}` : ""}</p>
            <p className="text-muted-foreground">{dialCode} {phone}</p>
            {successReference && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border mt-2">
                Reference: <span className="font-mono">{successReference}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            📱 Download the <strong>Agatsa One</strong> app and log in with <strong>{dialCode} {phone}</strong> to activate your device and Nera AI plan.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/app">Download App</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
          <p className="text-muted-foreground">{errorMsg || "Something went wrong. Please try again."}</p>
          <Button onClick={() => { setPageState("form"); setPaying(false); setErrorMsg(""); }} className="rounded-full px-8">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ─── Processing overlay ────────────────────────────────────
  if (pageState === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-foreground font-medium">Processing your order…</p>
          <p className="text-sm text-muted-foreground">Please don't close this page.</p>
        </div>
      </div>
    );
  }

  if (uniqueSkus.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold text-foreground">No device selected</h1>
          <p className="text-muted-foreground">Please select a device to purchase.</p>
          <Button asChild><Link to="/devices">Browse Devices</Link></Button>
        </div>
      </div>
    );
  }

  // ─── Payment flow ──────────────────────────────────────────
  const fetchWithTimeout = async (url: string, opts: RequestInit, ms = 30000) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetch(url, { ...opts, signal: ctrl.signal });
    } finally {
      clearTimeout(t);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setPageState("processing");
    setErrorMsg("");
    void emitCheckoutActivity("payment_clicked");
    void notifyHotLead("payment_clicked");

    // Fire InitiateCheckout only when the user actually clicks Pay (Razorpay launch)
    try {
      if (uniqueSkus.length > 0) {
        const cartKey = `${uniqueSkus.join("_")}_${searchParams.get("variants") || "default"}`;
        const eventId = getStableCheckoutEventId(cartKey);
        trackMetaEvent("InitiateCheckout", {
          eventId,
          user: {
            email: email.trim() || undefined,
            phone: (dialCode + phone.replace(/\D/g, "")) || undefined,
          },
          custom: {
            content_ids: uniqueSkus,
            content_type: "product",
            num_items: cartItems.reduce((s, i) => s + i.qty, 0),
            value: displayTotalRupees,
            currency: "INR",
          },
        });
      }
    } catch (e) {
      console.error("[checkout] InitiateCheckout track failed:", e);
    }


    const rawDigits = phone.replace(/\D/g, "");
    const cleanPhone = isIntl ? rawDigits.slice(0, 15) : rawDigits.slice(-10);
    const fullPhone = dialCode + cleanPhone;
    const recipientEmail = email.trim();
    let lastPaymentId = "";

    try {
      // 1. Quote (best-effort)
      try {
        const quoteRes = await fetchWithTimeout(`${API_BASE}/v1/orders/website/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems, couponCode: couponApplied || undefined }),
        });
        const quoteData = await quoteRes.json().catch(() => ({}));
        if (quoteRes.ok) {
          setSubtotalPaise(quoteData.subtotalPaise);
          setDiscountPaise(quoteData.discountPaise || 0);
          setServerTotalPaise(quoteData.totalPaise);
          setQuoteLoaded(true);
        }
      } catch (e) {
        console.error("[checkout] quote failed:", e);
      }

      // 2. Create order
      // For India: hit the external API directly.
      // For international: go through the Supabase edge function so the
      // ₹3000 shipping surcharge is added to the actual Razorpay charge.
      let createData: any = {};
      try {
        if (isIntl) {
          const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
            body: {
              items: cartItemsWithVariants,
              // Variants (e.g. Rhythm Band color) — stored in Razorpay notes + orders.items JSON.
              // Not forwarded to the external pricing API (which only expects sku+qty).
              variants: variantBySku,
              couponCode: couponApplied || undefined,
              recipientName: fullName.trim(),
              recipientPhone: fullPhone,
              recipientEmail,
              addressLine1: addressLine1.trim(),
              addressLine2: addressLine2.trim() || undefined,
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
              postalCode: pincode.trim(),
              country: country,
              discountAmount: discountPaise / 100,
            },
          });
          if (error) {
            console.error("[checkout] intl create failed:", error);
            throw new Error(error.message || "Order creation failed");
          }
          createData = data || {};
        } else {
          const createRes = await fetchWithTimeout(`${API_BASE}/v1/orders/website/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartItemsWithVariants,
              // Variant data is required for operations fulfilment (Rhythm Band colour).
              variants: variantBySku,
              couponCode: couponApplied || undefined,
              recipientName: fullName.trim(),
              recipientPhone: fullPhone,
              recipientEmail,
              addressLine1: addressLine1.trim(),
              addressLine2: addressLine2.trim() || undefined,
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
              postalCode: pincode.trim(),
              country: country,
            }),
          });
          createData = await createRes.json().catch(() => ({}));
          if (!createRes.ok) {
            console.error("[checkout] create non-ok:", createRes.status, createData);
            throw new Error(createData.error || createData.message || `Order creation failed (${createRes.status})`);
          }
        }
      } catch (e: any) {
        console.error("[checkout] create failed:", e);
        throw new Error(e?.message || "We couldn't reach the payment server. Please check your connection and try again.");
      }

      const razorpayOrderId = createData.razorpayOrderId || createData.razorpay_order_id;
      const websiteOrderId = createData.websiteOrderId;
      const confirmedTotalPaise = createData.totalAmountPaise || displayTotalPaise;
      if (!razorpayOrderId) throw new Error("Missing Razorpay order ID in response");

      // 3. Open Razorpay
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Failed to load payment gateway. Please refresh and try again.");

      setPageState("form"); // hide processing overlay while Razorpay modal is open
      void emitCheckoutActivity("payment_window_opened");

      await new Promise<void>((resolve, reject) => {
        let rzp: any;
        try {
          rzp = new (window as any).Razorpay({
            key: createData.keyId || "rzp_live_SVjGEVthft6CGI",
            amount: confirmedTotalPaise,
            currency: createData.currency || "INR",
            name: "Agatsa One",
            description: items.map((d) => {
              const label = d.variantTitle ? `${d.name} (${d.variantTitle})` : d.name;
              return d.qty > 1 ? `${label} ×${d.qty}` : label;
            }).join(", "),
            order_id: razorpayOrderId,
            prefill: {
              name: fullName.trim(),
              email: recipientEmail,
              contact: fullPhone,
            },
            theme: { color: "#7C4DFF" },
            handler: async (response: any) => {
              setPageState("processing");
              lastPaymentId = response.razorpay_payment_id || "";
              try {
                // Verify payment with external API (with timeout + non-JSON tolerance)
                let verifyRes: Response;
                try {
                  verifyRes = await fetchWithTimeout(`${API_BASE}/v1/orders/website/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      websiteOrderId,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  }, 30000);
                } catch (e: any) {
                  console.error("[checkout] verify network/timeout:", e);
                  throw new Error(
                    `Your payment was received but we couldn't confirm it in time. We'll email your confirmation shortly. Reference: ${response.razorpay_payment_id}`
                  );
                }
                const verifyText = await verifyRes.text();
                let verifyData: any = {};
                try { verifyData = verifyText ? JSON.parse(verifyText) : {}; } catch { /* non-JSON */ }
                if (!verifyRes.ok) {
                  console.error("[checkout] verify non-ok:", verifyRes.status, verifyText);
                  throw new Error(verifyData.error || `Payment verification failed (${verifyRes.status}). Reference: ${response.razorpay_payment_id}`);
                }

                // Transition success FIRST so user always sees confirmation
                setPageState("success");
                void emitCheckoutActivity("payment_success");

                // ── Meta Purchase: fire Pixel + browser CAPI IMMEDIATELY, with a
                // stable event_id we also pass to send-order-confirmation for a
                // server-side CAPI backup. Meta deduplicates by event_id.
                const metaEventId = purchaseEventIdRef.current || newEventId();
                purchaseEventIdRef.current = metaEventId;
                try {
                  const { first_name, last_name } = splitName(fullName);
                  trackMetaEvent("Purchase", {
                    eventId: metaEventId,
                    user: {
                      email: recipientEmail || undefined,
                      phone: fullPhone || undefined,
                      first_name,
                      last_name,
                      city: city || undefined,
                      state: state || undefined,
                      zip: pincode || undefined,
                      country: toIso2(country),
                      external_id: response.razorpay_payment_id || response.razorpay_order_id,
                    },
                    custom: {
                      value: confirmedTotalPaise / 100,
                      currency: "INR",
                      content_ids: uniqueSkus,
                      content_type: "product",
                      num_items: items.reduce((s, d) => s + d.qty, 0),
                      order_id: response.razorpay_order_id,
                    },
                  });
                } catch (e) {
                  console.error("[checkout] meta Purchase fire failed:", e);
                }


                // Sync order to Supabase (best-effort)
                try {
                  await db.from("orders").insert({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    amount: confirmedTotalPaise / 100,
                    currency: "INR",
                    status: "paid",
                    paid_at: new Date().toISOString(),
                    customer_name: fullName.trim(),
                    customer_email: recipientEmail,
                    customer_phone: fullPhone,
                    items: items.map((d) => ({ sku: d.sku, name: d.name, productName: d.name, variantTitle: d.variantTitle, price: d.unitPricePaise / 100, qty: d.qty })),
                    shipping_address: addressLine1.trim() + (addressLine2.trim() ? `, ${addressLine2.trim()}` : ""),
                    shipping_city: city.trim(),
                    shipping_state: state.trim(),
                    shipping_pincode: pincode.trim(),
                    shipping_country: country,
                    shipping_surcharge: shippingPaise / 100,
                    coupon_code: couponApplied || null,
                    discount_amount: discountPaise / 100,
                  });
                } catch (syncErr) {
                  console.error("[checkout] db sync failed:", syncErr);
                }

                try {
                  await syncCheckoutSession(true, response.razorpay_order_id || websiteOrderId || response.razorpay_payment_id, "checkout_payment_success");
                } catch (cartSyncErr) {
                  console.error("[checkout] cart conversion sync failed:", cartSyncErr);
                }

                // Send order confirmation emails (best-effort, server-side)
                try {
                  await supabase.functions.invoke("send-order-confirmation", {
                    body: {
                      customerEmail: recipientEmail,
                      customerName: fullName.trim(),
                      customerPhone: fullPhone,
                      orderId: response.razorpay_order_id,
                      paymentId: response.razorpay_payment_id,
                      items: items.map((d) => ({
                        productName: d.name,
                        variantTitle: d.variantTitle,
                        quantity: d.qty,
                        price: d.unitPricePaise / 100,
                      })),
                      total: confirmedTotalPaise / 100,
                      discountAmount: discountPaise / 100,
                      couponCode: couponApplied || null,
                      shippingAddress: addressLine1.trim() + (addressLine2.trim() ? `, ${addressLine2.trim()}` : ""),
                      shippingCity: city.trim(),
                      shippingState: state.trim(),
                      shippingPincode: pincode.trim(),
                      shippingCountry: country,
                      shippingSurcharge: shippingPaise / 100,
                      // Meta CAPI server-side backup (dedup by same event_id).
                      metaEventId,
                      metaFbp: readFbCookies().fbp,
                      metaFbc: readFbCookies().fbc,
                      metaUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
                      metaSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
                      metaCountryIso2: toIso2(country),
                      metaContentIds: uniqueSkus,
                      metaNumItems: items.reduce((s, d) => s + d.qty, 0),
                    },
                  });
                } catch (emailErr) {
                  console.error("[checkout] confirmation email failed:", emailErr);
                }

                setSuccessReference(response.razorpay_payment_id || "");
                useCartStore.getState().clearCart();
                setSearchParams({}, { replace: true });
                resolve();
              } catch (err: any) {
                console.error("[checkout] handler error:", err);
                setErrorMsg(err.message || "Payment verification failed");
                setPageState("error");
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                setPaying(false);
                setPageState("form");
                void emitCheckoutActivity("payment_cancelled");
                reject(new Error("cancelled"));
              },
              backdropclose: false,
              escape: false,
            },
          });

          // Catch card-declined / network failures that don't trigger handler/ondismiss
          if (typeof rzp.on === "function") {
            rzp.on("payment.failed", (resp: any) => {
              console.error("[checkout] payment.failed:", resp?.error);
              const reason = resp?.error?.description || resp?.error?.reason || "Your payment could not be processed. Please try a different method.";
              setErrorMsg(reason);
              setPageState("error");
              setPaying(false);
              void emitCheckoutActivity("payment_failed");
              reject(new Error(reason));
            });
          }

          rzp.open();
        } catch (openErr: any) {
          console.error("[checkout] razorpay open failed:", openErr);
          reject(new Error(openErr?.message || "Could not open payment window. Please try again."));
        }
      });
    } catch (err: any) {
      if (err.message !== "cancelled") {
        console.error("[checkout] outer error:", err);
        setErrorMsg(err.message || "Something went wrong");
        setPageState("error");
      }
      setPaying(false);
    }
  };





  // ─── Main form ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <img src={agatsaLogo} alt="Agatsa" className="h-8" />
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "Delivery Address" : "Contact & Pay"}</span>
          </div>
          <Progress value={step === 1 ? 50 : 100} className="h-2" />
        </div>

        {/* ─── Order summary with quantity controls ─────────── */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border space-y-3">
          {items.map((d) => (
            <div key={d.sku} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{fmtPaise(d.unitPricePaise)} each</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => changeQty(d.sku, -1)}
                    disabled={d.qty <= 1}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-foreground">{d.qty}</span>
                  <button
                    onClick={() => changeQty(d.sku, 1)}
                    disabled={d.qty >= 5}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-foreground w-20 text-right">{fmtPaise(d.unitPricePaise * d.qty)}</p>
              </div>
              {/* Rhythm Band color picker */}
              {d.sku === BAND_SKU && (
                <div className="flex items-center justify-between gap-3 pl-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border shrink-0"
                      style={{ background: findBandColorByName(variantBySku[BAND_SKU])?.hex || "#999" }}
                    />
                    <span className="text-xs text-muted-foreground truncate">Band color</span>
                  </div>
                  <select
                    value={variantBySku[BAND_SKU] || BAND_COLORS[0].name}
                    onChange={(e) => setVariantBySku((v) => ({ ...v, [BAND_SKU]: e.target.value }))}
                    className="text-xs font-medium px-2 py-1 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {BAND_COLORS.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-primary font-medium">+ Free Nera AI trial included (auto-activates on device pairing)</p>
        </div>

        {/* ─── Coupon code input ─────────────────────────────── */}
        <div className="mb-6">
          {!couponApplied ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background text-foreground"
                />
              </div>
              <Button
                onClick={applyCoupon}
                disabled={!couponInput.trim() || applyingCoupon}
                variant="outline"
                className="rounded-xl px-4 shrink-0"
              >
                {applyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Tag className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">{couponApplied}</span>
                {couponMessage && <span className="text-xs text-green-600 dark:text-green-500 truncate">— {couponMessage}</span>}
              </div>
              <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground ml-2 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {couponMessage && !couponValid && !couponApplied && (
            <p className="text-xs text-destructive mt-1.5">{couponMessage}</p>
          )}
        </div>

        {/* ─── Pricing summary ──────────────────────────────── */}
        <div className="bg-muted/30 rounded-xl p-4 mb-8 border border-border space-y-2">
          {discountPaise > 0 && quoteLoaded && (
            <>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{fmtPaise(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({couponApplied})</span>
                <span>−{fmtPaise(discountPaise)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping {isIntl ? "(International)" : "(India)"}</span>
            <span>{isIntl ? fmtPaise(INTL_SHIPPING_PAISE) : "FREE"}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-foreground">
            <span>Total</span>
            <span>{quoteLoading ? "…" : fmtPaise(displayTotalPaise)}</span>
          </div>
        </div>

        {/* Step 1: Delivery Address */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Delivery Address</h2>

            {/* Country */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => {
                  const v = e.target.value;
                  setCountry(v);
                  // Reset postal-derived + phone when toggling country
                  setPincode("");
                  setCity("");
                  setState("");
                  setPincodeChecked(false);
                  setCityAutoFilled(false);
                  setPhone("");
                }}
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {isIntl && (
                <p className="text-xs text-amber-600 mt-1.5">
                  Flat ₹3,000 international shipping will be added at checkout.
                </p>
              )}
            </div>

            {/* Pincode / Postal code */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                {isIntl ? "Postal / ZIP code" : "Pincode"}
              </label>
              <div className="relative">
                <input
                  type={isIntl ? "text" : "tel"}
                  maxLength={isIntl ? 12 : 6}
                  value={pincode}
                  onChange={(e) => {
                    if (isIntl) {
                      handleIntlPostalChange(e.target.value);
                    } else {
                      handlePincodeChange(e.target.value);
                    }
                  }}
                  placeholder={isIntl ? "Enter postal / ZIP code" : "Enter 6-digit pincode"}
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
                {pincodeLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                )}
              </div>
              {pincodeChecked && cityAutoFilled && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Delivering to {city}, {state}
                </p>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                />
              </div>
            </div>

            {/* Address line 1 */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">House / Flat / Street</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="e.g. Flat 201, Green Towers, MG Road"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            {/* Address line 2 */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Landmark <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="e.g. Near City Hospital"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            <Button
              onClick={() => {
                setStep(2);
                try {
                  const cartKey = `${uniqueSkus.join("_")}_${searchParams.get("variants") || "default"}`;
                  const eventId = `apinfo_${getStableCheckoutEventId(cartKey)}`;
                  trackMetaEvent("AddPaymentInfo", {
                    eventId,
                    custom: {
                      content_ids: uniqueSkus,
                      content_type: "product",
                      num_items: cartItems.reduce((s, i) => s + i.qty, 0),
                      value: displayTotalRupees,
                      currency: "INR",
                    },
                  });
                } catch (e) {
                  console.error("[checkout] AddPaymentInfo track failed:", e);
                }
              }}
              disabled={!step1Valid}
              className={`w-full rounded-xl py-6 text-base font-semibold mt-2 ${
                !step1Valid ? "!bg-gray-300 !text-gray-500 !opacity-100 cursor-not-allowed" : ""
              }`}
            >
              Continue to Contact Details
            </Button>
          </div>
        )}

        {/* Step 2: Contact & Pay */}
        {step === 2 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h2 className="text-lg font-bold text-foreground">Contact Details</h2>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Mobile Number</label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-border rounded-l-xl bg-muted text-sm text-muted-foreground font-medium">{dialCode}</span>
                <input
                  type="tel"
                  maxLength={isIntl ? 15 : 10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, isIntl ? 15 : 10))}
                  placeholder={isIntl ? "Mobile number" : "10-digit mobile number"}
                  className="flex-1 px-4 py-3 border border-border rounded-r-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isIntl ? "We'll use this for delivery updates and order support." : "Use your Agatsa One app number for automatic plan activation"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Email <span className="text-muted-foreground font-normal">— for order confirmation & invoice</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
              {email.trim().length > 0 && !emailValid && (
                <p className="text-xs text-destructive mt-1">Please enter a valid email so we can send your confirmation.</p>
              )}
            </div>

            {/* Shipping summary */}
            <div className="bg-muted/30 rounded-xl p-3 text-sm text-muted-foreground border border-border">
              <p className="font-medium text-foreground mb-1">Shipping to</p>
              <p>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}</p>
              <p>{city}, {state} - {pincode}{isIntl ? `, ${country}` : ""}</p>
              {isIntl && (
                <p className="text-xs text-amber-600 mt-1">+ ₹3,000 international shipping included</p>
              )}
            </div>

            {/* Pay button */}
            <Button
              onClick={handlePay}
              disabled={!step2Valid || paying}
              className="w-full rounded-xl py-6 text-base font-semibold mt-2"
            >
              {paying ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</span>
              ) : (
                <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay {fmtPaise(displayTotalPaise)} securely</span>
              )}
            </Button>

            {currency !== "INR" && (
              <p className="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Final charge is in INR ({fmtPaiseINR(displayTotalPaise)}) by Razorpay at today's rate
                (1 USD ≈ ₹{rate > 0 ? Math.round(1 / rate).toLocaleString("en-IN") : "—"}).
                Your bank converts the amount to your card's currency on your statement.
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              UPI · Cards · Net Banking · Secured by Razorpay
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> PCI-DSS Compliant</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
