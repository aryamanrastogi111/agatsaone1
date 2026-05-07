import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TIER_AMOUNTS_PAISE: Record<string, number> = {
  standard: 499900,
  plus: 999900,
  couple: 799900,
};

const TIER_NAMES: Record<string, string> = {
  standard: "Standard",
  plus: "Plus",
  couple: "Couple",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json();
    const {
      name,
      phone,
      email,
      tier,
      secondPersonName,
      secondPersonPhone,
      referralCode,
      quizAnswers,
      utm,
    } = body;

    if (!name || !phone || !tier || !TIER_AMOUNTS_PAISE[tier]) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (tier === "couple" && (!secondPersonName || !secondPersonPhone)) {
      return new Response(
        JSON.stringify({ error: "Second person details required for couple tier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const amountPaise = TIER_AMOUNTS_PAISE[tier];

    // Create Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        notes: { program: "lose-belly-90", tier, phone, name },
      }),
    });
    const rzpOrder = await rzpRes.json();
    if (!rzpRes.ok) {
      console.error("Razorpay order error:", rzpOrder);
      return new Response(JSON.stringify({ error: rzpOrder.error?.description || "Razorpay error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from("lose_belly_enrollments").insert({
      razorpay_order_id: rzpOrder.id,
      tier,
      amount: amountPaise / 100,
      currency: "INR",
      status: "created",
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      second_person_name: secondPersonName || null,
      second_person_phone: secondPersonPhone || null,
      referral_code: referralCode || null,
      quiz_answers: quizAnswers || null,
      utm_source: utm?.source || null,
      utm_medium: utm?.medium || null,
      utm_campaign: utm?.campaign || null,
    });

    return new Response(
      JSON.stringify({
        razorpayOrderId: rzpOrder.id,
        razorpayKeyId: RAZORPAY_KEY_ID,
        amountPaisa: amountPaise,
        currency: "INR",
        tierName: TIER_NAMES[tier],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
