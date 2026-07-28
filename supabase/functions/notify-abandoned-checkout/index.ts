// Sends a "Hot Lead" email to the internal team the moment a checkout visitor
// captures a valid phone (and/or email) but has not yet paid. Recipients mirror
// the order-confirmation team list so the same inbox that receives order &
// failed-payment alerts also receives abandoned-cart alerts and can WhatsApp
// the visitor immediately.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TEAM_RECIPIENTS = [
  "info@agatsa.com",
  "munfungaming@gmail.com",
  "rahul.amu2@gmail.com",
  "agr.neha@gmail.com",
];

function formatINR(paise: number): string {
  const amount = (paise || 0) / 100;
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

async function sendViaResend(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  resendApiKey: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${params.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { success: false, error: data?.message || JSON.stringify(data) };
  return { success: true, id: data?.id };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      sessionId,
      email,
      phone,          // full international format digits, no +
      dialCode,       // e.g. "+91"
      name,
      city,
      state,
      country,
      subtotalPaise,
      itemCount,
      items,          // [{name, qty, variantTitle}]
      stage,          // e.g. "checkout_contact_typing" | "checkout_payment_clicked"
      trigger,        // "phone_captured" | "payment_clicked" | "payment_failed" | "payment_cancelled"
    } = await req.json();

    if (!phone && !email) {
      return new Response(JSON.stringify({ error: "phone or email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── Dedup: only notify once per (session_id, trigger) within 24h ──
    if (sessionId) {
      const dedupKey = `abandoned_${trigger || "phone_captured"}_${sessionId}`;
      const { data: recent } = await supabase
        .from("email_send_log")
        .select("id")
        .eq("template_name", "abandoned_checkout_hot_lead")
        .eq("message_id", dedupKey)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1)
        .maybeSingle();

      if (recent) {
        return new Response(JSON.stringify({ deduped: true }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Reserve the dedup slot BEFORE sending so parallel calls short-circuit.
      await supabase.from("email_send_log").insert({
        message_id: dedupKey,
        template_name: "abandoned_checkout_hot_lead",
        recipient_email: TEAM_RECIPIENTS[0],
        status: "queued",
        metadata: { session_id: sessionId, trigger, phone: phone || null, email: email || null },
      });
    }

    // ── Build WhatsApp click-to-chat link ──
    const waPhoneDigits = (phone || "").replace(/\D/g, "");
    const waMessage = encodeURIComponent(
      `Hi${name ? " " + name.split(" ")[0] : ""}, this is Agatsa Support. I noticed you were checking out ${itemCount ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "our devices"}${subtotalPaise ? ` (${formatINR(subtotalPaise)})` : ""}. Can I help you complete the purchase? We offer free EMI, 7-day return and free shipping across India.`
    );
    const waLink = waPhoneDigits ? `https://wa.me/${waPhoneDigits}?text=${waMessage}` : "";
    const telLink = waPhoneDigits ? `tel:+${waPhoneDigits}` : "";
    const displayPhone = phone ? `${dialCode || ""} ${phone}`.trim() : "—";

    const triggerLabel: Record<string, string> = {
      phone_captured: "📞 Phone Captured — Not Paid",
      payment_clicked: "💳 Payment Clicked — Not Completed",
      payment_failed: "⚠️ Payment Failed",
      payment_cancelled: "🚪 Payment Cancelled",
    };
    const label = triggerLabel[trigger || "phone_captured"] || "Hot Lead";

    const itemsHtml = (items || [])
      .map((it: { name: string; qty: number; variantTitle?: string }) =>
        `<li style="margin:4px 0;font-size:14px;color:#334155;">${it.qty}× ${it.name}${it.variantTitle && it.variantTitle !== "Default Title" ? ` <span style="color:#64748b;">(${it.variantTitle})</span>` : ""}</li>`
      ).join("");

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
      <tr><td style="background:linear-gradient(135deg,#f59e0b 0%,#ef4444 100%);padding:24px 32px;">
        <p style="margin:0;font-size:12px;color:#fef3c7;letter-spacing:1.5px;font-weight:700;">HOT LEAD · ACT NOW</p>
        <h1 style="margin:6px 0 0;font-size:22px;color:#fff;font-weight:700;">${label}</h1>
      </td></tr>
      <tr><td style="padding:24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;width:120px;">Name</td>
            <td style="padding:8px 0;font-size:15px;color:#0f172a;font-weight:600;">${name || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;">Phone</td>
            <td style="padding:8px 0;font-size:15px;color:#0f172a;font-weight:600;">${displayPhone}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;">Email</td>
            <td style="padding:8px 0;font-size:15px;color:#0f172a;">${email || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;">Location</td>
            <td style="padding:8px 0;font-size:15px;color:#0f172a;">${[city, state, country].filter(Boolean).join(", ") || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;">Cart value</td>
            <td style="padding:8px 0;font-size:18px;color:#0f172a;font-weight:700;">${subtotalPaise ? formatINR(subtotalPaise) : "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;">Stage</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;">${stage || "—"}</td>
          </tr>
        </table>
        ${itemsHtml ? `<div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;">
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;letter-spacing:0.5px;font-weight:600;text-transform:uppercase;">Items in cart</p>
          <ul style="margin:0;padding-left:20px;">${itemsHtml}</ul>
        </div>` : ""}

        ${waLink ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="padding-right:8px;" width="50%">
              <a href="${waLink}" style="display:block;background:#25D366;color:#fff;text-decoration:none;padding:14px;border-radius:8px;text-align:center;font-weight:700;font-size:15px;">💬 WhatsApp Now</a>
            </td>
            <td style="padding-left:8px;" width="50%">
              <a href="${telLink}" style="display:block;background:#0f172a;color:#fff;text-decoration:none;padding:14px;border-radius:8px;text-align:center;font-weight:700;font-size:15px;">📞 Call Now</a>
            </td>
          </tr>
        </table>` : ""}
      </td></tr>
      <tr><td style="background:#f8fafc;padding:14px 32px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;color:#94a3b8;">Agatsa Software · Internal · Session ${sessionId || "unknown"}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    const text = `${label}
Name: ${name || "—"}
Phone: ${displayPhone}
Email: ${email || "—"}
Location: ${[city, state, country].filter(Boolean).join(", ") || "—"}
Cart: ${subtotalPaise ? formatINR(subtotalPaise) : "—"} (${itemCount || 0} items)
Stage: ${stage || "—"}
${waLink ? `WhatsApp: ${waLink}` : ""}`;

    const subject = `🔥 ${label} · ${name || phone || email} · ${subtotalPaise ? formatINR(subtotalPaise) : "cart"}`;
    const from = "Agatsa Alerts <orders@agatsa.in>";

    const results = await Promise.all(
      TEAM_RECIPIENTS.map((to) =>
        sendViaResend({ to, from, subject, html, text, resendApiKey: RESEND_API_KEY })
      )
    );

    const anySuccess = results.some((r) => r.success);
    await supabase.from("email_send_log").insert(
      TEAM_RECIPIENTS.map((recipient, i) => ({
        message_id: crypto.randomUUID(),
        template_name: "abandoned_checkout_hot_lead",
        recipient_email: recipient,
        status: results[i].success ? "sent" : "failed",
        error_message: results[i].error || null,
        metadata: { session_id: sessionId, trigger, phone: phone || null },
      }))
    );

    return new Response(JSON.stringify({ success: anySuccess, results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-abandoned-checkout error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
