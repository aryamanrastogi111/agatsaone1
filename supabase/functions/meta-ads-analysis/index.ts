// Detailed AI analysis of Meta / Facebook ads performance.
// Consumes full insights payload: delivery health, health targets, top ads with creatives,
// campaign detail, 30-day daily/campaign data, and site-side attribution.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MODEL = "google/gemini-3.5-flash"; // capable, fast reasoning model for detailed analysis

// Reference targets — mirrored from admin panel Health & Targets row
const TARGETS = {
  blendedRoas: { op: ">=", value: 2.5, unit: "x" },
  attributedRoas: { op: ">=", value: 3.0, unit: "x" },
  frequency: { op: "range", min: 1.2, max: 2.5 },
  ctr: { op: ">=", value: 1.5, unit: "%" },
  cpm: { op: "<=", value: 350, unit: "₹" },
  dedupRatio: { op: ">=", value: 0.95, unit: "ratio" },
  emq: { op: ">=", value: 8.0, unit: "/10 (manual)" },
  attributionCoverage: { op: ">=", value: 0.60, unit: "ratio" },
};

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

    const system = `You are a senior performance-marketing consultant for Agatsa (India, health-tech D2C).
Products: SanketLife ECG (₹4,999), EasyTouch Wellness glucometer (₹3,999), EasyTouch Rhythm Band (₹8,999), CoreBalance Smart Scale, and Agatsa Bundle (₹12,999).
You will read a comprehensive dataset — Meta ad account metrics, delivery health vs 7-day baseline, campaign detail, top-spending ads (with creative thumbnails/headlines/body copy), 30-day daily/campaign data, and site-side attribution — and produce a rigorous diagnosis and action plan.

Targets that MUST be evaluated (compare actual vs target and grade each Green/Amber/Red):
- Blended ROAS ≥ 2.5x   |  Attributed ROAS ≥ 3.0x
- Frequency 1.2–2.5     |  CTR ≥ 1.5%
- CPM ≤ ₹350            |  Dedup rate ≥ 95%
- Attribution coverage ≥ 60% (share of paid site orders that carry fbclid/UTM)
- EMQ (Events Manager Match Quality) ≥ 8.0/10 — flag as "manual check" if not in data

Rules for verdicts:
- Campaign ROAS < 1 on meaningful spend (> ₹500/day) → verdict "cut"
- Frequency > 2.5 with declining CTR → creative fatigue → "rotate creative"
- CPM rising > 20% vs 7d avg → auction pressure / audience saturation
- CTR < 0.8% → creative resonance problem (comment on the headline/body if provided)
- Spend down >40% vs 7d avg → delivery collapse (check active campaigns, budget caps, review status)
- If attribution coverage < 60% → tracking hole (fbclid persistence, CAPI deduplication)

Return STRICT JSON, no markdown fences:
{
  "overallHealth": "good" | "warning" | "critical",
  "headline": "One blunt sentence stating the single most important finding",
  "diagnosis": "2–4 sentence root-cause narrative in plain English",
  "targetScorecard": [
    { "metric": "Blended ROAS" | "Attributed ROAS" | "Frequency" | "CTR" | "CPM" | "Dedup rate" | "Attribution coverage" | "EMQ",
      "actual": "string with unit", "target": "string with unit",
      "grade": "green" | "amber" | "red",
      "comment": "one line why + what it implies" }
  ],
  "keyMetrics": [{ "label": "string", "value": "string", "trend": "up"|"down"|"flat", "insight": "string" }],
  "bestDays": [{ "date": "YYYY-MM-DD", "revenue": number, "spend": number, "roas": number, "why": "string" }],
  "worstDays": [{ "date": "YYYY-MM-DD", "revenue": number, "spend": number, "roas": number, "why": "string" }],
  "campaignActions": [
    { "name": "string", "spend": number, "roas": number, "verdict": "scale"|"hold"|"cut"|"rotate",
      "reason": "concrete data-backed reason", "nextStep": "specific action, e.g. '+30% budget', 'pause', 'new creative from top ad concept'" }
  ],
  "creativeAnalysis": [
    { "adName": "string", "spend": number, "ctr": number, "frequency": number, "purchases": number,
      "verdict": "winner" | "fatiguing" | "underperforming" | "test-more",
      "creativeCritique": "specific critique of the headline/body/thumbnail if available — else say 'no creative preview available'",
      "recommendation": "concrete next move for this ad" }
  ],
  "budgetReallocation": {
    "summary": "one line reallocation thesis",
    "moves": [{ "from": "campaign or ad name", "to": "campaign or ad name", "amountPct": number, "rationale": "why" }]
  },
  "actionPlan7Day": [
    { "day": "Day 1" | "Day 2-3" | "Day 4-7", "action": "specific action", "owner": "string", "expectedImpact": "string" }
  ],
  "alerts": ["short critical warnings only, red-flag issues"],
  "recommendations": [
    { "priority": "high"|"medium"|"low", "action": "string", "expectedImpact": "string", "timeframe": "immediate"|"this_week"|"this_month" }
  ]
}

Be blunt, specific, and quantitative. Cite numbers from the data (e.g. "Frequency 3.2 on Rhythm-Prospecting, CTR fell 0.9%→0.5% over 7 days"). Use ₹ for money. Never hedge with "consider" — say "do X because Y".`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `TARGETS reference: ${JSON.stringify(TARGETS)}\n\nDATA (${new Date().toLocaleString("en-IN")}):\n${JSON.stringify(metrics, null, 2)}`,
          },
        ],
        temperature: 0.25,
        response_format: { type: "json_object" },
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
    } catch (err) {
      console.error("Failed to parse AI JSON", err, raw.slice(0, 500));
      analysis = {
        overallHealth: "warning",
        headline: "Could not parse AI output.",
        diagnosis: "The AI returned malformed JSON. Regenerate.",
        targetScorecard: [], keyMetrics: [], bestDays: [], worstDays: [],
        campaignActions: [], creativeAnalysis: [], budgetReallocation: { summary: "", moves: [] },
        actionPlan7Day: [], alerts: [], recommendations: [],
      };
    }

    return new Response(JSON.stringify({ analysis, generatedAt: new Date().toISOString(), model: MODEL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
