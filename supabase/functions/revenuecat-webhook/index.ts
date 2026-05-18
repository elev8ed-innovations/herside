import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RC_WEBHOOK_SECRET = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');

// RevenueCat product ID → internal plan mapping
const PRODUCT_TO_PLAN: Record<string, string> = {
  herside_her_pro_monthly:     'her_pro',
  herside_her_pro_annual:      'her_pro',
  herside_partner_monthly:     'partner',
  herside_partner_annual:      'partner',
  herside_together_monthly:    'together',
  herside_together_annual:     'together',
  herside_trainer_pro_monthly: 'trainer_pro',
  herside_trainer_pro_annual:  'trainer_pro',
  herside_peri_pro_monthly:    'peri_pro',
  herside_peri_pro_annual:     'peri_pro',
};

// RevenueCat event type → internal status mapping
function rcEventToStatus(eventType: string): string {
  switch (eventType) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'PRODUCT_CHANGE':
    case 'UNCANCELLATION':
      return 'active';
    case 'CANCELLATION':
      return 'cancelled';
    case 'BILLING_ISSUE':
      return 'past_due';
    case 'TRIAL_STARTED':
    case 'TRIAL_CONVERTED':
      return 'trialing';
    default:
      return 'active';
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify RevenueCat authorization header
  const authHeader = req.headers.get('Authorization');
  if (RC_WEBHOOK_SECRET && authHeader !== RC_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const event = body.event as Record<string, unknown> | undefined;
  if (!event) return new Response('No event', { status: 400 });

  const eventType   = event.type as string;
  const rcUserId    = event.app_user_id as string;
  const productId   = event.product_id as string;
  const expiresAt   = event.expiration_at_ms
    ? new Date(event.expiration_at_ms as number).toISOString()
    : null;
  const revenueCatId = event.id as string | null ?? null;

  const plan = PRODUCT_TO_PLAN[productId];
  if (!plan) {
    // Unknown product — ignore gracefully
    return new Response(JSON.stringify({ ok: true, ignored: true }), { status: 200 });
  }

  const status = rcEventToStatus(eventType);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // RevenueCat app_user_id is our internal user ID
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', rcUserId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('subscriptions')
      .update({
        plan,
        status,
        revenue_cat_id: revenueCatId,
        current_period_end: expiresAt,
      })
      .eq('user_id', rcUserId);
  } else {
    await supabase
      .from('subscriptions')
      .insert({
        user_id: rcUserId,
        plan,
        status,
        revenue_cat_id: revenueCatId,
        current_period_end: expiresAt,
      });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
