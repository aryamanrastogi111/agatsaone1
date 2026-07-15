// Creates a Razorpay order for the SanketLife SDK Developer Kit (₹18,999).
// Inserts a pending row into `orders` so razorpay-verify-payment can flip it
// to paid on success — same lifecycle as the main checkout.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEV_KIT_SKU = "sdk_dev_kit_v1";
const DEV_KIT_NAME = "SanketLife SDK Developer Kit";
const DEV_KIT_PRICE_PAISE = 1899900; // ₹18,999

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

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

    const amount = DEV_KIT_PRICE_PAISE;

    // 1. Create Razorpay order directly
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const receipt = `sdkkit_${Date.now()}`.slice(0, 40);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt,
        notes: {
          product: DEV_KIT_NAME,
          sku: DEV_KIT_SKU,
          customer_email: customerEmail,
          company: company || "",
          use_case: useCase || "",
          expected_volume: expectedVolume || "",
        },
      }),
    });
    const rzpData = await rzpRes.json();
    if (!rzpRes.ok || !rzpData.id) {
      console.error("Razorpay order create failed:", rzpData);
      throw new Error(rzpData?.error?.description || "Failed to create Razorpay order");
    }

    // 2. Insert pending order row so razorpay-verify-payment can update it
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("orders").insert({
        razorpay_order_id: rzpData.id,
        amount: amount / 100,
        currency: "INR",
        status: "created",
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        items: [{ sku: DEV_KIT_SKU, name: DEV_KIT_NAME, qty: 1, price: amount / 100 }],
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
        orderId: rzpData.id,
        razorpayOrderId: rzpData.id,
        amount,
        totalAmountPaise: amount,
        currency: "INR",
        keyId: RAZORPAY_KEY_ID,
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
