// AI analysis of Meta / Facebook ads performance (today + 30d), similar to sales-analysis.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const metrics = body?.metrics;
    if (!metrics) {
      return new Response(JSON.stringify({ error: "metrics payload required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a senior performance-marketing consultant for Agatsa (India, health-tech, D2C).
You are given Meta Ads data (today + last 30 days) alongside site-side revenue for the same period.

Return STRICT JSON:
{
  "overallHealth": "good" | "warning" | "critical",
  "headline": "One-line summary comparing spend vs revenue & ROAS trend",
  "keyMetrics": [{ "label": "string", "value": "string", "trend": "up"|"down"|"flat", "insight": "string" }],
  "bestDays": [{ "date": "YYYY-MM-DD", "revenue": number, "spend": number, "roas": number, "why": "string" }],
  "worstDays": [{ "date": "YYYY-MM-DD", "revenue": number, "spend": number, "roas": number, "why": "string" }],
  "topCampaigns": [{ "name": "string", "spend": number, "revenue_est": number, "verdict": "scale"|"hold"|"cut", "reason": "string" }],
  "recommendations": [{ "priority": "high"|"medium"|"low", "action": "string", "expectedImpact": "string", "timeframe": "immediate"|"this_week"|"this_month" }],
  "alerts": ["string"]
}

Rules:
- ROAS = site revenue / meta spend (already computed per day).
- Weekend vs weekday patterns matter; call out spend-heavy low-ROAS days.
- "Top campaigns" are ranked by spend; use site-side sessions (siteSessions) and metaPurchases to judge.
- Be blunt. If ROAS < 1 on a campaign spending significant budget, say "cut".
- Use INR (₹) formatting in strings.`,
          },
          {
            role: "user",
            content: `Meta Ads data (${new Date().toLocaleString("en-IN")}):\n\n${JSON.stringify(metrics, null, 2)}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResp.ok) {
      const status = aiResp.status;
      const t = await aiResp.text();
      const msg = status === 429 ? "Rate limited. Try again in a minute."
        : status === 402 ? "AI credits exhausted."
        : `AI error ${status}`;
      console.error("meta-ads-analysis AI error", status, t);
      return new Response(JSON.stringify({ error: msg }), {
        status: status === 429 || status === 402 ? status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const j = await aiResp.json();
    const raw = j.choices?.[0]?.message?.content ?? "";
    let analysis;
    try {
      analysis = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
    } catch {
      analysis = {
        overallHealth: "warning",
        headline: "Could not parse AI output.",
        keyMetrics: [], bestDays: [], worstDays: [], topCampaigns: [],
        recommendations: [], alerts: [],
      };
    }

    return new Response(JSON.stringify({ analysis, generatedAt: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
