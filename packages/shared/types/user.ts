export type UserRole = 'her' | 'him' | 'trainer';
export type LifeStage = 'regular' | 'irregular' | 'peri' | 'none';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  life_stage: LifeStage;
  created_at: string;
  updated_at: string;
}

export interface CycleProfile {
  id: string;
  user_id: string;
  avg_cycle_length: number;
  avg_period_length: number;
  last_period_start: string | null;
  tracking_since: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  revenue_cat_id: string | null;
  stripe_id: string | null;
  current_period_end: string | null;
  created_at: string;
}

export type SubscriptionPlan =
  | 'free'
  | 'her_pro'
  | 'partner'
  | 'together'
  | 'trainer_pro'
  | 'gym_license'
  | 'corporate'
  | 'peri_pro'
  | 'peri_together';

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
