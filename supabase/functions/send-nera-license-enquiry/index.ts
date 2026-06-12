const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function esc(s: string) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  } as Record<string, string>)[c]);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim().slice(0, 120);
    const company = String(body.company ?? '').trim().slice(0, 160);
    const email = String(body.email ?? '').trim().slice(0, 200);
    const phone = String(body.phone ?? '').trim().slice(0, 40);
    const requirement = String(body.requirement ?? '').trim().slice(0, 2000);

    if (!name || !email || !company || !phone || !requirement) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Agatsa One <notifications@agatsa.in>',
        to: ['info@agatsa.com'],
        reply_to: email,
        subject: `NERA AI Licensing Enquiry — ${company}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 640px;">
            <h2 style="color:#7C4DFF;margin:0 0 8px;">New NERA AI Licensing Enquiry</h2>
            <p style="color:#555;margin:0 0 16px;">B2B request to license NERA AI for third-party wearables.</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:160px;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(name)}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(company)}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(email)}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(phone)}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Requirement</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap;">${esc(requirement)}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Received</td><td style="padding:8px;">${new Date().toISOString()}</td></tr>
            </table>
          </div>
        `,
        text: `New NERA AI Licensing Enquiry\n\nName: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nRequirement:\n${requirement}\n\nReceived: ${new Date().toISOString()}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Enquiry error:', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
