const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, company, brochureType } = await req.json();

    if (!email || !brochureType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
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

    const brochureLabels: Record<string, string> = {
      doctors: 'For Doctors & Clinics',
      hospitals: 'For Hospitals & Health Systems',
      corporates: 'Corporate Wellness',
    };

    const label = brochureLabels[brochureType] || brochureType;

    // Send notification to info@agatsa.com
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Agatsa One <notifications@agatsa.in>',
        to: ['info@agatsa.com'],
        subject: `New Brochure Download Lead — ${label}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #7C4DFF;">New Lead — Brochure Download</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Brochure</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${label}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company / Clinic</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${company || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Timestamp</td><td style="padding: 8px;">${new Date().toISOString()}</td></tr>
            </table>
          </div>
        `,
        text: `New brochure download lead:\nBrochure: ${label}\nName: ${name || 'N/A'}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nTime: ${new Date().toISOString()}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      // Still allow download even if email fails
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Lead email error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
