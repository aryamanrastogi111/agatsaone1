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
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(supabaseUrl, serviceKey);
    const paidStatuses = ["paid", "confirmed", "processing", "shipped", "delivered"];

    // ── 1. Gather current data ──
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      thisWeekOrders, prevWeekOrders, monthOrders,
      pendingOrders, dailyStats, cancelledOrders, pastAnalyses,
    ] = await Promise.all([
      sb.from("orders").select("amount, status, created_at, items, customer_name")
        .gte("created_at", weekAgo.toISOString()).in("status", paidStatuses),
      sb.from("orders").select("amount, status, created_at")
        .gte("created_at", prevWeekStart.toISOString()).lt("created_at", weekAgo.toISOString()).in("status", paidStatuses),
      sb.from("orders").select("amount, status, created_at, items")
        .gte("created_at", monthAgo.toISOString()),
      sb.from("orders").select("amount, status, created_at")
        .eq("status", "created").gte("created_at", weekAgo.toISOString()),
      sb.from("daily_stats").select("*")
        .gte("stat_date", monthAgo.toISOString().split("T")[0]).order("stat_date", { ascending: true }),
      sb.from("orders").select("amount, status, created_at")
        .in("status", ["cancelled", "refunded"]).gte("created_at", monthAgo.toISOString()),
      // ── Fetch last 5 past analyses for self-awareness ──
      sb.from("ai_analysis_history")
        .select("id, created_at, headline, overall_health, analysis_data, metrics_snapshot, suggestion_outcomes")
        .order("created_at", { ascending: false }).limit(5),
    ]);

    // ── 2. Compute metrics ──
    const thisWeekData = thisWeekOrders.data ?? [];
    const prevWeekData = prevWeekOrders.data ?? [];
    const monthData = monthOrders.data ?? [];
    const statsData = dailyStats.data ?? [];
    const cancelledData = cancelledOrders.data ?? [];

    const thisWeekRevenue = thisWeekData.reduce((s: number, o: any) => s + Number(o.amount), 0);
    const prevWeekRevenue = prevWeekData.reduce((s: number, o: any) => s + Number(o.amount), 0);
    const revenueChange = prevWeekRevenue > 0
      ? Math.round(((thisWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100)
      : thisWeekRevenue > 0 ? 100 : 0;

    const monthPaid = monthData.filter((o: any) => paidStatuses.includes(o.status));
    const monthPendingCount = monthData.filter((o: any) => o.status === "created").length;
    const conversionRate = (monthPaid.length + monthPendingCount + cancelledData.length) > 0
      ? Math.round((monthPaid.length / (monthPaid.length + monthPendingCount + cancelledData.length)) * 100) : 0;

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

    const avgDailyVisitors = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.peak_visitors || 0), 0) / statsData.length) : 0;
    const avgDailyOrders = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.total_orders || 0), 0) / statsData.length) : 0;

    // Today's numbers
    const todayOrders = monthData.filter((o: any) => new Date(o.created_at) >= todayStart && paidStatuses.includes(o.status));
    const todayRevenue = todayOrders.reduce((s: number, o: any) => s + Number(o.amount), 0);

    const dataContext = {
      period: "Last 7 days vs previous 7 days",
      today: { orders: todayOrders.length, revenue: todayRevenue },
      thisWeek: { orders: thisWeekData.length, revenue: thisWeekRevenue },
      prevWeek: { orders: prevWeekData.length, revenue: prevWeekRevenue },
      revenueChangePercent: revenueChange,
      last30Days: {
        totalOrders: monthData.length,
        paidOrders: monthPaid.length,
        pendingAbandoned: monthPendingCount,
        cancelled: cancelledData.length,
        conversionRate: `${conversionRate}%`,
      },
      avgDailyVisitors,
      avgDailyOrders,
      topProducts,
      dailyTrend: (statsData as any[]).slice(-14).map((d: any) => ({
        date: d.stat_date, visitors: d.peak_visitors, orders: d.total_orders, revenue: Number(d.total_revenue),
      })),
    };

    // ── 3. Build past suggestions context ──
    const pastAnalysesData = pastAnalyses.data ?? [];
    let pastContext = "";
    if (pastAnalysesData.length > 0) {
      pastContext = `\n\n## YOUR PREVIOUS ANALYSES (most recent first)\nYou must review these and evaluate whether your past recommendations helped or hurt. Be honest.\n\n`;
      pastAnalysesData.forEach((pa: any, i: number) => {
        const prevMetrics = pa.metrics_snapshot ?? {};
        pastContext += `### Analysis #${i + 1} — ${new Date(pa.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
Health: ${pa.overall_health} | Headline: ${pa.headline}
Metrics at that time: Week revenue ₹${prevMetrics.thisWeek?.revenue ?? "?"}, Orders: ${prevMetrics.thisWeek?.orders ?? "?"}, Conversion: ${prevMetrics.last30Days?.conversionRate ?? "?"}
Recommendations given: ${JSON.stringify((pa.analysis_data?.recommendations ?? []).map((r: any) => r.action))}
---\n`;
      });
    }

    // ── 4. Call AI with full context ──
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a senior e-commerce analytics consultant for Agatsa, a health-tech company selling ECG devices and wellness products in India.

CRITICAL: You have MEMORY. You can see your past analyses and recommendations below. You MUST:
1. Compare current metrics against metrics from your last analysis to see if things improved or worsened
2. Explicitly call out which of your past suggestions worked and which didn't
3. Adjust your recommendations based on what you've learned
4. Never repeat a suggestion that already backfired unless you have a different approach

Your response MUST be valid JSON with this exact structure:
{
  "overallHealth": "good" | "warning" | "critical",
  "headline": "One-line summary including comparison to last analysis",
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
  "pastSuggestionReview": [
    { "suggestion": "what you previously recommended", "outcome": "improved" | "worsened" | "unchanged" | "too_early", "evidence": "data-backed explanation", "nextStep": "what to do now" }
  ],
  "recommendations": [
    { "priority": "high" | "medium" | "low", "action": "string", "expectedImpact": "string", "reasoning": "string", "timeframe": "immediate | this_week | this_month" }
  ],
  "alerts": ["string"],
  "comparedToLast": {
    "revenueChange": "string describing change since last analysis",
    "orderChange": "string describing change",
    "overallDirection": "improving" | "declining" | "stable" | "first_analysis"
  }
}${pastContext}`
          },
          {
            role: "user",
            content: `Here is the CURRENT sales data (${new Date().toLocaleString("en-IN")}):\n\n${JSON.stringify(dataContext, null, 2)}`
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content ?? "";

    let analysis;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        overallHealth: "warning",
        headline: "Unable to parse AI analysis. Raw data is still available.",
        keyMetrics: [], dropoutAnalysis: { funnelStages: [], biggestDropoff: "Unknown", possibleReasons: [] },
        pastSuggestionReview: [], recommendations: [], alerts: [],
        comparedToLast: { revenueChange: "N/A", orderChange: "N/A", overallDirection: "first_analysis" },
      };
    }

    // ── 5. Save to history ──
    await sb.from("ai_analysis_history").insert({
      analysis_data: analysis,
      metrics_snapshot: dataContext,
      overall_health: analysis.overallHealth ?? "warning",
      headline: analysis.headline ?? "",
      suggestion_outcomes: analysis.pastSuggestionReview ?? null,
    });

    // ── 6. Return with history ──
    return new Response(JSON.stringify({
      analysis,
      rawData: dataContext,
      generatedAt: new Date().toISOString(),
      pastAnalyses: pastAnalysesData.map((pa: any) => ({
        id: pa.id,
        created_at: pa.created_at,
        headline: pa.headline,
        overall_health: pa.overall_health,
      })),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sales-analysis error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
