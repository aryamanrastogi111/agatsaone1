// Public edge function: customer submits a support ticket from /support.
// Creates a row in support_tickets + an initial customer message, then emails
// the customer (confirmation) and info@agatsa.com (internal alert) via Resend.

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
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_number?: string;
  category: string;
  sub_issue: string;
  subject: string;
  issue_summary: string;
  priority?: "low" | "medium" | "high" | "urgent";
  type?: string;
  questionnaire_answers?: Array<{ question: string; answer: string }>;
  attachments?: Array<{ name: string; url: string }>;
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
      from: "Agatsa Support <notifications@agatsa.in>",
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

    // Validation
    const errors: string[] = [];
    if (!body.customer_name || body.customer_name.trim().length < 2)
      errors.push("Valid name is required");
    if (!body.customer_email || !isEmail(body.customer_email))
      errors.push("Valid email is required");
    if (!body.subject || body.subject.trim().length < 3)
      errors.push("Subject is required");
    if (!body.issue_summary || body.issue_summary.trim().length < 10)
      errors.push("Please describe your issue (min 10 chars)");
    if (!body.category) errors.push("Category is required");
    if (!body.sub_issue) errors.push("Issue is required");

    if (errors.length) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const priority = body.priority || "medium";
    const slaHours = priority === "urgent" ? 4 : priority === "high" ? 12 : 24;
    const slaDueAt = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const { data: ticket, error: insertErr } = await supabase
      .from("support_tickets")
      .insert({
        customer_name: body.customer_name.trim(),
        customer_email: body.customer_email.trim().toLowerCase(),
        customer_phone: body.customer_phone?.trim() || null,
        order_number: body.order_number?.trim() || null,
        type: body.type || body.category,
        category: body.category,
        sub_issue: body.sub_issue,
        subject: body.subject.trim(),
        issue_summary: body.issue_summary.trim(),
        priority,
        status: "open",
        questionnaire_answers: body.questionnaire_answers || [],
        attachments: body.attachments || [],
        sla_due_at: slaDueAt,
        last_customer_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr || !ticket) {
      console.error("Ticket insert error:", insertErr);
      return new Response(
        JSON.stringify({ error: "Failed to create ticket" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // First message
    await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id,
      sender_type: "customer",
      sender_name: ticket.customer_name,
      sender_email: ticket.customer_email,
      body: ticket.issue_summary,
      attachments: ticket.attachments,
    });

    // Customer confirmation email
    const ticketNo = ticket.ticket_number || ticket.id.slice(0, 8);
    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:600px; padding:24px; background:#fafafa;">
        <div style="background:#fff; padding:32px; border-radius:12px; border:1px solid #eee;">
          <div style="color:#7C4DFF; font-weight:700; font-size:14px; letter-spacing:1px;">AGATSA SUPPORT</div>
          <h1 style="margin:8px 0 16px; font-size:22px; color:#1A1A2E;">We've received your request</h1>
          <p style="color:#444; line-height:1.6;">Hi ${esc(ticket.customer_name)},</p>
          <p style="color:#444; line-height:1.6;">Thanks for reaching out. Your support ticket has been created. Our team will reply within <strong>${slaHours} hours</strong>.</p>
          <table style="width:100%; margin:20px 0; border-collapse:collapse;">
            <tr><td style="padding:10px 0; border-bottom:1px solid #eee; color:#888; font-size:13px;">Ticket Number</td><td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right; font-weight:600; color:#1A1A2E;">${esc(ticketNo)}</td></tr>
            <tr><td style="padding:10px 0; border-bottom:1px solid #eee; color:#888; font-size:13px;">Category</td><td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right; color:#1A1A2E;">${esc(ticket.category)}</td></tr>
            <tr><td style="padding:10px 0; border-bottom:1px solid #eee; color:#888; font-size:13px;">Issue</td><td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right; color:#1A1A2E;">${esc(ticket.sub_issue)}</td></tr>
            <tr><td style="padding:10px 0; color:#888; font-size:13px;">Priority</td><td style="padding:10px 0; text-align:right; color:#1A1A2E; text-transform:capitalize;">${esc(priority)}</td></tr>
          </table>
          <div style="background:#f6f4ff; padding:16px; border-radius:8px; margin:20px 0;">
            <div style="color:#888; font-size:12px; margin-bottom:6px;">YOUR MESSAGE</div>
            <div style="color:#1A1A2E; white-space:pre-wrap;">${esc(ticket.issue_summary)}</div>
          </div>
          <p style="color:#666; font-size:13px; line-height:1.6;">You can reply directly to this email to add more details to your ticket, or write to <a href="mailto:info@agatsa.com" style="color:#7C4DFF;">info@agatsa.com</a> with your ticket number <strong>${esc(ticketNo)}</strong>.</p>
          <p style="color:#888; font-size:12px; margin-top:32px; padding-top:16px; border-top:1px solid #eee;">Agatsa Software Pvt Ltd · FUTURE IS NEAR</p>
        </div>
      </div>`;

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width:640px; padding:20px;">
        <h2 style="color:#7C4DFF; margin:0 0 4px;">🎫 New Support Ticket — ${esc(ticketNo)}</h2>
        <div style="color:#888; font-size:12px; margin-bottom:16px;">Priority: <strong style="text-transform:uppercase; color:${priority === "urgent" ? "#dc2626" : priority === "high" ? "#ea580c" : "#7C4DFF"};">${esc(priority)}</strong> · SLA: ${slaHours}h</div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600; width:140px;">Customer</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(ticket.customer_name)}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Email</td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${esc(ticket.customer_email)}">${esc(ticket.customer_email)}</a></td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Phone</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(ticket.customer_phone || "—")}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Order #</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(ticket.order_number || "—")}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Category</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(ticket.category)}</td></tr>
          <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:600;">Issue</td><td style="padding:8px; border-bottom:1px solid #eee;">${esc(ticket.sub_issue)}</td></tr>
          <tr><td style="padding:8px; font-weight:600;">Subject</td><td style="padding:8px;">${esc(ticket.subject)}</td></tr>
        </table>
        <div style="background:#f9f9f9; padding:12px; border-radius:6px; margin-bottom:12px;">
          <div style="font-weight:600; margin-bottom:6px;">Customer's description:</div>
          <div style="white-space:pre-wrap;">${esc(ticket.issue_summary)}</div>
        </div>
        ${
          (body.questionnaire_answers || []).length
            ? `<div style="background:#fef9e7; padding:12px; border-radius:6px; margin-bottom:12px;">
                <div style="font-weight:600; margin-bottom:6px;">Self-help steps tried:</div>
                <ul style="margin:0; padding-left:20px;">
                  ${body.questionnaire_answers!.map((q) => `<li><strong>${esc(q.question)}</strong> — ${esc(q.answer)}</li>`).join("")}
                </ul>
              </div>`
            : ""
        }
        <p style="margin-top:20px;"><a href="https://www.agatsaone.com/admin/tickets" style="background:#7C4DFF; color:#fff; padding:10px 18px; border-radius:6px; text-decoration:none; font-weight:600;">Open in admin panel →</a></p>
      </div>`;

    if (RESEND_API_KEY) {
      await Promise.allSettled([
        sendEmail(
          ticket.customer_email,
          `[${ticketNo}] We've received your support request`,
          customerHtml,
          `Hi ${ticket.customer_name},\n\nYour support ticket ${ticketNo} has been created. We'll reply within ${slaHours} hours.\n\nIssue: ${ticket.sub_issue}\nDescription: ${ticket.issue_summary}\n\n— Agatsa Support`,
        ),
        sendEmail(
          ["info@agatsa.com"],
          `[${ticketNo}] ${priority.toUpperCase()} — ${ticket.subject}`,
          internalHtml,
          `New ticket ${ticketNo} from ${ticket.customer_name} <${ticket.customer_email}>\nCategory: ${ticket.category}\nIssue: ${ticket.sub_issue}\n\n${ticket.issue_summary}`,
        ),
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ticket_id: ticket.id,
        ticket_number: ticketNo,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("submit-ticket error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
