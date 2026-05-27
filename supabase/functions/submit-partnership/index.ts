// Public edge function: partnership / collaboration enquiry submission.
// Creates partnership_enquiries row + first message, then emails
// the enquirer (confirmation) and info@agatsa.com (internal alert) via Resend.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface SubmitBody {
  partner_type: string;
  organisation_name: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;
  contact_name: string;
  contact_designation?: string;
  contact_email: string;
  contact_phone?: string;
  preferred_contact_method?: string;
  preferred_contact_window?: string;
  heard_from?: string;
  goal_summary: string;
  questionnaire_answers?: Array<{ question: string; answer: string }>;
  attachments?: Array<{ name: string; url: string }>;
  consent: boolean;
  honeypot?: string; // bot trap
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function esc(s: string | undefined | null) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com",
  "rediffmail.com", "live.com", "icloud.com", "protonmail.com",
]);

const TIMELINE_URGENT = ["Immediate (< 1 month)", "Within 30 days", "< 1 month"];

function scoreEnquiry(body: SubmitBody): number {
  let score = 30; // base
  const t = body.partner_type;
  // type weight
  if (t === "hospital") score += 20;
  else if (t === "corporate") score += 18;
  else if (t === "distributor") score += 16;
  else if (t === "investor") score += 15;
  else if (t === "doctor") score += 10;
  else if (t === "ngo" || t === "academic") score += 8;

  const answers = body.questionnaire_answers || [];
  const txt = answers.map((a) => `${a.question}::${a.answer}`).join(" | ").toLowerCase();

  if (TIMELINE_URGENT.some((x) => txt.includes(x.toLowerCase()))) score += 15;
  if (/500\+|2,000\+|10,000\+|1,000\+|pan-india|series b|growth/i.test(txt)) score += 15;
  if (/₹1 cr\+|₹25 l|10m\+|\$10m/i.test(txt)) score += 10;

  // work email bonus
  const domain = body.contact_email.split("@")[1]?.toLowerCase() || "";
  if (domain && !FREE_EMAIL_DOMAINS.has(domain)) score += 10;

  if ((body.goal_summary || "").length > 120) score += 5;

  return Math.min(100, Math.max(0, score));
}

function priorityFromScore(s: number): "low" | "medium" | "high" | "urgent" {
  if (s >= 80) return "urgent";
  if (s >= 65) return "high";
  if (s >= 45) return "medium";
  return "low";
}

async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text: string,
) {
  if (!RESEND_API_KEY) return { ok: false, skipped: true };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Agatsa Partnerships <notifications@agatsa.in>",
      to: Array.isArray(to) ? to : [to],
      reply_to: "info@agatsa.com",
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SubmitBody;

    // Honeypot
    if (body.honeypot && body.honeypot.trim() !== "") {
      return new Response(JSON.stringify({ success: true, ticket_number: "OK" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validation
    const errors: string[] = [];
    if (!body.partner_type) errors.push("Partnership type is required");
    if (!body.organisation_name || body.organisation_name.trim().length < 2)
      errors.push("Organisation name is required");
    if (!body.contact_name || body.contact_name.trim().length < 2)
      errors.push("Your name is required");
    if (!body.contact_email || !isEmail(body.contact_email))
      errors.push("Valid email is required");
    if (!body.goal_summary || body.goal_summary.trim().length < 30)
      errors.push("Please describe your goals (min 30 chars)");
    if (!body.consent) errors.push("Consent is required");

    if (errors.length) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const score = scoreEnquiry(body);
    const priority = priorityFromScore(score);
    const slaHours = priority === "urgent" ? 24 : priority === "high" ? 48 : 72;
    const slaDueAt = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const { data: enquiry, error: insertErr } = await supabase
      .from("partnership_enquiries")
      .insert({
        partner_type: body.partner_type,
        organisation_name: body.organisation_name.trim(),
        website: body.website?.trim() || null,
        country: body.country?.trim() || null,
        state: body.state?.trim() || null,
        city: body.city?.trim() || null,
        contact_name: body.contact_name.trim(),
        contact_designation: body.contact_designation?.trim() || null,
        contact_email: body.contact_email.trim().toLowerCase(),
        contact_phone: body.contact_phone?.trim() || null,
        preferred_contact_method: body.preferred_contact_method || null,
        preferred_contact_window: body.preferred_contact_window || null,
        heard_from: body.heard_from || null,
        goal_summary: body.goal_summary.trim(),
        questionnaire_answers: body.questionnaire_answers || [],
        attachments: body.attachments || [],
        consent: !!body.consent,
        score,
        priority,
        status: "new",
        sla_due_at: slaDueAt,
        last_customer_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr || !enquiry) {
      console.error("Enquiry insert error:", insertErr);
      return new Response(JSON.stringify({ error: "Failed to create enquiry" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // First message
    await supabase.from("partnership_messages").insert({
      enquiry_id: enquiry.id,
      sender_type: "customer",
      sender_name: enquiry.contact_name,
      sender_email: enquiry.contact_email,
      body: enquiry.goal_summary,
      attachments: enquiry.attachments,
    });

    const enquiryNo = enquiry.enquiry_number || enquiry.id.slice(0, 8);

    const answersRows = (body.questionnaire_answers || [])
      .map(
        (q) =>
          `<tr><td style="padding:6px 10px; border-bottom:1px solid #eee; color:#666; font-size:13px; vertical-align:top;">${esc(
            q.question,
          )}</td><td style="padding:6px 10px; border-bottom:1px solid #eee; color:#1A1A2E; font-size:13px;">${esc(
            q.answer,
          )}</td></tr>`,
      )
      .join("");

    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:600px; padding:24px; background:#fafafa;">
        <div style="background:#fff; padding:32px; border-radius:12px; border:1px solid #eee;">
          <div style="color:#7C4DFF; font-weight:700; font-size:14px; letter-spacing:1px;">AGATSA PARTNERSHIPS</div>
          <h1 style="margin:8px 0 16px; font-size:22px; color:#1A1A2E;">Your enquiry has been received</h1>
          <p style="color:#444; line-height:1.6;">Hi ${esc(enquiry.contact_name)},</p>
          <p style="color:#444; line-height:1.6;">Thank you for your interest in partnering with Agatsa. Our team will review your enquiry and respond within <strong>2 business days</strong>.</p>
          <table style="width:100%; margin:20px 0; border-collapse:collapse;">
            <tr><td style="padding:10px 0; border-bottom:1px solid #eee; color:#888; font-size:13px;">Enquiry Number</td><td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right; font-weight:600; color:#1A1A2E;">${esc(enquiryNo)}</td></tr>
            <tr><td style="padding:10px 0; border-bottom:1px solid #eee; color:#888; font-size:13px;">Partnership Type</td><td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right; color:#1A1A2E; text-transform:capitalize;">${esc(enquiry.partner_type)}</td></tr>
            <tr><td style="padding:10px 0; color:#888; font-size:13px;">Organisation</td><td style="padding:10px 0; text-align:right; color:#1A1A2E;">${esc(enquiry.organisation_name)}</td></tr>
          </table>
          <div style="background:#f6f4ff; padding:16px; border-radius:8px; margin:20px 0;">
            <div style="color:#888; font-size:12px; margin-bottom:6px;">YOUR GOALS</div>
            <div style="color:#1A1A2E; white-space:pre-wrap;">${esc(enquiry.goal_summary)}</div>
          </div>
          <p style="color:#444; line-height:1.6; font-size:14px;"><strong>What happens next:</strong></p>
          <ol style="color:#444; line-height:1.7; font-size:14px; padding-left:20px;">
            <li>Our partnerships team reviews your enquiry.</li>
            <li>If it's a fit, we'll reach out to schedule a call within 2 business days.</li>
            <li>We'll share relevant case studies, pricing, and next steps.</li>
          </ol>
          <p style="color:#666; font-size:13px; line-height:1.6; margin-top:24px;">For any updates, write to <a href="mailto:info@agatsa.com" style="color:#7C4DFF;">info@agatsa.com</a> with your enquiry number <strong>${esc(enquiryNo)}</strong>.</p>
          <p style="color:#888; font-size:12px; margin-top:32px; padding-top:16px; border-top:1px solid #eee;">Agatsa Software Pvt Ltd · FUTURE IS NEAR</p>
        </div>
      </div>`;

    const priorityColor =
      priority === "urgent" ? "#dc2626" : priority === "high" ? "#ea580c" : "#7C4DFF";

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width:680px; padding:20px;">
        <h2 style="color:#7C4DFF; margin:0 0 4px;">🤝 New Partnership Enquiry — ${esc(enquiryNo)}</h2>
        <div style="color:#888; font-size:12px; margin-bottom:16px;">
          Score: <strong style="color:${priorityColor};">${score}/100</strong> ·
          Priority: <strong style="text-transform:uppercase; color:${priorityColor};">${esc(priority)}</strong> ·
          SLA: ${slaHours}h
        </div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600; width:160px;">Type</td><td style="padding:8px; border-bottom:1px solid #eee; text-transform:capitalize;">${esc(enquiry.partner_type)}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Organisation</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(enquiry.organisation_name)}${enquiry.website ? ` · <a href="${esc(enquiry.website)}">${esc(enquiry.website)}</a>` : ""}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Contact</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(enquiry.contact_name)}${enquiry.contact_designation ? `, ${esc(enquiry.contact_designation)}` : ""}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Email</td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${esc(enquiry.contact_email)}">${esc(enquiry.contact_email)}</a></td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Phone</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(enquiry.contact_phone || "—")}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Location</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc([enquiry.city, enquiry.state, enquiry.country].filter(Boolean).join(", ") || "—")}</td></tr>
          <tr><td style="padding:8px; font-weight:600;">Heard from</td><td style="padding:8px;">${esc(enquiry.heard_from || "—")}</td></tr>
        </table>
        <div style="background:#f9f9f9; padding:12px; border-radius:6px; margin-bottom:12px;">
          <div style="font-weight:600; margin-bottom:6px;">Goals:</div>
          <div style="white-space:pre-wrap;">${esc(enquiry.goal_summary)}</div>
        </div>
        ${
          answersRows
            ? `<div style="margin-bottom:12px;">
                <div style="font-weight:600; margin-bottom:6px;">Questionnaire:</div>
                <table style="width:100%; border-collapse:collapse; border:1px solid #eee;">${answersRows}</table>
              </div>`
            : ""
        }
        <p style="margin-top:20px;"><a href="https://www.agatsaone.com/admin/partnerships" style="background:#7C4DFF; color:#fff; padding:10px 18px; border-radius:6px; text-decoration:none; font-weight:600;">Open in admin panel →</a></p>
      </div>`;

    if (RESEND_API_KEY) {
      await Promise.allSettled([
        sendEmail(
          enquiry.contact_email,
          `[${enquiryNo}] We've received your partnership enquiry`,
          customerHtml,
          `Hi ${enquiry.contact_name},\n\nYour partnership enquiry ${enquiryNo} has been received. Our team will respond within 2 business days.\n\nOrganisation: ${enquiry.organisation_name}\nType: ${enquiry.partner_type}\n\n— Agatsa Partnerships`,
        ),
        sendEmail(
          ["info@agatsa.com"],
          `[${enquiryNo}] ${priority.toUpperCase()} (${score}/100) — ${enquiry.organisation_name} · ${enquiry.partner_type}`,
          internalHtml,
          `New partnership enquiry ${enquiryNo} from ${enquiry.contact_name} <${enquiry.contact_email}>\nOrg: ${enquiry.organisation_name}\nType: ${enquiry.partner_type}\nScore: ${score}/100\n\n${enquiry.goal_summary}`,
        ),
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        enquiry_id: enquiry.id,
        enquiry_number: enquiryNo,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("submit-partnership error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
