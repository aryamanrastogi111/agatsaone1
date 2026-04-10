import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Today in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const statDate = istDate.toISOString().split("T")[0];

    // Today's start in UTC (IST midnight = UTC 18:30 previous day)
    const istMidnight = new Date(`${statDate}T00:00:00+05:30`);

    // Fetch today's paid orders
    const { data: orders } = await sb
      .from("orders")
      .select("amount, status")
      .in("status", ["paid", "confirmed", "processing", "shipped", "delivered"])
      .gte("created_at", istMidnight.toISOString());

    const totalOrders = orders?.length ?? 0;
    const totalRevenue = orders?.reduce((s, o) => s + Number(o.amount), 0) ?? 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Pending payments
    const { count: pendingPayments } = await sb
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "created")
      .gte("created_at", istMidnight.toISOString());

    // Upsert (so cron can run multiple times safely)
    const { error } = await sb.from("daily_stats").upsert(
      {
        stat_date: statDate,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue,
        pending_payments: pendingPayments ?? 0,
        // peak_visitors and peak_checkout_visitors are updated by the client-side tracker
      },
      { onConflict: "stat_date" }
    );

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, stat_date: statDate, totalOrders, totalRevenue }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
