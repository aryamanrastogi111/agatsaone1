import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hmacSHA256(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!RAZORPAY_KEY_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerEmail,
      customerName,
      items,
      total,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
    } = await req.json();

    // Verify signature
    const expectedSignature = await hmacSHA256(
      RAZORPAY_KEY_SECRET,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Update order status to paid
    const { data: order } = await supabase
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    // Decrement inventory for each item purchased
    const orderItems: { variant_id?: string; quantity?: number }[] = items || order?.items || [];
    if (orderItems.length > 0) {
      for (const item of orderItems) {
        if (!item.variant_id) continue;
        // Read current quantity first
        const { data: variant } = await supabase
          .from("product_variants")
          .select("inventory_quantity")
          .eq("id", item.variant_id)
          .single();
        if (variant) {
          const newQty = Math.max(0, (variant.inventory_quantity ?? 0) - (item.quantity ?? 1));
          await supabase
            .from("product_variants")
            .update({ inventory_quantity: newQty })
            .eq("id", item.variant_id);
        }
      }
    }

    // Fire-and-forget: register device activation in Agatsa backend
    const SKU_TO_DEVICE_TYPE: Record<string, string> = {
      ecg_bundle: "ecg",
      wellness_sub: "easytouch",
      band_sub: "rhythm",
      scale_sub: "scale",
      bundle_ecg_band: "ecg",
    };

    const customerPhone = order?.customer_phone;
    const allItems: { variant_id?: string; quantity?: number; productId?: string; sku?: string }[] =
      items || order?.items || [];

    if (customerPhone && allItems.length > 0) {
      for (const item of allItems) {
        const sku = item.sku || item.productId || "";
        const deviceType = SKU_TO_DEVICE_TYPE[sku];
        if (!deviceType) continue;
        fetch(
          "https://agatsa-one-api-651017108992.asia-south1.run.app/v1/device-activations/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-secret": Deno.env.get("AGATSA_ADMIN_SECRET") ?? "",
            },
            body: JSON.stringify({
              phone: customerPhone,
              deviceType,
              deviceOrderId: razorpay_order_id,
            }),
          }
        ).catch((err) => console.error("Failed to register device activation:", err));
      }
    }

    // Fire-and-forget: send order confirmation email
    const projectId = Deno.env.get("SUPABASE_PROJECT_ID") || SUPABASE_URL.split("//")[1]?.split(".")[0];
    if (projectId && customerEmail) {
      fetch(`${SUPABASE_URL}/functions/v1/send-order-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          customerEmail,
          customerName,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          items: items || order?.items || [],
          total: total || order?.amount,
          shippingAddress: shippingAddress || order?.shipping_address,
          shippingCity: shippingCity || order?.shipping_city,
          shippingState: shippingState || order?.shipping_state,
          shippingPincode: shippingPincode || order?.shipping_pincode,
        }),
      }).catch((err) => console.error("Failed to trigger confirmation email:", err));
    }

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
