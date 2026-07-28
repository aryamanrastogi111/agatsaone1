// Meta Marketing API: fetch today's ad account insights + per-campaign breakdown.
// Combines with our own DB (visitor_sessions/orders) to compute ROAS from actual paid orders.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const META_ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const META_AD_ACCOUNT_ID = Deno.env.get("META_AD_ACCOUNT_ID") || "";
const META_AD_ACCOUNT_IDS = Deno.env.get("META_AD_ACCOUNT_IDS") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function resolveAccountIds(): string[] {
  const raw = [META_AD_ACCOUNT_ID, META_AD_ACCOUNT_IDS]
    .join(",")
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const uniq = Array.from(new Set(raw));
  return uniq.map((id) => (id.startsWith("act_") ? id : `act_${id}`));
}

const GRAPH_VERSION = "v21.0";

function istDateBounds() {
  // Today in IST as UTC range for our DB queries
  const now = new Date();
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istMidnight = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
  // Convert IST midnight back to UTC
  const startUtc = new Date(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  return { startUtc: startUtc.toISOString(), endUtc: endUtc.toISOString() };
}

async function fetchMeta(path: string, params: Record<string, string>) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", META_ACCESS_TOKEN);
  const r = await fetch(url.toString());
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Meta API ${r.status}: ${t}`);
  }
  return await r.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
      return new Response(JSON.stringify({ error: "Meta credentials not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const acct = META_AD_ACCOUNT_ID.startsWith("act_") ? META_AD_ACCOUNT_ID : `act_${META_AD_ACCOUNT_ID}`;

    // Account-level insights (today, IST via timezone param)
    const accountLevel = await fetchMeta(`${acct}/insights`, {
      fields: "spend,impressions,clicks,ctr,cpc,reach,actions,action_values",
      date_preset: "today",
      time_increment: "1",
    });

    // Per-campaign breakdown
    const campaignLevel = await fetchMeta(`${acct}/insights`, {
      fields: "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,action_values",
      date_preset: "today",
      level: "campaign",
      limit: "50",
    });

    const summary = accountLevel.data?.[0] || {};
    const spend = parseFloat(summary.spend || "0");
    const impressions = parseInt(summary.impressions || "0", 10);
    const clicks = parseInt(summary.clicks || "0", 10);
    const reach = parseInt(summary.reach || "0", 10);
    const findAction = (actions: any[], type: string) =>
      parseInt(actions?.find((a: any) => a.action_type === type)?.value || "0", 10);
    const metaPurchases = findAction(summary.actions || [], "purchase");
    const metaInitiateCheckout = findAction(summary.actions || [], "initiate_checkout");

    // Query our DB for ground-truth ROAS today
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { startUtc, endUtc } = istDateBounds();

    const { data: fbSessions } = await supabase
      .from("visitor_sessions")
      .select("session_id,started_at,utm_source,utm_medium,utm_campaign,utm_content,utm_term,exit_page")
      .gte("started_at", startUtc)
      .lt("started_at", endUtc)
      .or("utm_source.ilike.%facebook%,utm_source.ilike.%meta%,utm_source.ilike.%fb%,utm_medium.ilike.%paid%,utm_medium.ilike.%cpc%");

    const { data: paidOrders } = await supabase
      .from("orders")
      .select("id,amount,status,created_at,paid_at")
      .gte("created_at", startUtc)
      .lt("created_at", endUtc)
      .in("status", ["paid", "shipped", "delivered"]);

    // Rough attribution: paid orders today (site-wide) if FB sessions exist today.
    // Fine-grained per-visitor attribution can be layered later.
    const revenueToday = (paidOrders || []).reduce((s: number, o: any) => s + Number(o.amount || 0), 0);
    const roas = spend > 0 ? revenueToday / spend : 0;

    // Campaign breakdown enriched with our own session counts by utm_campaign
    const campaigns = (campaignLevel.data || []).map((c: any) => {
      const sessions = (fbSessions || []).filter(
        (s: any) => (s.utm_campaign || "").toLowerCase() === (c.campaign_name || "").toLowerCase()
      );
      return {
        id: c.campaign_id,
        name: c.campaign_name,
        spend: parseFloat(c.spend || "0"),
        impressions: parseInt(c.impressions || "0", 10),
        clicks: parseInt(c.clicks || "0", 10),
        ctr: parseFloat(c.ctr || "0"),
        cpc: parseFloat(c.cpc || "0"),
        metaPurchases: findAction(c.actions || [], "purchase"),
        siteSessions: sessions.length,
      };
    });

    return new Response(JSON.stringify({
      generatedAt: new Date().toISOString(),
      account: {
        spend, impressions, clicks, reach,
        ctr: parseFloat(summary.ctr || "0"),
        cpc: parseFloat(summary.cpc || "0"),
        metaPurchases,
        metaInitiateCheckout,
      },
      site: {
        fbSessions: (fbSessions || []).length,
        paidOrders: (paidOrders || []).length,
        revenueToday,
        roas,
      },
      campaigns,
      recentFbSessions: (fbSessions || []).slice(-10).reverse(),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
