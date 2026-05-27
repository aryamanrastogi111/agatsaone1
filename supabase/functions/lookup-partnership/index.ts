// Public edge function: look up a partnership enquiry by enquiry number + email.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { enquiry_number, email } = await req.json();
    if (!enquiry_number || !email) {
      return new Response(JSON.stringify({ error: "Enquiry number and email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: enquiry } = await supabase
      .from("partnership_enquiries")
      .select("id, enquiry_number, partner_type, organisation_name, status, priority, created_at, goal_summary, contact_name")
      .eq("enquiry_number", String(enquiry_number).trim())
      .eq("contact_email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (!enquiry) {
      return new Response(JSON.stringify({ error: "No enquiry found with that number + email" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: messages } = await supabase
      .from("partnership_messages")
      .select("sender_type, sender_name, body, created_at")
      .eq("enquiry_id", enquiry.id)
      .eq("is_internal_note", false)
      .order("created_at", { ascending: true });

    return new Response(JSON.stringify({ enquiry, messages: messages || [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("lookup-partnership error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
