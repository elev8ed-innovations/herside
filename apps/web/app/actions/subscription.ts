'use server';

import { sbSelect, sbInsert, sbPatch } from '@/lib/supabase';
import type { SubscriptionPlan, SubscriptionStatus, Subscription } from '@herside/shared';
import { canUseAI, canAddCircleMember } from '@herside/shared';

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const rows = await sbSelect<Subscription>('subscriptions', `user_id=eq.${userId}&limit=1`);
  return rows[0] ?? null;
}

export async function getPlan(userId: string): Promise<SubscriptionPlan> {
  const sub = await getSubscription(userId);
  if (!sub || sub.status === 'cancelled') return 'free';
  if (sub.status === 'past_due') return 'free';
  return sub.plan;
}

// Called by RevenueCat webhook (or Stripe webhook) after payment confirmed
export async function upsertSubscription(
  userId: string,
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
  revenueCatId: string | null,
  stripeId: string | null,
  currentPeriodEnd: string | null,
): Promise<void> {
  const existing = await getSubscription(userId);
  if (existing) {
    await sbPatch('subscriptions', `user_id=eq.${userId}`, {
      plan,
      status,
      revenue_cat_id: revenueCatId,
      stripe_id: stripeId,
      current_period_end: currentPeriodEnd,
    });
  } else {
    await sbInsert('subscriptions', {
      user_id: userId,
      plan,
      status,
      revenue_cat_id: revenueCatId,
      stripe_id: stripeId,
      current_period_end: currentPeriodEnd,
    });
  }
}

// Convenience gate checks used by server components
export async function userCanUseAI(userId: string): Promise<boolean> {
  const plan = await getPlan(userId);
  return canUseAI(plan);
}

export async function userCanAddCircleMember(userId: string, currentCount: number): Promise<boolean> {
  const plan = await getPlan(userId);
  return canAddCircleMember(plan, currentCount);
}
