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
    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const today = now.toISOString().split("T")[0];

    const [
      thisWeekOrders, prevWeekOrders, monthOrders,
      pendingOrders, dailyStats, cancelledOrders, pastAnalyses,
      // NEW: expanded data sources
      lostCheckoutsRes, todayPageViewsRes, visitorSessionsRes,
      cartSessionsRes, todayStatsRes,
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
      sb.from("ai_analysis_history")
        .select("id, created_at, headline, overall_health, analysis_data, metrics_snapshot, suggestion_outcomes")
        .order("created_at", { ascending: false }).limit(5),
      // Lost checkouts: created > 10 min ago, last 7 days
      sb.from("orders").select("amount, customer_name, customer_email, customer_phone, created_at")
        .eq("status", "created").gte("created_at", weekAgo.toISOString()).lt("created_at", tenMinAgo.toISOString()),
      // Today's page views for page popularity
      sb.from("page_views").select("page_path, session_id, utm_source, utm_medium, utm_campaign, created_at")
        .gte("created_at", todayStart.toISOString()).order("created_at", { ascending: false }).limit(500),
      // Recent visitor sessions (last 7 days) for audience quality
      sb.from("visitor_sessions").select("session_id, started_at, last_seen_at, page_count, entry_page, exit_page, utm_source, utm_medium, device, referrer")
        .gte("started_at", weekAgo.toISOString()).order("started_at", { ascending: false }).limit(500),
      // Active cart sessions
      sb.from("cart_sessions").select("session_id, items, subtotal, item_count, email, phone, last_page, created_at, updated_at, converted_order_id")
        .gte("updated_at", weekAgo.toISOString()).order("updated_at", { ascending: false }).limit(100),
      // Today's stats row
      sb.from("daily_stats").select("total_visitors, peak_visitors, peak_checkout_visitors").eq("stat_date", today).maybeSingle(),
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

    // FIX: Use total_visitors (unique daily) instead of peak_visitors (concurrent)
    const avgDailyVisitors = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.total_visitors || 0), 0) / statsData.length) : 0;
    const avgDailyOrders = statsData.length > 0
      ? Math.round(statsData.reduce((s: number, d: any) => s + (d.total_orders || 0), 0) / statsData.length) : 0;

    // Today's numbers
    const todayOrders = monthData.filter((o: any) => new Date(o.created_at) >= todayStart && paidStatuses.includes(o.status));
    const todayRevenue = todayOrders.reduce((s: number, o: any) => s + Number(o.amount), 0);
    const todayStatsRow = todayStatsRes.data;

    // ── Lost checkouts analysis ──
    const lostCheckoutsData = lostCheckoutsRes.data ?? [];
    const lostCheckoutsRevenue = lostCheckoutsData.reduce((s: number, o: any) => s + Number(o.amount), 0);
    const lostWithContact = lostCheckoutsData.filter((o: any) => o.customer_email || o.customer_phone).length;

    // ── Page views analysis ──
    const pageViewsData = todayPageViewsRes.data ?? [];
    const pagePopularity: Record<string, number> = {};
    const uniqueSessionsToday = new Set<string>();
    pageViewsData.forEach((pv: any) => {
      pagePopularity[pv.page_path] = (pagePopularity[pv.page_path] || 0) + 1;
      uniqueSessionsToday.add(pv.session_id);
    });
    const topPages = Object.entries(pagePopularity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));

    // UTM source breakdown from today's page views
    const utmSources: Record<string, number> = {};
    pageViewsData.forEach((pv: any) => {
      const src = pv.utm_source || "organic/direct";
      utmSources[src] = (utmSources[src] || 0) + 1;
    });

    // ── Visitor sessions analysis (audience quality) ──
    const sessionsData = visitorSessionsRes.data ?? [];
    const avgPageCount = sessionsData.length > 0
      ? Math.round(sessionsData.reduce((s: number, vs: any) => s + (vs.page_count || 1), 0) / sessionsData.length * 10) / 10 : 0;
    const avgSessionDurationSec = sessionsData.length > 0
      ? Math.round(sessionsData.reduce((s: number, vs: any) => {
          const start = new Date(vs.started_at).getTime();
          const end = new Date(vs.last_seen_at).getTime();
          return s + Math.max(0, (end - start) / 1000);
        }, 0) / sessionsData.length)
      : 0;
    const bounceRate = sessionsData.length > 0
      ? Math.round(sessionsData.filter((vs: any) => (vs.page_count || 1) <= 1).length / sessionsData.length * 100)
      : 0;
    const deviceBreakdown: Record<string, number> = {};
    const referrerBreakdown: Record<string, number> = {};
    const entryPages: Record<string, number> = {};
    const exitPages: Record<string, number> = {};
    sessionsData.forEach((vs: any) => {
      deviceBreakdown[vs.device || "unknown"] = (deviceBreakdown[vs.device || "unknown"] || 0) + 1;
      referrerBreakdown[vs.referrer || "direct"] = (referrerBreakdown[vs.referrer || "direct"] || 0) + 1;
      if (vs.entry_page) entryPages[vs.entry_page] = (entryPages[vs.entry_page] || 0) + 1;
      if (vs.exit_page) exitPages[vs.exit_page] = (exitPages[vs.exit_page] || 0) + 1;
    });

    // ── Cart sessions ──
    const cartsData = cartSessionsRes.data ?? [];
    const activeCarts = cartsData.filter((c: any) => !c.converted_order_id && c.item_count > 0);
    const convertedCarts = cartsData.filter((c: any) => c.converted_order_id);
    const cartConversionRate = cartsData.length > 0
      ? Math.round(convertedCarts.length / cartsData.length * 100) : 0;

    const dataContext = {
      period: "Last 7 days vs previous 7 days",
      today: {
        orders: todayOrders.length,
        revenue: todayRevenue,
        totalVisitors: todayStatsRow?.total_visitors ?? 0,
        peakConcurrentVisitors: todayStatsRow?.peak_visitors ?? 0,
        peakCheckoutVisitors: todayStatsRow?.peak_checkout_visitors ?? 0,
        uniqueSessionsFromPageViews: uniqueSessionsToday.size,
      },
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
      // FIX: Use total_visitors in dailyTrend
      dailyTrend: (statsData as any[]).slice(-14).map((d: any) => ({
        date: d.stat_date,
        totalVisitors: d.total_visitors,
        peakConcurrent: d.peak_visitors,
        orders: d.total_orders,
        revenue: Number(d.total_revenue),
      })),
      // NEW: Lost checkouts
      lostCheckouts: {
        count: lostCheckoutsData.length,
        totalRevenueLost: lostCheckoutsRevenue,
        withContactInfo: lostWithContact,
        withoutContactInfo: lostCheckoutsData.length - lostWithContact,
      },
      // NEW: Page analytics
      topPagesToday: topPages,
      utmSourceBreakdown: utmSources,
      // NEW: Audience quality
      audienceQuality: {
        totalSessionsThisWeek: sessionsData.length,
        avgPagesPerSession: avgPageCount,
        avgSessionDurationSeconds: avgSessionDurationSec,
        bounceRate: `${bounceRate}%`,
        deviceBreakdown,
        referrerBreakdown,
        topEntryPages: Object.entries(entryPages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p, c]) => ({ page: p, count: c })),
        topExitPages: Object.entries(exitPages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p, c]) => ({ page: p, count: c })),
      },
      // NEW: Cart sessions
      cartActivity: {
        activeCarts: activeCarts.length,
        activeCartsValue: activeCarts.reduce((s: number, c: any) => s + Number(c.subtotal || 0), 0),
        convertedCarts: convertedCarts.length,
        cartConversionRate: `${cartConversionRate}%`,
      },
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
Avg daily visitors: ${prevMetrics.avgDailyVisitors ?? "?"}, Bounce rate: ${prevMetrics.audienceQuality?.bounceRate ?? "?"}
Lost checkouts: ${prevMetrics.lostCheckouts?.count ?? "?"}, Lost revenue: ₹${prevMetrics.lostCheckouts?.totalRevenueLost ?? "?"}
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

You now have access to a MUCH wider dataset than before. Analyze ALL of it:
- **Revenue & Orders**: Weekly trends, daily snapshots, product performance
- **Visitor Analytics**: total_visitors is UNIQUE daily visitors (not concurrent). peakConcurrent is max simultaneous users. Use total_visitors for traffic analysis.
- **Audience Quality**: Bounce rate, pages per session, session duration, device & referrer breakdown, entry/exit pages
- **Lost Checkouts**: Abandoned orders with revenue impact and contact recovery potential
- **Cart Activity**: Active carts, conversion rate, cart value
- **UTM/Traffic Sources**: Where visitors come from
- **Page Popularity**: Which pages get most views today

CRITICAL: You have MEMORY. You can see your past analyses and recommendations below. You MUST:
1. Compare current metrics against metrics from your last analysis to see if things improved or worsened
2. Explicitly call out which of your past suggestions worked and which didn't
3. Adjust your recommendations based on what you've learned
4. Never repeat a suggestion that already backfired unless you have a different approach
5. Use total_visitors (unique daily count) NOT peak_visitors (concurrent) for traffic/conversion analysis

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
}

Include insights from ALL data sources. Mention bounce rate, lost checkout recovery, audience quality, top traffic sources, and page engagement in your analysis. Build a complete funnel: Visitors → Device Pages → Checkout → Payment → Conversion.${pastContext}`
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
