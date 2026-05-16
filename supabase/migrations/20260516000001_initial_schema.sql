-- =============================================================
-- HerSide — Initial Schema
-- =============================================================

-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text check (role in ('her','him','trainer')) not null,
  life_stage text check (life_stage in ('regular','irregular','peri','none'))
    default 'regular',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CYCLE PROFILES (for 'her' users)
create table cycle_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  avg_cycle_length int default 28,
  avg_period_length int default 5,
  last_period_start date,
  tracking_since date default current_date,
  unique(user_id)
);

-- DAILY CHECK-INS
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  cycle_day int,
  phase text check (phase in ('menstrual','follicular','ovulation','luteal')),
  energy int check (energy between 1 and 10),
  mood text,
  skin text check (skin in ('clear','okay','breaking_out')),
  symptoms text[],
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- PERI SYMPTOM CHECK-INS
create table peri_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  hot_flashes int check (hot_flashes between 0 and 5),
  night_sweats int check (night_sweats between 0 and 5),
  brain_fog int check (brain_fog between 0 and 5),
  irritability int check (irritability between 0 and 5),
  sleep_issues int check (sleep_issues between 0 and 5),
  heart_palps int check (heart_palps between 0 and 5),
  joint_pain int check (joint_pain between 0 and 5),
  weight_changes int check (weight_changes between 0 and 5),
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- LAB RESULTS
create table lab_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  test_type text check (test_type in ('blood','dutch','urine')),
  test_date date,
  raw_pdf_url text,
  extracted_markers jsonb,
  cycle_day_drawn int,
  phase_drawn text,
  flagged_markers jsonb,
  ai_interpretation text,
  created_at timestamptz default now()
);

-- CIRCLE CONNECTIONS (who she's shared with)
create table circle_connections (
  id uuid primary key default gen_random_uuid(),
  her_user_id uuid references users(id) on delete cascade,
  connected_user_id uuid references users(id) on delete cascade,
  connection_type text check (connection_type in ('partner','trainer','ironmind','friend')),
  status text check (status in ('pending','active','revoked')) default 'pending',
  invite_token text unique default gen_random_uuid()::text,
  invite_expires_at timestamptz default (now() + interval '48 hours'),
  created_at timestamptz default now(),
  unique(her_user_id, connected_user_id)
);

-- PRIVACY PERMISSIONS (granular per connection)
create table privacy_permissions (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references circle_connections(id) on delete cascade,
  permission_key text not null,
  enabled boolean default false,
  unique(connection_id, permission_key)
);

-- WEARABLE SYNC LOG
create table wearable_syncs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  source text check (source in ('apple_health','oura','garmin','whoop')),
  synced_at timestamptz default now(),
  data_date date,
  hrv_avg numeric(5,2),
  sleep_hours numeric(4,2),
  sleep_efficiency numeric(5,2),
  resting_hr int,
  body_temp_deviation numeric(4,2),
  readiness_score int
);

-- IRONMIND GRITSCORE SYNC
create table gritscore_syncs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  synced_at timestamptz default now(),
  score_date date,
  gritscore int check (gritscore between 0 and 100),
  readiness_level text,
  phase_at_time text,
  cycle_day_at_time int
);

-- AI PATTERN CACHE (expensive to generate, cache results)
create table ai_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  generated_at timestamptz default now(),
  cycles_analyzed int,
  patterns jsonb,
  expires_at timestamptz default (now() + interval '7 days')
);

-- TOOLKIT COMPLETIONS
create table toolkit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  phase text,
  item_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, date, item_id)
);

-- ACCOUNTABILITY RESPONSES
create table accountability_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  question_id text not null,
  response_type text check (response_type in ('honest','partial','not')),
  created_at timestamptz default now(),
  unique(user_id, date, question_id)
);

-- SUBSCRIPTIONS
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  plan text check (plan in (
    'free','her_pro','partner','together','trainer_pro',
    'gym_license','corporate','peri_pro','peri_together'
  )),
  status text check (status in ('active','cancelled','past_due','trialing')),
  revenue_cat_id text,
  stripe_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  unique(user_id)
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table users enable row level security;
alter table cycle_profiles enable row level security;
alter table daily_checkins enable row level security;
alter table peri_checkins enable row level security;
alter table lab_results enable row level security;
alter table circle_connections enable row level security;
alter table privacy_permissions enable row level security;
alter table wearable_syncs enable row level security;
alter table gritscore_syncs enable row level security;
alter table ai_patterns enable row level security;
alter table toolkit_completions enable row level security;
alter table accountability_responses enable row level security;
alter table subscriptions enable row level security;

-- USERS
create policy "users can read own record"
  on users for select
  using (auth.uid() = id);

create policy "users can update own record"
  on users for update
  using (auth.uid() = id);

create policy "users can insert own record"
  on users for insert
  with check (auth.uid() = id);

-- CYCLE PROFILES
create policy "her owns her cycle profile"
  on cycle_profiles for all
  using (auth.uid() = user_id);

-- Trainers and partners can read cycle profile if an active connection + permission exists
create policy "connected users can read cycle profile"
  on cycle_profiles for select
  using (
    exists (
      select 1 from circle_connections cc
      join privacy_permissions pp on pp.connection_id = cc.id
      where cc.her_user_id = cycle_profiles.user_id
        and cc.connected_user_id = auth.uid()
        and cc.status = 'active'
        and pp.permission_key = 'phase_name'
        and pp.enabled = true
    )
  );

-- DAILY CHECK-INS
create policy "her owns her checkins"
  on daily_checkins for all
  using (auth.uid() = user_id);

create policy "connected users can read checkins if permitted"
  on daily_checkins for select
  using (
    exists (
      select 1 from circle_connections cc
      join privacy_permissions pp on pp.connection_id = cc.id
      where cc.her_user_id = daily_checkins.user_id
        and cc.connected_user_id = auth.uid()
        and cc.status = 'active'
        and pp.permission_key = 'energy_mood'
        and pp.enabled = true
    )
  );

-- PERI CHECK-INS
create policy "her owns her peri checkins"
  on peri_checkins for all
  using (auth.uid() = user_id);

-- LAB RESULTS
create policy "her owns her lab results"
  on lab_results for all
  using (auth.uid() = user_id);

-- CIRCLE CONNECTIONS
create policy "her sees her connections"
  on circle_connections for select
  using (auth.uid() = her_user_id or auth.uid() = connected_user_id);

create policy "her can create connections"
  on circle_connections for insert
  with check (auth.uid() = her_user_id);

create policy "her can update her connections"
  on circle_connections for update
  using (auth.uid() = her_user_id);

create policy "her can delete her connections"
  on circle_connections for delete
  using (auth.uid() = her_user_id);

-- Anyone with the token can read a pending invite (for accept flow)
create policy "pending invites readable by token holder"
  on circle_connections for select
  using (status = 'pending' and invite_expires_at > now());

-- PRIVACY PERMISSIONS
create policy "her can manage permissions for her connections"
  on privacy_permissions for all
  using (
    exists (
      select 1 from circle_connections cc
      where cc.id = privacy_permissions.connection_id
        and cc.her_user_id = auth.uid()
    )
  );

create policy "connected user can read their permissions"
  on privacy_permissions for select
  using (
    exists (
      select 1 from circle_connections cc
      where cc.id = privacy_permissions.connection_id
        and cc.connected_user_id = auth.uid()
    )
  );

-- WEARABLE SYNCS
create policy "her owns her wearable data"
  on wearable_syncs for all
  using (auth.uid() = user_id);

create policy "connected users can read wearable data if permitted"
  on wearable_syncs for select
  using (
    exists (
      select 1 from circle_connections cc
      join privacy_permissions pp on pp.connection_id = cc.id
      where cc.her_user_id = wearable_syncs.user_id
        and cc.connected_user_id = auth.uid()
        and cc.status = 'active'
        and pp.permission_key = 'sleep_hrv'
        and pp.enabled = true
    )
  );

-- GRITSCORE SYNCS
create policy "her owns her gritscore data"
  on gritscore_syncs for all
  using (auth.uid() = user_id);

create policy "connected users can read gritscore if permitted"
  on gritscore_syncs for select
  using (
    exists (
      select 1 from circle_connections cc
      join privacy_permissions pp on pp.connection_id = cc.id
      where cc.her_user_id = gritscore_syncs.user_id
        and cc.connected_user_id = auth.uid()
        and cc.status = 'active'
        and pp.permission_key = 'gritscore_context'
        and pp.enabled = true
    )
  );

-- AI PATTERNS
create policy "her owns her ai patterns"
  on ai_patterns for all
  using (auth.uid() = user_id);

-- TOOLKIT COMPLETIONS
create policy "her owns her toolkit completions"
  on toolkit_completions for all
  using (auth.uid() = user_id);

-- ACCOUNTABILITY RESPONSES
create policy "her owns her accountability responses"
  on accountability_responses for all
  using (auth.uid() = user_id);

-- SUBSCRIPTIONS
create policy "users can read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "users can insert own subscription"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "users can update own subscription"
  on subscriptions for update
  using (auth.uid() = user_id);

-- =============================================================
-- UPDATED_AT TRIGGER
-- =============================================================

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users
  for each row execute function handle_updated_at();
