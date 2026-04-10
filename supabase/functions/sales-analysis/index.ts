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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(supabaseUrl, serviceKey);

    // Gather data for AI analysis
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const paidStatuses = ["paid", "confirmed", "processing", "shipped", "delivered"];

    // Parallel data fetches
    const [
      thisWeekOrders,
      prevWeekOrders,
      monthOrders,
      pendingOrders,
      dailyStats,
      recentCancelledOrders,
    ] = await Promise.all([
      // This week's paid orders
      sb.from("orders")
        .select("amount, status, created_at, items, customer_name")
        .gte("created_at", weekAgo.toISOString())
        .in("status", paidStatuses),
      // Previous week's paid orders
      sb.from("orders")
        .select("amount, status, created_at")
        .gte("created_at", prevWeekStart.toISOString())
        .lt("created_at", weekAgo.toISOString())
        .in("status", paidStatuses),
      // Last 30 days all orders
      sb.from("orders")
        .select("amount, status, created_at, items")
        .gte("created_at", monthAgo.toISOString()),
      // Currently pending/abandoned
      sb.from("orders")
        .select("amount, status, created_at")
        .eq("status", "created")
        .gte("created_at", weekAgo.toISOString()),
      // Daily stats snapshots
      sb.from("daily_stats")
        .select("*")
        .gte("stat_date", monthAgo.toISOString().split("T")[0])
        .order("stat_date", { ascending: true }),
      // Cancelled/refunded orders
      sb.from("orders")
        .select("amount, status, created_at")
        .in("status", ["cancelled", "refunded"])
        .gte("created_at", monthAgo.toISOString()),
    ]);

    // Compute metrics
    const thisWeekData = thisWeekOrders.data ?? [];
    const prevWeekData = prevWeekOrders.data ?? [];
    const monthData = monthOrders.data ?? [];
    const pendingData = pendingOrders.data ?? [];
    const statsData = dailyStats.data ?? [];
    const cancelledData = recentCancelledOrders.data ?? [];

    const thisWeekRevenue = thisWeekData.reduce((s, o) => s + Number(o.amount), 0);
    const prevWeekRevenue = prevWeekData.reduce((s, o) => s + Number(o.amount), 0);
    const revenueChange = prevWeekRevenue > 0
      ? Math.round(((thisWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100)
      : thisWeekRevenue > 0 ? 100 : 0;

    const monthPaid = monthData.filter(o => paidStatuses.includes(o.status));
    const monthAllCount = monthData.length;
    const monthPaidCount = monthPaid.length;
    const monthPendingCount = monthData.filter(o => o.status === "created").length;
    const monthCancelledCount = cancelledData.length;

    // Conversion rate: paid / (paid + pending + cancelled)
    const totalAttempts = monthPaidCount + monthPendingCount + monthCancelledCount;
    const conversionRate = totalAttempts > 0 ? Math.round((monthPaidCount / totalAttempts) * 100) : 0;

    // Product performance
    const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    monthPaid.forEach((o: any) => {
      if (!Array.isArray(o.items)) return;
      o.items.forEach((item: any) => {
        const name = item.productName ?? item.name ?? "Unknown";
        if (!productMap[name]) productMap[name] = { name, qty: 0, revenue: 0 };
        productMap[name].qty += item.quantity ?? 1;
        productMap[name].revenue += (item.price ?? 0) * (item.quantity ?? 1);
      });
    });
    const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Peak visitors trend
    const peakVisitorsTrend = statsData.map((d: any) => ({
      date: d.stat_date,
      visitors: d.peak_visitors,
      orders: d.total_orders,
      revenue: Number(d.total_revenue),
    }));

    // Dropout/funnel estimate
    const avgDailyVisitors = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.peak_visitors || 0), 0) / statsData.length)
      : 0;
    const avgDailyOrders = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.total_orders || 0), 0) / statsData.length)
      : 0;

    // Build context for AI
    const dataContext = {
      period: "Last 7 days vs previous 7 days",
      thisWeek: { orders: thisWeekData.length, revenue: thisWeekRevenue },
      prevWeek: { orders: prevWeekData.length, revenue: prevWeekRevenue },
      revenueChangePercent: revenueChange,
      last30Days: {
        totalOrders: monthAllCount,
        paidOrders: monthPaidCount,
        pendingAbandoned: monthPendingCount,
        cancelled: monthCancelledCount,
        conversionRate: `${conversionRate}%`,
      },
      avgDailyVisitors,
      avgDailyOrders,
      topProducts,
      dailyTrend: peakVisitorsTrend.slice(-14), // last 14 days
    };

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a senior e-commerce analytics consultant for Agatsa, a health-tech company selling ECG devices and wellness products in India.

Analyze the sales data provided and give actionable insights. Be specific and data-driven.

Your response MUST be valid JSON with this exact structure:
{
  "overallHealth": "good" | "warning" | "critical",
  "headline": "One-line summary of the current situation",
  "keyMetrics": [
    { "label": "string", "value": "string", "trend": "up" | "down" | "flat", "insight": "string" }
  ],
  "dropoutAnalysis": {
    "funnelStages": [
      { "stage": "string", "count": number, "dropRate": "string" }
    ],
    "biggestDropoff": "string",
    "possibleReasons": ["string"]
  },
  "recommendations": [
    { "priority": "high" | "medium" | "low", "action": "string", "expectedImpact": "string", "reasoning": "string" }
  ],
  "alerts": ["string"]
}`
          },
          {
            role: "user",
            content: `Here is the current sales data for analysis:\n\n${JSON.stringify(dataContext, null, 2)}`
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a minute." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content ?? "";

    // Parse AI response (handle markdown code blocks)
    let analysis;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        overallHealth: "warning",
        headline: "Unable to parse AI analysis. Raw data is still available.",
        keyMetrics: [],
        dropoutAnalysis: { funnelStages: [], biggestDropoff: "Unknown", possibleReasons: [] },
        recommendations: [],
        alerts: [],
      };
    }

    return new Response(JSON.stringify({
      analysis,
      rawData: dataContext,
      generatedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sales-analysis error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
