// Public edge function: customer looks up their ticket using ticket number + email.
// Returns the ticket + non-internal messages.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ticket_number, email } = await req.json();
    if (!ticket_number || !email) {
      return new Response(
        JSON.stringify({ error: "Ticket number and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: ticket } = await supabase
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, category, sub_issue, status, priority, customer_name, customer_email, created_at, updated_at, resolution_notes",
      )
      .eq("ticket_number", String(ticket_number).trim().toUpperCase())
      .eq("customer_email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (!ticket) {
      return new Response(
        JSON.stringify({ error: "No ticket found with those details" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("id, sender_type, sender_name, body, created_at")
      .eq("ticket_id", ticket.id)
      .eq("is_internal_note", false)
      .order("created_at", { ascending: true });

    return new Response(
      JSON.stringify({ ticket, messages: messages || [] }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("lookup-ticket error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
