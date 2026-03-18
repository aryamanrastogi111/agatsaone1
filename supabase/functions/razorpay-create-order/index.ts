import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
      items,
      customerName,
      customerEmail,
      customerPhone,
      amountInPaise,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      couponCode,
      discountAmount,
    } = body;

    if (!amountInPaise || amountInPaise <= 0) {
      throw new Error("Invalid amount");
    }

    // Create Razorpay order
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          customer_name: customerName || "",
          customer_email: customerEmail || "",
          customer_phone: customerPhone || "",
          shipping_city: shippingCity || "",
          shipping_state: shippingState || "",
          coupon_code: couponCode || "",
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errData = await razorpayResponse.json();
      throw new Error(`Razorpay error: ${JSON.stringify(errData)}`);
    }

    const razorpayOrder = await razorpayResponse.json();

    // Save pending order to DB with shipping address + coupon info
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("orders").insert({
        razorpay_order_id: razorpayOrder.id,
        amount: amountInPaise / 100,
        currency: "INR",
        status: "created",
        customer_name: customerName || null,
        customer_email: customerEmail || null,
        customer_phone: customerPhone || null,
        items: items || [],
        shipping_address: shippingAddress || null,
        shipping_city: shippingCity || null,
        shipping_state: shippingState || null,
        shipping_pincode: shippingPincode || null,
        coupon_code: couponCode || null,
        discount_amount: discountAmount || 0,
      });
    }

    return new Response(
      JSON.stringify({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: RAZORPAY_KEY_ID,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
