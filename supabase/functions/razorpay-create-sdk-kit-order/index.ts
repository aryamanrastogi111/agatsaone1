// Creates a Razorpay order for the SanketLife SDK Developer Kit (₹18,999).
// Routes through the same backend API as other SKUs:
//   POST {API_BASE}/v1/orders/website/create  with  items: [{ sku: "sdk_devkit", qty: 1 }]
// The backend returns a Razorpay order id + website order id + total amount.
// We then insert a pending `orders` row so razorpay-verify-payment can flip it
// to paid on success — same lifecycle as the main checkout.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";

const DEV_KIT_SKU = "sdk_devkit";
const DEV_KIT_NAME = "SanketLife SDK Developer Kit";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      useCase,
      expectedVolume,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      country,
    } = body;

    if (!customerName || !customerEmail) {
      throw new Error("Name and email are required");
    }

    // 1. Forward to backend for item pricing + order creation (same API as checkout)
    const createRes = await fetch(`${API_BASE}/v1/orders/website/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ sku: DEV_KIT_SKU, qty: 1 }],
        recipientName: customerName,
        recipientPhone: customerPhone || "",
        recipientEmail: customerEmail,
        addressLine1: shippingAddress || "",
        addressLine2: "",
        city: shippingCity || "",
        state: shippingState || "",
        pincode: shippingPincode || "",
      }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      throw new Error(createData.error || createData.message || `Backend error (${createRes.status})`);
    }

    let { razorpayOrderId, websiteOrderId, totalAmountPaise, keyId } = createData;

    if (!razorpayOrderId || !totalAmountPaise) {
      throw new Error("Backend did not return a Razorpay order id / amount");
    }

    // 2. Save pending order to DB so razorpay-verify-payment can flip it to paid
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("orders").insert({
        razorpay_order_id: razorpayOrderId,
        amount: totalAmountPaise / 100,
        currency: "INR",
        status: "created",
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        items: [{ sku: DEV_KIT_SKU, name: DEV_KIT_NAME, qty: 1, price: totalAmountPaise / 100 }],
        shipping_address: shippingAddress || null,
        shipping_city: shippingCity || null,
        shipping_state: shippingState || null,
        shipping_pincode: shippingPincode || null,
        shipping_country: country || "India",
        shipping_surcharge: 0,
      });
    }

    return new Response(
      JSON.stringify({
        orderId: razorpayOrderId,
        razorpayOrderId,
        websiteOrderId,
        amount: totalAmountPaise,
        totalAmountPaise,
        currency: "INR",
        keyId: keyId || RAZORPAY_KEY_ID,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("razorpay-create-sdk-kit-order error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
