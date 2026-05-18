import type { SubscriptionPlan } from './types';

export interface PlanLimits {
  history_days: number;   // -1 = unlimited
  circle_members: number; // -1 = unlimited
  ai_insights: number;    // -1 = unlimited, 0 = none
}

export interface Plan {
  id: SubscriptionPlan;
  label: string;
  price_monthly: number;
  price_annual: number;
  annual_label?: string;
  description?: string;
  features: string[];
  limits: PlanLimits;
  role: 'her' | 'him' | 'trainer' | 'all';
}

export const PLANS: Record<SubscriptionPlan, Plan> = {
  free: {
    id: 'free',
    label: 'Free',
    price_monthly: 0,
    price_annual: 0,
    features: [
      'Basic cycle tracking',
      'Current phase display',
      'Daily check-in (30-day history)',
      'Invite 1 person to circle',
    ],
    limits: { history_days: 30, circle_members: 1, ai_insights: 0 },
    role: 'her',
  },
  her_pro: {
    id: 'her_pro',
    label: 'Her Pro',
    price_monthly: 9.99,
    price_annual: 79,
    annual_label: '$79/yr — save $41',
    features: [
      'Everything in Free',
      'AI pattern analysis (unlimited)',
      'Full check-in history',
      'Sleep & HRV correlation',
      'Lab interpretation (blood, DUTCH, urine)',
      'Doctor Prep Mode + PDF export',
      'Unlimited circle members',
      'IronMind GritScore integration',
      'Mirror (accountability) tab',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'her',
  },
  partner: {
    id: 'partner',
    label: 'Partner',
    price_monthly: 6.99,
    price_annual: 55,
    annual_label: '$55/yr — save $29',
    features: [
      'Daily phase guidance',
      'What to Say scripts',
      'Forecast calendar',
      'IronMind context',
      'Learn section',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'him',
  },
  together: {
    id: 'together',
    label: 'Together',
    price_monthly: 14.99,
    price_annual: 119,
    annual_label: '$119/yr — save $61',
    description: 'Her Pro + Partner — save $2/mo vs separate',
    features: [
      'Everything in Her Pro',
      'Everything in Partner',
      'One shared billing',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'all',
  },
  trainer_pro: {
    id: 'trainer_pro',
    label: 'Trainer Pro',
    price_monthly: 29,
    price_annual: 232,
    annual_label: '$232/yr — save $116',
    description: 'Per trainer seat',
    features: [
      'Client dashboard (unlimited clients)',
      'Phase-synced session plans',
      'IronMind integration',
      'Science library',
      'Nutrition timing guides',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'trainer',
  },
  gym_license: {
    id: 'gym_license',
    label: 'Gym License',
    price_monthly: 199,
    price_annual: 1588,
    annual_label: '$1,588/yr — save $800',
    description: 'Up to 10 trainer seats',
    features: [
      'Up to 10 trainer seats',
      'All Trainer Pro features',
      'Gym branding',
      'Admin dashboard',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'trainer',
  },
  corporate: {
    id: 'corporate',
    label: 'Corporate',
    price_monthly: 0,
    price_annual: 0,
    description: 'Custom pricing — contact us',
    features: [
      'Unlimited trainer seats',
      'White-label option',
      'SSO + admin controls',
      'Dedicated support',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'trainer',
  },
  peri_pro: {
    id: 'peri_pro',
    label: 'Peri Pro',
    price_monthly: 14.99,
    price_annual: 119,
    annual_label: '$119/yr — save $61',
    description: 'Her Pro with Perimenopause mode',
    features: [
      'Everything in Her Pro',
      'Perimenopause tracking',
      'Hormone fluctuation patterns',
      'HRT context layer',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'her',
  },
  peri_together: {
    id: 'peri_together',
    label: 'Peri Together',
    price_monthly: 19.99,
    price_annual: 159,
    annual_label: '$159/yr — save $81',
    description: 'Peri Pro + Partner bundled',
    features: [
      'Everything in Peri Pro',
      'Everything in Partner',
      'One shared billing',
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 },
    role: 'all',
  },
};

// Gate helpers — call with the user's current plan
export function canUseAI(plan: SubscriptionPlan): boolean {
  return PLANS[plan].limits.ai_insights !== 0;
}

export function canAddCircleMember(plan: SubscriptionPlan, currentCount: number): boolean {
  const limit = PLANS[plan].limits.circle_members;
  return limit === -1 || currentCount < limit;
}

export function canViewHistory(plan: SubscriptionPlan, daysAgo: number): boolean {
  const limit = PLANS[plan].limits.history_days;
  return limit === -1 || daysAgo <= limit;
}

export function isProPlan(plan: SubscriptionPlan): boolean {
  return plan !== 'free';
}

// RevenueCat product IDs — match exactly what's configured in the RC dashboard
export const RC_PRODUCT_IDS: Partial<Record<SubscriptionPlan, { monthly: string; annual: string }>> = {
  her_pro:     { monthly: 'herside_her_pro_monthly',     annual: 'herside_her_pro_annual'     },
  partner:     { monthly: 'herside_partner_monthly',     annual: 'herside_partner_annual'     },
  together:    { monthly: 'herside_together_monthly',    annual: 'herside_together_annual'    },
  trainer_pro: { monthly: 'herside_trainer_pro_monthly', annual: 'herside_trainer_pro_annual' },
  peri_pro:    { monthly: 'herside_peri_pro_monthly',    annual: 'herside_peri_pro_annual'    },
};
