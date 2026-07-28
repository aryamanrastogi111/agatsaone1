// Meta Marketing API: fetch today's + last-30-days ad account insights, per-campaign breakdown.
// Combines with our own DB (visitor_sessions/orders) to compute ROAS from actual paid orders.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const META_ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const META_AD_ACCOUNT_ID = Deno.env.get("META_AD_ACCOUNT_ID") || "";
const META_AD_ACCOUNT_IDS = Deno.env.get("META_AD_ACCOUNT_IDS") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GRAPH_VERSION = "v21.0";
const FB_SOURCES = ["facebook", "fb", "ig", "instagram", "meta", "an"];

function resolveAccountIds(): string[] {
  const raw = [META_AD_ACCOUNT_ID, META_AD_ACCOUNT_IDS]
    .join(",")
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const uniq = Array.from(new Set(raw));
  return uniq.map((id) => (id.startsWith("act_") ? id : `act_${id}`));
}

function istDateBounds() {
  const now = new Date();
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istMidnight = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
  const startUtc = new Date(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  const start30 = new Date(startUtc.getTime() - 29 * 24 * 60 * 60 * 1000);
  return {
    startUtc: startUtc.toISOString(),
    endUtc: endUtc.toISOString(),
    start30Utc: start30.toISOString(),
  };
}

function istDateKey(iso: string): string {
  const d = new Date(iso);
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

async function fetchMeta(path: string, params: Record<string, string>) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", META_ACCESS_TOKEN);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`Meta API ${r.status}: ${await r.text()}`);
  return await r.json();
}

const findAction = (actions: any[], type: string) =>
  parseInt(actions?.find((a: any) => a.action_type === type)?.value || "0", 10);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const accountIds = resolveAccountIds();
    if (!META_ACCESS_TOKEN || accountIds.length === 0) {
      return new Response(JSON.stringify({ error: "Meta credentials not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TODAY + LAST 30 DAYS for each account in parallel
    const perAccount = await Promise.all(accountIds.map(async (acct) => {
      const [accountLevel, campaignLevel, hist30Daily, hist30Campaign] = await Promise.all([
        fetchMeta(`${acct}/insights`, {
          fields: "spend,impressions,clicks,ctr,cpc,reach,cpm,frequency,actions,action_values",
          date_preset: "today",
        }),
        fetchMeta(`${acct}/insights`, {
          fields: "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,frequency,actions,action_values",
          date_preset: "today",
          level: "campaign",
          limit: "50",
        }),
        fetchMeta(`${acct}/insights`, {
          fields: "spend,impressions,clicks,actions,action_values",
          date_preset: "last_30d",
          time_increment: "1",
          limit: "500",
        }),
        fetchMeta(`${acct}/insights`, {
          fields: "campaign_id,campaign_name,spend,impressions,clicks,actions,action_values",
          date_preset: "last_30d",
          level: "campaign",
          limit: "200",
        }),
      ]);
      return { acct, accountLevel, campaignLevel, hist30Daily, hist30Campaign };
    }));

    // ── TODAY aggregation ──
    let spend = 0, impressions = 0, clicks = 0, reach = 0;
    let metaPurchases = 0, metaInitiateCheckout = 0;
    const perAccountSummary: any[] = [];
    for (const { acct, accountLevel } of perAccount) {
      const s = accountLevel.data?.[0] || {};
      const aSpend = parseFloat(s.spend || "0");
      const aImp = parseInt(s.impressions || "0", 10);
      const aClicks = parseInt(s.clicks || "0", 10);
      const aPurch = findAction(s.actions || [], "purchase");
      const aIC = findAction(s.actions || [], "initiate_checkout");
      spend += aSpend; impressions += aImp; clicks += aClicks;
      reach += parseInt(s.reach || "0", 10);
      metaPurchases += aPurch; metaInitiateCheckout += aIC;
      perAccountSummary.push({
        accountId: acct, spend: aSpend, impressions: aImp, clicks: aClicks,
        ctr: parseFloat(s.ctr || "0"), cpc: parseFloat(s.cpc || "0"), metaPurchases: aPurch,
      });
    }

    // DB queries
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { startUtc, endUtc, start30Utc } = istDateBounds();
    const PAID = ["paid", "shipped", "delivered", "confirmed", "processing"];

    // Fetch FB sessions using .in on utm_source (works reliably)
    const { data: fbSessionsToday } = await supabase
      .from("visitor_sessions")
      .select("session_id,started_at,utm_source,utm_medium,utm_campaign,utm_content,utm_term,exit_page")
      .gte("started_at", startUtc).lt("started_at", endUtc)
      .in("utm_source", FB_SOURCES)
      .order("started_at", { ascending: false })
      .limit(500);

    const { data: paidOrdersToday } = await supabase
      .from("orders").select("id,amount,status,created_at,paid_at,items,customer_email,customer_phone")
      .gte("created_at", startUtc).lt("created_at", endUtc).in("status", PAID);

    const revenueToday = (paidOrdersToday || []).reduce((s: number, o: any) => s + Number(o.amount || 0), 0);
    const roas = spend > 0 ? revenueToday / spend : 0;

    // ── Attribute paid orders to Meta campaigns ──
    // Link: orders.customer_email/phone → cart_sessions (has session_id + email/phone)
    //       → visitor_sessions.session_id (has utm_campaign + utm_source)
    // Only counts orders whose ACTUAL buyer's session came from a Meta source.
    const emails = Array.from(new Set(
      (paidOrdersToday || []).map((o: any) => (o.customer_email || "").toLowerCase().trim()).filter(Boolean)
    ));
    const phones = Array.from(new Set(
      (paidOrdersToday || []).map((o: any) => (o.customer_phone || "").replace(/\D/g, "").slice(-10)).filter((p) => p.length === 10)
    ));

    // Fetch cart_sessions matching these buyers (30d window to catch pre-purchase carts)
    let cartRows: any[] = [];
    if (emails.length || phones.length) {
      const orFilters: string[] = [];
      if (emails.length) orFilters.push(`email.in.(${emails.map((e) => `"${e}"`).join(",")})`);
      if (phones.length) orFilters.push(`phone.in.(${phones.map((p) => `"${p}"`).join(",")})`);
      const { data: carts } = await supabase
        .from("cart_sessions")
        .select("session_id,email,phone,updated_at")
        .gte("updated_at", start30Utc)
        .or(orFilters.join(","))
        .order("updated_at", { ascending: false })
        .limit(2000);
      cartRows = carts || [];
    }

    // For each buyer identity, collect their session_ids
    const sessionIdsByEmail = new Map<string, string[]>();
    const sessionIdsByPhone = new Map<string, string[]>();
    for (const c of cartRows) {
      if (c.email) {
        const k = c.email.toLowerCase().trim();
        if (!sessionIdsByEmail.has(k)) sessionIdsByEmail.set(k, []);
        sessionIdsByEmail.get(k)!.push(c.session_id);
      }
      if (c.phone) {
        const k = c.phone.replace(/\D/g, "").slice(-10);
        if (k.length === 10) {
          if (!sessionIdsByPhone.has(k)) sessionIdsByPhone.set(k, []);
          sessionIdsByPhone.get(k)!.push(c.session_id);
        }
      }
    }

    // Fetch visitor_sessions for those session_ids that came from Meta
    const allBuyerSessionIds = Array.from(new Set(cartRows.map((c) => c.session_id).filter(Boolean)));
    let buyerFbSessions: any[] = [];
    if (allBuyerSessionIds.length) {
      const { data: vs } = await supabase
        .from("visitor_sessions")
        .select("session_id,started_at,utm_source,utm_campaign,utm_content")
        .in("session_id", allBuyerSessionIds)
        .in("utm_source", FB_SOURCES)
        .order("started_at", { ascending: false })
        .limit(5000);
      buyerFbSessions = vs || [];
    }
    const fbSessionById = new Map<string, any>();
    for (const s of buyerFbSessions) {
      // keep most recent per session_id (already sorted desc)
      if (!fbSessionById.has(s.session_id)) fbSessionById.set(s.session_id, s);
    }

    const orderIdsAttributed = new Set<string>();
    const campaignAttribution: Record<string, { orders: number; revenue: number }> = {};

    for (const order of paidOrdersToday || []) {
      const email = (order.customer_email || "").toLowerCase().trim();
      const phone = (order.customer_phone || "").replace(/\D/g, "").slice(-10);
      const candidateSessionIds = [
        ...(email ? sessionIdsByEmail.get(email) || [] : []),
        ...(phone.length === 10 ? sessionIdsByPhone.get(phone) || [] : []),
      ];
      const orderTs = new Date(order.paid_at || order.created_at).getTime();
      // Pick this buyer's most recent FB session started before payment (last-touch)
      let best: any = null;
      for (const sid of candidateSessionIds) {
        const s = fbSessionById.get(sid);
        if (!s) continue;
        if (new Date(s.started_at).getTime() > orderTs) continue;
        if (!best || new Date(s.started_at).getTime() > new Date(best.started_at).getTime()) best = s;
      }
      if (best?.utm_campaign) {
        const key = String(best.utm_campaign);
        if (!campaignAttribution[key]) campaignAttribution[key] = { orders: 0, revenue: 0 };
        campaignAttribution[key].orders += 1;
        campaignAttribution[key].revenue += Number(order.amount || 0);
        orderIdsAttributed.add(order.id);
      }
    }

    const unattributedPaidOrders = (paidOrdersToday || []).length - orderIdsAttributed.size;
    const unattributedRevenue = (paidOrdersToday || []).filter((o: any) => !orderIdsAttributed.has(o.id))
      .reduce((s: number, o: any) => s + Number(o.amount || 0), 0);

    // Campaign match by ID (utm_campaign stores the numeric Meta campaign ID)
    const campaigns = perAccount.flatMap(({ acct, campaignLevel }) =>
      (campaignLevel.data || []).map((c: any) => {
        const cid = String(c.campaign_id || "");
        const cname = (c.campaign_name || "").toLowerCase();
        const sessions = (fbSessionsToday || []).filter((s: any) => {
          const u = (s.utm_campaign || "").toString();
          return u === cid || u.toLowerCase() === cname;
        });
        const attr = campaignAttribution[cid] || { orders: 0, revenue: 0 };
        return {
          accountId: acct,
          id: c.campaign_id,
          name: c.campaign_name,
          spend: parseFloat(c.spend || "0"),
          impressions: parseInt(c.impressions || "0", 10),
          clicks: parseInt(c.clicks || "0", 10),
          ctr: parseFloat(c.ctr || "0"),
          cpc: parseFloat(c.cpc || "0"),
          metaPurchases: findAction(c.actions || [], "purchase"),
          siteSessions: sessions.length,
          siteOrders: attr.orders,
          siteRevenue: attr.revenue,
          siteRoas: parseFloat(c.spend || "0") > 0 ? attr.revenue / parseFloat(c.spend) : 0,
        };
      })
    );


    // ── HISTORIC 30D: daily + campaign totals ──
    // Daily meta spend rolled up across accounts
    const dailySpendMap: Record<string, { spend: number; impressions: number; clicks: number; metaPurchases: number }> = {};
    for (const { hist30Daily } of perAccount) {
      for (const row of (hist30Daily.data || [])) {
        const day = row.date_start;
        if (!day) continue;
        if (!dailySpendMap[day]) dailySpendMap[day] = { spend: 0, impressions: 0, clicks: 0, metaPurchases: 0 };
        dailySpendMap[day].spend += parseFloat(row.spend || "0");
        dailySpendMap[day].impressions += parseInt(row.impressions || "0", 10);
        dailySpendMap[day].clicks += parseInt(row.clicks || "0", 10);
        dailySpendMap[day].metaPurchases += findAction(row.actions || [], "purchase");
      }
    }

    // Site-side daily revenue/orders (IST) from actual paid orders in last 30d
    const { data: paidOrders30 } = await supabase
      .from("orders").select("id,amount,created_at,status")
      .gte("created_at", start30Utc).lt("created_at", endUtc).in("status", PAID);

    const dailyRevMap: Record<string, { orders: number; revenue: number }> = {};
    for (const o of (paidOrders30 || [])) {
      const day = istDateKey(o.created_at);
      if (!dailyRevMap[day]) dailyRevMap[day] = { orders: 0, revenue: 0 };
      dailyRevMap[day].orders += 1;
      dailyRevMap[day].revenue += Number(o.amount || 0);
    }

    const allDays = new Set<string>([...Object.keys(dailySpendMap), ...Object.keys(dailyRevMap)]);
    const daily30 = Array.from(allDays).sort().map((d) => ({
      date: d,
      spend: dailySpendMap[d]?.spend || 0,
      impressions: dailySpendMap[d]?.impressions || 0,
      clicks: dailySpendMap[d]?.clicks || 0,
      metaPurchases: dailySpendMap[d]?.metaPurchases || 0,
      orders: dailyRevMap[d]?.orders || 0,
      revenue: dailyRevMap[d]?.revenue || 0,
      roas: (dailySpendMap[d]?.spend || 0) > 0 ? (dailyRevMap[d]?.revenue || 0) / dailySpendMap[d].spend : 0,
    }));

    // 30d campaign aggregate
    const campaignAgg: Record<string, any> = {};
    for (const { acct, hist30Campaign } of perAccount) {
      for (const c of (hist30Campaign.data || [])) {
        const key = `${acct}:${c.campaign_id}`;
        if (!campaignAgg[key]) {
          campaignAgg[key] = {
            accountId: acct, id: c.campaign_id, name: c.campaign_name,
            spend: 0, clicks: 0, impressions: 0, metaPurchases: 0,
          };
        }
        campaignAgg[key].spend += parseFloat(c.spend || "0");
        campaignAgg[key].clicks += parseInt(c.clicks || "0", 10);
        campaignAgg[key].impressions += parseInt(c.impressions || "0", 10);
        campaignAgg[key].metaPurchases += findAction(c.actions || [], "purchase");
      }
    }

    // Site sessions per campaign (last 30d) by campaign_id in utm_campaign
    const { data: fbSessions30 } = await supabase
      .from("visitor_sessions")
      .select("utm_campaign")
      .gte("started_at", start30Utc).lt("started_at", endUtc)
      .in("utm_source", FB_SOURCES)
      .limit(50000);

    const sessionByCampaign: Record<string, number> = {};
    for (const s of (fbSessions30 || [])) {
      const k = (s.utm_campaign || "").toString();
      if (!k) continue;
      sessionByCampaign[k] = (sessionByCampaign[k] || 0) + 1;
    }

    const campaigns30 = Object.values(campaignAgg).map((c: any) => ({
      ...c,
      ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
      cpc: c.clicks > 0 ? c.spend / c.clicks : 0,
      siteSessions: sessionByCampaign[String(c.id)] || 0,
    })).sort((a: any, b: any) => b.spend - a.spend);

    return new Response(JSON.stringify({
      generatedAt: new Date().toISOString(),
      accountIds,
      account: {
        spend, impressions, clicks, reach,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        cpc: clicks > 0 ? spend / clicks : 0,
        metaPurchases, metaInitiateCheckout,
      },
      accounts: perAccountSummary,
      site: {
        fbSessions: (fbSessionsToday || []).length,
        paidOrders: (paidOrdersToday || []).length,
        revenueToday,
        roas,
        attributedPaidOrders: orderIdsAttributed.size,
        unattributedPaidOrders,
        unattributedRevenue,
      },

      campaigns,
      recentFbSessions: (fbSessionsToday || []).slice(0, 15),
      historic30d: {
        daily: daily30,
        campaigns: campaigns30,
        totals: {
          spend: daily30.reduce((s, d) => s + d.spend, 0),
          revenue: daily30.reduce((s, d) => s + d.revenue, 0),
          orders: daily30.reduce((s, d) => s + d.orders, 0),
          metaPurchases: daily30.reduce((s, d) => s + d.metaPurchases, 0),
        },
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
