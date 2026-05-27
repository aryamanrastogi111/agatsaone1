// Admin edge function: post a reply to a partnership enquiry.
// Appends a partnership_messages row and emails the contact via Resend
// (unless is_internal_note=true, in which case only the note is saved).

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

interface ReplyBody {
  enquiry_id: string;
  body: string;
  is_internal_note?: boolean;
  new_status?: string;
  preset?: "general" | "qualified" | "declined" | "proposal";
}

function esc(s: string | undefined | null) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
) {
  if (!RESEND_API_KEY) return { ok: false };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Agatsa Partnerships <notifications@agatsa.in>",
      to: [to],
      reply_to: "info@agatsa.com",
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Admin auth: require Authorization header with a valid user that has admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Verify admin role
    const { data: roleRow } = await supabase
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

    const body = (await req.json()) as ReplyBody;
    if (!body.enquiry_id || !body.body || body.body.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: enquiry, error: eErr } = await supabase
      .from("partnership_enquiries")
      .select("*")
      .eq("id", body.enquiry_id)
      .single();

    if (eErr || !enquiry) {
      return new Response(JSON.stringify({ error: "Enquiry not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // staff name
    const { data: tm } = await supabase
      .from("team_members")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle();
    const staffName = tm?.name || user.email || "Agatsa Team";

    const isNote = !!body.is_internal_note;

    await supabase.from("partnership_messages").insert({
      enquiry_id: enquiry.id,
      sender_type: isNote ? "system" : "staff",
      sender_name: staffName,
      sender_email: user.email || null,
      body: body.body.trim(),
      is_internal_note: isNote,
    });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (!isNote) updates.last_staff_message_at = new Date().toISOString();
    if (body.new_status) updates.status = body.new_status;
    await supabase
      .from("partnership_enquiries")
      .update(updates)
      .eq("id", enquiry.id);

    if (!isNote && RESEND_API_KEY) {
      const enquiryNo = enquiry.enquiry_number || enquiry.id.slice(0, 8);
      const subject =
        body.preset === "declined"
          ? `[${enquiryNo}] Update on your partnership enquiry`
          : body.preset === "qualified"
            ? `[${enquiryNo}] Let's take this forward`
            : `[${enquiryNo}] Reply from Agatsa Partnerships`;

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:600px; padding:24px; background:#fafafa;">
          <div style="background:#fff; padding:32px; border-radius:12px; border:1px solid #eee;">
            <div style="color:#7C4DFF; font-weight:700; font-size:14px; letter-spacing:1px;">AGATSA PARTNERSHIPS</div>
            <h1 style="margin:8px 0 16px; font-size:20px; color:#1A1A2E;">Hi ${esc(enquiry.contact_name)},</h1>
            <div style="color:#1A1A2E; line-height:1.6; white-space:pre-wrap; font-size:15px;">${esc(body.body)}</div>
            <p style="color:#666; font-size:13px; line-height:1.6; margin-top:24px; padding-top:16px; border-top:1px solid #eee;">
              ${esc(staffName)}<br/>
              Agatsa Partnerships · <a href="mailto:info@agatsa.com" style="color:#7C4DFF;">info@agatsa.com</a><br/>
              Enquiry ${esc(enquiryNo)}
            </p>
          </div>
        </div>`;

      await sendEmail(
        enquiry.contact_email,
        subject,
        html,
        `Hi ${enquiry.contact_name},\n\n${body.body}\n\n— ${staffName}\nAgatsa Partnerships · info@agatsa.com\nEnquiry ${enquiryNo}`,
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("partnership-reply error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
