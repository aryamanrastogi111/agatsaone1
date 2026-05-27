// Admin edge function: staff sends a reply on a ticket.
// Appends a ticket_messages row, updates the ticket's last_staff_message_at,
// and emails the customer from notifications@agatsa.in (replies routed to info@agatsa.com).
// Auth: caller must be a logged-in user with the 'admin' role.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

function esc(s: string | undefined | null) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user + admin role
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      ticket_id,
      body,
      is_internal_note,
      mark_resolved,
    }: {
      ticket_id: string;
      body: string;
      is_internal_note?: boolean;
      mark_resolved?: boolean;
    } = await req.json();

    if (!ticket_id || !body || body.trim().length < 1) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: ticket, error: tErr } = await admin
      .from("support_tickets")
      .select("*")
      .eq("id", ticket_id)
      .single();
    if (tErr || !ticket) {
      return new Response(JSON.stringify({ error: "Ticket not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderName = user.email?.split("@")[0] || "Agatsa Support";

    await admin.from("ticket_messages").insert({
      ticket_id,
      sender_type: is_internal_note ? "staff" : "staff",
      sender_name: senderName,
      sender_email: user.email,
      body: body.trim(),
      is_internal_note: !!is_internal_note,
    });

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (!is_internal_note) {
      patch.last_staff_message_at = new Date().toISOString();
      if (ticket.status === "open") patch.status = "in_progress";
    }
    if (mark_resolved) patch.status = "resolved";

    await admin.from("support_tickets").update(patch).eq("id", ticket_id);

    // Only email the customer for public replies
    if (!is_internal_note && RESEND_API_KEY) {
      const ticketNo = ticket.ticket_number || ticket.id.slice(0, 8);
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:600px; padding:24px; background:#fafafa;">
          <div style="background:#fff; padding:32px; border-radius:12px; border:1px solid #eee;">
            <div style="color:#7C4DFF; font-weight:700; font-size:14px; letter-spacing:1px;">AGATSA SUPPORT</div>
            <h1 style="margin:8px 0 4px; font-size:20px; color:#1A1A2E;">New reply on your ticket</h1>
            <div style="color:#888; font-size:13px; margin-bottom:20px;">Ticket ${esc(ticketNo)} · ${esc(ticket.subject)}</div>
            <div style="background:#f6f4ff; padding:18px; border-radius:8px; border-left:3px solid #7C4DFF; color:#1A1A2E; white-space:pre-wrap; line-height:1.6;">${esc(body.trim())}</div>
            ${mark_resolved ? `<div style="margin-top:20px; padding:14px; background:#ecfdf5; border-radius:8px; color:#065f46;"><strong>✓ Marked resolved.</strong> If your issue isn't fully resolved, just reply to this email.</div>` : ""}
            <p style="color:#666; font-size:13px; line-height:1.6; margin-top:24px;">Reply to this email or write to <a href="mailto:info@agatsa.com" style="color:#7C4DFF;">info@agatsa.com</a> with your ticket number <strong>${esc(ticketNo)}</strong>.</p>
            <p style="color:#888; font-size:12px; margin-top:28px; padding-top:16px; border-top:1px solid #eee;">— ${esc(senderName)}, Agatsa Support</p>
          </div>
        </div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Agatsa Support <notifications@agatsa.in>",
          to: [ticket.customer_email],
          reply_to: "info@agatsa.com",
          subject: `[${ticketNo}] Re: ${ticket.subject}`,
          html,
          text: `${body.trim()}\n\n— ${senderName}, Agatsa Support\nTicket: ${ticketNo}`,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ticket-reply error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
