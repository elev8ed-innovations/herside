// Supabase Edge Function — ironmind-webhook
// IronMind POSTs GritScore data here after each session.
// Verifies IRONMIND_WEBHOOK_SECRET, stores in gritscore_syncs.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface IronMindPayload {
  user_id: string;       // IronMind's user ID — we match via ironmind_user_id in users table
  gritscore: number;     // 0-100
  session_date: string;  // ISO date
  session_type: string;  // e.g. "strength", "cardio"
  hrv: number | null;
  raw_data: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const webhookSecret = Deno.env.get('IRONMIND_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Verify webhook signature
  const signature = req.headers.get('x-ironmind-signature');
  if (!webhookSecret || signature !== webhookSecret) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  let payload: IronMindPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Resolve HerSide user from IronMind user ID
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id')
    .eq('ironmind_user_id', payload.user_id)
    .single();

  if (userErr || !user) {
    // Unknown IronMind user — not an error, just not a HerSide user
    return new Response(JSON.stringify({ ok: true, matched: false }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const { error: insertErr } = await supabase.from('gritscore_syncs').insert({
    user_id: user.id,
    gritscore: payload.gritscore,
    hrv: payload.hrv,
    session_date: payload.session_date,
    session_type: payload.session_type,
    raw_data: payload.raw_data,
    synced_at: new Date().toISOString(),
  });

  if (insertErr) {
    console.error('ironmind-webhook insert error:', insertErr);
    return new Response(JSON.stringify({ error: 'Storage failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, matched: true }), {
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });
});
