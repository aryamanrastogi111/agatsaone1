import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";

// Flat international shipping surcharge: ₹3000 = 300000 paise
const INTERNATIONAL_SHIPPING_PAISE = 300000;

function isInternational(country: string | undefined | null): boolean {
  if (!country) return false;
  const c = country.trim().toLowerCase();
  if (!c) return false;
  return c !== "india" && c !== "in" && c !== "ind";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    const body = await req.json();
    const {
      items,
      skus,
      variants, // { sku: variantTitle } — e.g. Rhythm Band color
      couponCode,
      customerName,
      customerEmail,
      customerPhone,
      amountInPaise,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      recipientName,
      recipientPhone,
      recipientEmail,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      postalCode,
      country,
      discountAmount,
    } = body;

    // Items enriched with variantTitle for downstream storage / notes.
    // Backend forwarding still only sends { sku, qty } — external API contract unchanged.
    const enrichedItems: { sku: string; qty: number; variantTitle?: string }[] = items
      ? items.map((i: any) => ({
          sku: i.sku,
          qty: i.qty,
          variantTitle: i.variantTitle || (variants && variants[i.sku]) || undefined,
        }))
      : skus
        ? skus.map((s: string) => ({ sku: s, qty: 1, variantTitle: variants?.[s] }))
        : [];
    const normalizedItems: { sku: string; qty: number }[] = enrichedItems.map((i) => ({ sku: i.sku, qty: i.qty }));

    if (normalizedItems.length === 0) {
      throw new Error("No items provided");
    }

    const intl = isInternational(country);
    // For backend (India-only system), pass a placeholder pincode for intl orders.
    const effectivePincode = intl ? "000000" : (pincode || shippingPincode || "");

    // 1. Forward to backend for item pricing + coupon math
    const createRes = await fetch(`${API_BASE}/v1/orders/website/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: normalizedItems,
        couponCode: couponCode || undefined,
        recipientName: recipientName || customerName || "",
        recipientPhone: recipientPhone || customerPhone || "",
        recipientEmail: recipientEmail || customerEmail || "",
        addressLine1: addressLine1 || shippingAddress || "",
        addressLine2: addressLine2 || "",
        city: city || shippingCity || "",
        state: state || shippingState || "",
        pincode: effectivePincode,
      }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      throw new Error(createData.error || createData.message || `Backend error (${createRes.status})`);
    }

    let {
      razorpayOrderId,
      websiteOrderId,
      totalAmountPaise,
      keyId,
    } = createData;

    const baseTotalPaise = totalAmountPaise || amountInPaise || 0;
    const surchargePaise = intl ? INTERNATIONAL_SHIPPING_PAISE : 0;
    let finalTotalPaise = baseTotalPaise + surchargePaise;

    // 2. If international: create a NEW Razorpay order at the higher amount,
    //    so the surcharge is actually charged. (Backend order id is replaced.)
    if (intl && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: finalTotalPaise,
            currency: "INR",
            receipt: (websiteOrderId || razorpayOrderId || `intl_${Date.now()}`).toString().slice(0, 40),
            notes: {
              international: "true",
              country: country || "",
              shipping_surcharge_paise: surchargePaise.toString(),
              base_order_id: razorpayOrderId || "",
              website_order_id: websiteOrderId?.toString() || "",
              // Variants (e.g. Rhythm Band color) — visible in Razorpay dashboard.
              variants: enrichedItems
                .filter((i) => i.variantTitle)
                .map((i) => `${i.sku}:${i.variantTitle}`)
                .join(", ") || "",
            },
          }),
        });
        const rzpData = await rzpRes.json();
        if (rzpRes.ok && rzpData.id) {
          razorpayOrderId = rzpData.id;
          totalAmountPaise = finalTotalPaise;
        } else {
          console.error("Razorpay intl order create failed:", rzpData);
          throw new Error(rzpData?.error?.description || "Failed to create international order");
        }
      } catch (e) {
        console.error("Razorpay intl create error:", e);
        throw e;
      }
    } else {
      totalAmountPaise = finalTotalPaise;
    }

    // 3. Save pending order to DB
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("orders").insert({
        razorpay_order_id: razorpayOrderId,
        amount: totalAmountPaise / 100,
        currency: "INR",
        status: "created",
        customer_name: recipientName || customerName || null,
        customer_email: recipientEmail || customerEmail || null,
        customer_phone: recipientPhone || customerPhone || null,
        items: enrichedItems,
        shipping_address: addressLine1 || shippingAddress || null,
        shipping_city: city || shippingCity || null,
        shipping_state: state || shippingState || null,
        shipping_pincode: postalCode || pincode || shippingPincode || null,
        shipping_country: country || "India",
        shipping_surcharge: surchargePaise / 100,
        coupon_code: couponCode || null,
        discount_amount: discountAmount || 0,
      });
    }

    return new Response(
      JSON.stringify({
        orderId: razorpayOrderId,
        razorpayOrderId,
        websiteOrderId,
        totalAmountPaise,
        amount: totalAmountPaise,
        currency: "INR",
        keyId: keyId || RAZORPAY_KEY_ID,
        shippingSurchargePaise: surchargePaise,
        international: intl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
