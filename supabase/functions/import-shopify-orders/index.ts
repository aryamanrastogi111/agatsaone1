import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const SHOPIFY_STORE_DOMAIN = "2nn8py-5t.myshopify.com";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error("SHOPIFY_ACCESS_TOKEN not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse optional params
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const sinceId = body.since_id ?? null;       // cursor for pagination
    const limit = Math.min(body.limit ?? 250, 250);

    // Build Shopify Admin REST URL
    let url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/orders.json?status=any&limit=${limit}&order=id+asc`;
    if (sinceId) url += `&since_id=${sinceId}`;

    const shopifyResp = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!shopifyResp.ok) {
      const text = await shopifyResp.text();
      throw new Error(`Shopify API error ${shopifyResp.status}: ${text}`);
    }

    const { orders: shopifyOrders } = await shopifyResp.json();

    if (!shopifyOrders || shopifyOrders.length === 0) {
      return new Response(
        JSON.stringify({ imported: 0, message: "No orders to import" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map Shopify orders → our native schema
    const mapped = shopifyOrders.map((o: any) => {
      const shippingAddr = o.shipping_address ?? o.billing_address ?? null;
      const lineItems = (o.line_items ?? []).map((li: any) => ({
        productName: li.title ?? li.name ?? "Product",
        variantTitle: li.variant_title ?? undefined,
        sku: li.sku ?? undefined,
        quantity: li.quantity ?? 1,
        price: parseFloat(li.price ?? "0"),
      }));

      const totalPrice = parseFloat(o.total_price ?? "0");
      const discountAmt = (o.total_discounts ?? null) ? parseFloat(o.total_discounts) : 0;

      // Map Shopify financial_status / fulfillment_status → our status
      let status = "paid";
      if (o.financial_status === "pending") status = "created";
      else if (o.financial_status === "paid") {
        if (o.fulfillment_status === "fulfilled") status = "delivered";
        else if (o.fulfillment_status === "partial") status = "shipped";
        else status = "paid";
      } else if (o.financial_status === "refunded" || o.financial_status === "voided") status = "refunded";
      else if (o.financial_status === "cancelled") status = "cancelled";
      if (o.cancelled_at) status = "cancelled";

      const couponCode = o.discount_codes?.length > 0 ? o.discount_codes[0].code : null;

      return {
        // Use Shopify order ID as razorpay_order_id field to detect duplicates
        razorpay_order_id: `shopify-${o.id}`,
        razorpay_payment_id: o.payment_gateway ? `shopify-pgw-${o.id}` : null,
        amount: totalPrice,
        currency: o.currency ?? "INR",
        status,
        customer_name: shippingAddr
          ? `${shippingAddr.first_name ?? ""} ${shippingAddr.last_name ?? ""}`.trim()
          : o.email ?? null,
        customer_email: o.email ?? null,
        customer_phone: shippingAddr?.phone ?? o.phone ?? null,
        shipping_address: shippingAddr
          ? `${shippingAddr.address1 ?? ""}${shippingAddr.address2 ? ", " + shippingAddr.address2 : ""}`
          : null,
        shipping_city: shippingAddr?.city ?? null,
        shipping_state: shippingAddr?.province ?? null,
        shipping_pincode: shippingAddr?.zip ?? null,
        items: lineItems,
        coupon_code: couponCode,
        discount_amount: discountAmt,
        paid_at: o.processed_at ? new Date(o.processed_at).toISOString() : null,
        created_at: new Date(o.created_at).toISOString(),
        updated_at: new Date(o.updated_at ?? o.created_at).toISOString(),
      };
    });

    // Upsert — conflict on razorpay_order_id to avoid duplicates
    const { error: upsertError, count } = await supabase
      .from("orders")
      .upsert(mapped, { onConflict: "razorpay_order_id", count: "exact" });

    if (upsertError) throw upsertError;

    const lastId = shopifyOrders[shopifyOrders.length - 1]?.id ?? null;
    const hasMore = shopifyOrders.length === limit;

    return new Response(
      JSON.stringify({
        imported: mapped.length,
        last_shopify_id: lastId,
        has_more: hasMore,
        message: `Imported ${mapped.length} orders from Shopify`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("import-shopify-orders error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
