export type Phase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export type SkinCondition = 'clear' | 'okay' | 'breaking_out';
export type ConnectionType = 'partner' | 'trainer' | 'ironmind' | 'friend';
export type ConnectionStatus = 'pending' | 'active' | 'revoked';
export type WearableSource = 'apple_health' | 'oura' | 'garmin' | 'whoop';

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  cycle_day: number | null;
  phase: Phase | null;
  energy: number | null;
  mood: string | null;
  skin: SkinCondition | null;
  symptoms: string[] | null;
  notes: string | null;
  created_at: string;
}

export interface PeriCheckin {
  id: string;
  user_id: string;
  date: string;
  hot_flashes: number | null;
  night_sweats: number | null;
  brain_fog: number | null;
  irritability: number | null;
  sleep_issues: number | null;
  heart_palps: number | null;
  joint_pain: number | null;
  weight_changes: number | null;
  created_at: string;
}

export interface CircleConnection {
  id: string;
  her_user_id: string;
  connected_user_id: string | null;
  connection_type: ConnectionType;
  status: ConnectionStatus;
  invite_token: string;
  invite_expires_at: string;
  created_at: string;
}

export type PermissionKey =
  | 'phase_name'
  | 'energy_mood'
  | 'support_cues'
  | 'forecast'
  | 'cycle_dates'
  | 'symptoms'
  | 'health_data'
  | 'training_recs'
  | 'sleep_hrv'
  | 'emotional_data'
  | 'gritscore_context'
  | 'symptom_data';

export interface PrivacyPermission {
  id: string;
  connection_id: string;
  permission_key: PermissionKey;
  enabled: boolean;
}

export interface WearableSync {
  id: string;
  user_id: string;
  source: WearableSource;
  synced_at: string;
  data_date: string | null;
  hrv_avg: number | null;
  sleep_hours: number | null;
  sleep_efficiency: number | null;
  resting_hr: number | null;
  body_temp_deviation: number | null;
  readiness_score: number | null;
}

export interface GritscoreSync {
  id: string;
  user_id: string;
  synced_at: string;
  score_date: string | null;
  gritscore: number | null;
  readiness_level: string | null;
  phase_at_time: string | null;
  cycle_day_at_time: number | null;
}

export interface AiPattern {
  id: string;
  user_id: string;
  generated_at: string;
  cycles_analyzed: number | null;
  patterns: PatternItem[] | null;
  expires_at: string;
}

export interface PatternItem {
  pattern: string;
  evidence: string;
  research: string;
  what_to_try: string;
}

export interface ToolkitCompletion {
  id: string;
  user_id: string;
  date: string;
  phase: string | null;
  item_id: string;
  completed_at: string;
}

export interface AccountabilityResponse {
  id: string;
  user_id: string;
  date: string;
  question_id: string;
  response_type: 'honest' | 'partial' | 'not';
  created_at: string;
}
