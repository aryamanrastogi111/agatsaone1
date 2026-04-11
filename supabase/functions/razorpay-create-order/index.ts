import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const body = await req.json();
    const {
      // New format: items array with qty
      items,
      // Legacy format: flat skus array
      skus,
      couponCode,
      customerName,
      customerEmail,
      customerPhone,
      amountInPaise,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      // New format fields
      recipientName,
      recipientPhone,
      recipientEmail,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      discountAmount,
    } = body;

    // Normalize items: if caller sends items [{sku, qty}] use that, else convert legacy skus
    const normalizedItems: { sku: string; qty: number }[] = items
      ? items
      : skus
        ? skus.map((s: string) => ({ sku: s, qty: 1 }))
        : [];

    if (normalizedItems.length === 0) {
      throw new Error("No items provided");
    }

    // Forward to backend API for order creation
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
        pincode: pincode || shippingPincode || "",
      }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      throw new Error(createData.error || createData.message || `Backend error (${createRes.status})`);
    }

    const {
      razorpayOrderId,
      websiteOrderId,
      totalAmountPaise,
      keyId,
    } = createData;

    // Save pending order to DB
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("orders").insert({
        razorpay_order_id: razorpayOrderId,
        amount: (totalAmountPaise || amountInPaise || 0) / 100,
        currency: "INR",
        status: "created",
        customer_name: recipientName || customerName || null,
        customer_email: recipientEmail || customerEmail || null,
        customer_phone: recipientPhone || customerPhone || null,
        items: normalizedItems,
        shipping_address: addressLine1 || shippingAddress || null,
        shipping_city: city || shippingCity || null,
        shipping_state: state || shippingState || null,
        shipping_pincode: pincode || shippingPincode || null,
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
        keyId: keyId || Deno.env.get("RAZORPAY_KEY_ID"),
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
