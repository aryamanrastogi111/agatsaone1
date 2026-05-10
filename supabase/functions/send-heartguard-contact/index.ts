const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim().slice(0, 120);
    const email = String(body.email ?? '').trim().slice(0, 200);
    const phone = String(body.phone ?? '').trim().slice(0, 30);
    const clinic = String(body.clinic ?? '').trim().slice(0, 200);
    const city = String(body.city ?? '').trim().slice(0, 120);
    const message = String(body.message ?? '').trim().slice(0, 2000);

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Name, email and phone are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        subject: `HeartGuard Enquiry — ${name}${clinic ? ' · ' + clinic : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 640px;">
            <h2 style="color: #7C4DFF; margin: 0 0 12px;">New HeartGuard Enquiry</h2>
            <p style="color:#555; margin:0 0 16px;">A doctor has submitted the contact form on the HeartGuard page.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 160px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(phone)}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Clinic / Hospital</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(clinic) || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">City</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(city) || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(message) || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Source</td><td style="padding: 8px;">/heartguard</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Timestamp</td><td style="padding: 8px;">${new Date().toISOString()}</td></tr>
            </table>
          </div>
        `,
        text: `New HeartGuard Enquiry\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nClinic: ${clinic || 'N/A'}\nCity: ${city || 'N/A'}\nMessage: ${message || 'N/A'}\nTime: ${new Date().toISOString()}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('HeartGuard contact error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
