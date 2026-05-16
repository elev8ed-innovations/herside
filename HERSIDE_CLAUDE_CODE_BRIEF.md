# HerSide — Claude Code Master Brief
# Complete Product Specification for Production Build
# Version 1.0 · May 2026

---

## WHAT THIS DOCUMENT IS

This is the complete specification for building HerSide (herside.app) from
prototype to production. Every screen has been designed and validated. Every
feature is specified. Your job is to build it — not design it.

Use this document as your source of truth. When in doubt, refer back here.

---

## THE PRODUCT IN ONE SENTENCE

HerSide is a cycle intelligence platform connecting women with the people in
their corner — partner, personal trainer, and mental performance AI — through
a privacy-first data sharing system she fully controls.

---

## TECH STACK

### Frontend (Mobile — primary)
- React Native + Expo (SDK 51+)
- TypeScript throughout — no JavaScript files
- NativeWind for styling (Tailwind for React Native)
- Expo Router for navigation
- React Native Reanimated 3 for animations
- React Native Gesture Handler for interactions

### Frontend (Web — trainer + partner dashboards)
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- 21st.dev Magic MCP for component generation
  (install: npx @21st-dev/magic@latest)

### Backend
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Row Level Security (RLS) on every table — non-negotiable
- Supabase Edge Functions for serverless logic

### AI Engine
- Anthropic Claude API (claude-sonnet-4-20250514)
- Claude Vision API for PDF lab report parsing
- Streaming responses for real-time insight generation

### Hosting
- Mobile: Expo EAS Build → Apple App Store + Google Play
- Web dashboards: Netlify (YES — Netlify works perfectly)
  - Netlify handles Next.js SSR via @netlify/plugin-nextjs
  - Deploy command: next build
  - Environment variables set in Netlify dashboard
  - Netlify Functions replace Vercel serverless if needed
  - Free tier handles first 1,000 users easily
- Alternative: Vercel (also works, slightly simpler Next.js integration)

### Wearable Data
- Apple HealthKit (iOS) — sleep, HRV, activity, cycle data
- Google Health Connect (Android) — equivalent
- Oura API (REST) — HRV, body temperature, readiness
- IronMind GritOS API — GritScore, mental readiness

### Payments
- RevenueCat (handles App Store + Play Store subscriptions)
- Stripe (web subscriptions for trainer/gym plans)

---

## DESIGN SYSTEM

### Colors — use exactly these hex values
```
--her:    #C96B84   (rose — primary brand)
--her2:   #A84F68   (rose dark)
--him:    #5085B0   (blue — partner)
--train:  #6AA882   (sage — trainer)
--iron:   #C8943A   (amber — IronMind)
--peri:   #8B68C0   (purple — perimenopause)
--dutch:  #7055B8   (deep purple — DUTCH test)
--ok:     #5BAA78   (success green)
--warn:   #D09040   (warning amber)
--bad:    #D05555   (error red)

Backgrounds (dark theme — mobile primary):
--bg:     #080509
--s1:     #100D15
--s2:     #181320
--s3:     #201B2C
--s4:     #282538

Text:
--t1:     #F0E8EC   (primary)
--t2:     rgba(240,232,236,0.52)  (secondary)
--t3:     rgba(240,232,236,0.22)  (tertiary)
--dim:    rgba(240,232,236,0.09)  (borders)

Phase colors:
--ph-m:   #C96B84   (menstrual)
--ph-f:   #6AA882   (follicular)
--ph-o:   #C8943A   (ovulation)
--ph-l:   #8B68C0   (luteal)
```

### Typography
- Display / headers: Playfair Display (serif) — italic for emphasis
- Body: DM Sans — weights 300, 400, 500
- Monospace (lab values): system mono
- Google Fonts import:
  https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap

### Design Rules — CRITICAL
- Dark background always on mobile (--bg: #080509)
- No generic AI aesthetics (no purple gradients, no sparkle icons)
- No emoji in UI components (use icons or text only)
- Border radius: 20px for cards, 14px for tiles, 50px for pills
- All cards: background var(--s1), border 1px solid var(--dim)
- Shadows: none — depth through color layering only
- Animations: subtle, 300-400ms, ease or cubic-bezier(.34,1.1,.64,1)

---

## OPENING SCREEN — THE RUBIK'S CUBE

The app opens with a 3D Rubik's cube that:

1. APPEARS scrambled — tiles are mixed colors across all faces
2. ANIMATES to solved — over 1.5 seconds, tiles swap to their correct
   face colors (rose=Her, blue=Him, sage=Trainer, amber=IronMind, purple=Peri)
3. SPINS continuously — smooth auto-rotation after solving
4. RESPONDS to drag — user can spin it manually
5. FACE TAP = ENTRY — tapping a face snaps cube to face-forward,
   then transitions to that role's experience

Face color assignments (no emojis, text labels only):
- Front face:  Rose   (#C96B84) — label "Her"
- Back face:   Blue   (#5085B0) — label "Him"
- Right face:  Sage   (#6AA882) — label "Trainer"
- Left face:   Amber  (#C8943A) — label "IronMind"
- Top face:    Purple (#8B68C0) — label "Perimenopause"
- Bottom face: Dark   (#1A1520) — no label

Each face: 3x3 grid of colored tiles. Bottom row spans full width as
a frosted label band. Center tile is slightly lighter than surrounding tiles.

Implementation: CSS 3D transforms + preserve-3d. NO Three.js needed.
The scramble-to-solve animation randomizes tile colors then sequentially
corrects them face by face over 30 steps at 60ms intervals.

Brand wordmark above cube:
- "Her" in #EDE5E0, "Side" in italic #C96B84
- Font: Georgia serif, 44px
- Tagline: "herside.app" in uppercase, 11px, letter-spacing 4px

---

## DATABASE SCHEMA (Supabase PostgreSQL)

```sql
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
  symptoms text[], -- array of symptom strings
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
  raw_pdf_url text, -- Supabase Storage URL
  extracted_markers jsonb, -- Claude Vision parsed data
  cycle_day_drawn int,
  phase_drawn text,
  flagged_markers jsonb, -- markers outside range
  ai_interpretation text, -- Claude's analysis
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
  -- keys: 'phase_name','energy_mood','support_cues','forecast',
  --       'cycle_dates','symptoms','health_data','training_recs',
  --       'sleep_hrv','emotional_data','gritscore_context','symptom_data'
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
  body_temp_deviation numeric(4,2), -- Oura only
  readiness_score int -- Oura only
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
  patterns jsonb, -- array of pattern objects
  expires_at timestamptz default (now() + interval '7 days')
);

-- TOOLKIT COMPLETIONS (which items she's checked off)
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
  revenue_cat_id text, -- RevenueCat subscription ID
  stripe_id text,      -- Stripe subscription ID (web)
  current_period_end timestamptz,
  created_at timestamptz default now(),
  unique(user_id)
);
```

### Row Level Security — enable on all tables
```sql
-- Example RLS for daily_checkins
alter table daily_checkins enable row level security;

create policy "users own their checkins"
  on daily_checkins for all
  using (auth.uid() = user_id);

-- Circle connections: her sees her connections,
-- connected user sees their side
create policy "her sees her connections"
  on circle_connections for select
  using (auth.uid() = her_user_id or auth.uid() = connected_user_id);

-- Apply equivalent policies to all tables
-- The key rule: users can only ever access their own data
-- Partners/trainers only see what permissions explicitly allow
```

---

## THE 5 ROLES + THEIR SCREENS

### ROLE 1: HER
Bottom nav: Today · Patterns · Toolkit · Mirror · Labs · Privacy

**TODAY TAB**
- Phase ring (cycle day, phase name, days remaining)
- Mini cycle calendar strip (28 days, color coded by phase)
- Daily check-in (energy 1-10, mood, skin, symptoms)
- Stats row (avg cycle, HRV today, sleep avg)
- AI insight bubble (connected to Claude API)
- IronMind GritScore strip (if connected)
- Top pattern preview card
- Lab alert card (if flagged markers)
- Circle summary (connected people)

**PATTERNS TAB**
- Pattern cards in format:
  🌀 Pattern observation
  📊 Evidence (her specific data + dates + numbers)
  📚 Research (published study citation)
  💡 What to try (actionable, not clinical)
- Generated by Claude API analyzing her check-in history
- Minimum 3 cycles of data before full pattern generation
- Patterns persist in ai_patterns table (7 day cache)

**TOOLKIT TAB**
- Phase tabs: Luteal (current) · Menstrual · Follicular · Ovulation
- Each phase has 4 categories: Teas · Foods · Supplements · Movement
- Each item: name, description, research tag, checkable
- Items connected to her actual lab data where relevant
  (e.g. ferritin 14 shows up in iron-related items)
- Affirmation for each phase
- Completion state stored in toolkit_completions table

**MIRROR TAB (Accountability)**
- Awareness meter (5 biological limiting factors with data bars)
- "What's yours right now" — 3 honest questions
- 4 Limiting Factor deep-dives with checkable interventions:
  1. Emotional reactivity
  2. Rumination loop
  3. Misreading tone/expressions
  4. Energy-based withdrawal
- Daily Accountability Check (4 questions, 3 answer options each)
  — responses generate specific, kind AI feedback
- Communication Scripts ("Say This Not That")
- Live breathing tool (box breathing, 4-4-4-4 timing)
- Evening reflection checklist (5 items)

**LABS TAB**
- Upload zones: Blood Test PDF · DUTCH Test PDF · Urine Panel
- PDF processing via Claude Vision API
- Results display: flagged markers (red/yellow/green) with bar graphs
- DUTCH cortisol curve SVG visualization
- DUTCH metabolite tiles (4-grid)
- Doctor Brief modal:
  - All flagged markers with context
  - 5 questions written in her voice
  - PDF export
  - Secure shareable link

**PRIVACY TAB**
- Per-connection permission toggles
- Connections: Marcus (Partner) · Coach James (Trainer) · IronMind
- Invite new person flow:
  - Choose type (partner/trainer/ironmind/friend)
  - Generate unique link (herside.app/invite/[token])
  - Share via native share sheet
  - Link expires 48 hours
  - One-time use
- Revoke = instant, silent (no notification sent)

---

### ROLE 2: HIM (Partner)
Bottom nav: Today · Forecast · What to Say · Learn

**TODAY TAB**
- Phase badge (Sofia · Phase · Day X)
- "How to show up today" card
- Phase strip showing full cycle (4 phases, current highlighted)
- IronMind strip (her GritScore with context if connected)
- Checkable action list (5 items, phase-specific)
- "Don't say" card (4-5 phrases to avoid)
- AI insight (pattern-based, explains recovery timing)
- His own check-in prompt (how is he doing today)
- Upcoming week forecast preview

**FORECAST TAB**
- Full 28-day cycle mapped with his role in each phase
- Cards for each phase: what she's experiencing + his job
- Next 3 phase transitions highlighted

**WHAT TO SAY TAB**
- Phase-specific scripts (Say This vs Instead Of)
- Breathing tool before hard conversations
- Evening reflection (his version — 3 items)
- Research card explaining the neuroscience

**LEARN TAB**
- The 4 phases explained for partners
- IronMind GritScore explained in relationship context
- Perimenopause partner section (if she's in peri mode)
- Stats (28% of partners understand the cycle, 3x outcomes)
- Daily notification preview

---

### ROLE 3: TRAINER
Bottom nav: Today · Clients · Science · Settings

**TODAY TAB**
- AI brief (quick summary of today's client roster)
- Client dashboard list:
  - Avatar, name, phase tag, cycle day
  - Intensity pill: Push Hard / Moderate / Gentle Only
  - IronMind GritScore (if client has it connected)
- Session plan for selected client:
  - Protocol name (e.g. "Luteal Protocol")
  - Specific session design bullets (checkable)
  - IronMind context note if GritScore is low

**CLIENTS TAB**
- Full client roster
- Tap client → their profile:
  - Current phase + cycle day
  - 14-day training forecast
  - Phase history chart
  - Nutrition notes per phase
  - IronMind GritScore history

**SCIENCE TAB**
- Phase × training evidence cards:
  - Follicular: peak strength window
  - Ovulation: peak power + ACL risk
  - Luteal: moderate + technique focus
  - Menstrual: gentle movement protocol
- IronMind × Cycle correlation explainer
- Downloadable protocol PDFs

---

### ROLE 4: PERIMENOPAUSE
(Her experience with Peri Mode active — different bottom nav)
Bottom nav: Today · Toolkit · His Role · Labs

**TODAY TAB**
- Peri badge + mode indicator
- Stage progress bar (Early → Mid → Late → Menopause)
- Symptom check-in grid (10 symptoms, severity 1-5 dots each):
  Hot flashes · Night sweats · Brain fog · Irritability
  Sleep issues · Heart palps · Weight changes · Joint pain
  Vaginal dryness · Hair thinning
- IronMind GritScore (shows correlation to hot flash days)
- AI insight (explains estrogen fluctuation pattern)
- HRV-to-symptom correlation card

**TOOLKIT TAB** (Peri-specific)
- Teas: Sage (evidence-backed), Red clover, Ashwagandha blend
- Foods: Soy isoflavones, cruciferous veg (DUTCH-connected),
         Mediterranean diet pattern, calcium sources
- Supplements: Magnesium glycinate, D3+K2 (lab-flagged),
               Ashwagandha KSM-66, Collagen peptides
- Movement: Resistance training (non-optional), Zone 2 cardio, Tai chi

**HIS ROLE TAB**
- What Marcus sees in his app during peri
- "Never say during perimenopause" list
- Research brief on partner engagement and outcomes
- Stats: 10yr duration, 72% confusion rate, 3x better outcomes

**LABS TAB**
- Same as Her labs but adds FSH marker
- Peri-specific doctor brief with 5 different questions:
  - FSH confirmation, HRT candidacy, DEXA scan timing
  - Endocrinology referral, D3 dosage

---

### ROLE 5: IRONMIND INTEGRATION
(Accessed via IronMind tab in Her app or Trainer app)

**Her side shows:**
- Her GritScore with cycle context
- Score trend chart (30 days) overlaid with cycle phases
- Correlation insights (follicular peak 91-94, luteal dip 74-77)
- Pattern: score drop explained as biology not mindset

**Trainer side shows:**
- Per-client GritScore alongside phase/intensity
- Proactive intervention alerts (score drops >25pts in late luteal)
- Training protocol adjusts based on combined GritScore + phase data

**Integration data flow:**
- IronMind sends GritScore via webhook to Supabase Edge Function
- Edge Function stores in gritscore_syncs table
- Claude API contextualizes score within cycle phase
- Real-time update via Supabase Realtime

---

## AI ENGINE — CLAUDE API PROMPTS

### System Prompt — Her Pattern Analysis
```
You are HerSide, a cycle pattern analyst for {name}.

Your role: find real patterns in her data, ground every observation
in her specific numbers, and cite published research. You are NOT
her doctor. Use language like "this pattern is consistent with" —
never "you have."

Her data context:
- Cycle length: {avg_cycle_length} days
- Current phase: {current_phase}, Day {cycle_day}
- Life stage: {life_stage}
- Check-in history: {checkin_summary}
- Lab flags: {lab_flags}
- HRV average by phase: {hrv_by_phase}
- GritScore average by phase: {gritscore_by_phase}

Output each pattern in this exact format:
🌀 PATTERN: [specific observation with her data]
📊 EVIDENCE: [dates, numbers, measurements from her data]
📚 RESEARCH: [published study citation — only cite real studies]
💡 WHAT TO TRY: [1-2 actionable suggestions, not diagnoses]

If something is serious (severe pain, very heavy bleeding, sudden
major changes), tell her to see a doctor immediately.
Be specific. Be kind. Never generalize.
```

### System Prompt — Daily Insight
```
You are HerSide generating today's insight for {name}.

Today: {current_date}, Cycle Day {cycle_day}, {current_phase} phase
Recent check-ins: {last_7_days_checkins}
HRV today: {hrv_today} (baseline: {hrv_baseline})
GritScore today: {gritscore_today} (baseline: {gritscore_baseline})
Key lab flags: {top_lab_flags}

Generate a 2-paragraph insight (max 120 words total):
Para 1: What's happening biologically right now, connected to her
        specific numbers from today vs her baseline.
Para 2: One concrete thing she can use from this — timing, action,
        or reframe. Make it specific to today.

No bullet points. No headers. Conversational but precise.
Bold key numbers or phrases using **markdown**.
Never diagnose. Never fabricate data.
```

### System Prompt — Lab PDF Interpretation
```
You are analyzing a medical lab report for a HerSide user.

Extract ALL markers with their values and reference ranges.
Flag anything that is:
- Below the low end of reference range → "below_range"
- Above the high end of reference range → "above_range"
- Within bottom 10% of range → "low_normal"
- Within top 10% of range → "high_normal"

Pay special attention to:
Hormones: estradiol, progesterone, testosterone, FSH, LH, DHEA-S
Thyroid: TSH, Free T4, Free T3, reverse T3
Nutrients: ferritin, vitamin D (25-OH), B12, folate, iron, TIBC
Metabolic: fasting glucose, insulin, HbA1c
Inflammation: hsCRP, homocysteine

For each flagged marker, note:
- The value and unit
- The reference range
- Whether it's clinically significant or borderline
- Which symptoms it commonly affects

Also note: what cycle day this was drawn (if provided).
Hormone results mean different things at different cycle days.

Output as JSON only. No prose.
```

### System Prompt — Partner Daily Brief
```
You are HerSide generating today's brief for {partner_name},
the partner of {her_name}.

Her current state (what she's permitted to share):
- Phase: {phase} Day {cycle_day}
- Energy level: {energy_level}
- GritScore: {gritscore} (context: {gritscore_context})
- Is high reactivity day: {is_high_reactivity}

Generate:
1. One sentence explaining what's happening with her biology today
   (plain language, no jargon, never clinical)
2. Three specific actions for him today (concrete, not generic)
3. Two phrases to avoid today (specific to this phase)

Tone: warm, direct, brother-to-brother. Not preachy.
He's a good person who wants to show up — give him the tools.
Max 150 words total.
```

### System Prompt — Accountability Response
```
You are HerSide responding to {name}'s accountability check-in.

Question: {question}
Her answer: {answer_type} ({answer_label})
Current phase: {phase}, Day {cycle_day}
This is a {reactivity_level} reactivity day.

Generate a response that is:
- Kind but honest (not validating avoidance)
- Specific to the phase (her biology is real context)
- Action-oriented (one next step, not a lecture)
- 2-3 sentences maximum

If her answer shows growth: acknowledge it specifically.
If her answer shows avoidance: give her one micro-action,
  not a shame spiral. Make it achievable in the next hour.

Never: lecture, shame, generalize, or give more than one action.
```

---

## ONBOARDING FLOW

### Screen 1: Role Select (The Cube)
- Rubik's cube animation (scrambled → solved)
- Tap a face to select role
- No buttons below cube — face tap IS the selection

### Screens 2-7: Her Onboarding (6 steps)
1. Life stage selection (regular/irregular/peri/none)
2. Last period start date (month/day/year pickers)
   → Shows "Based on this — you're on Day X of your cycle"
3. Cycle length slider (21-40 days, default 28)
   → "Not sure? Start with 28. HerSide learns over time."
4. Connect data (Apple Health auto-detected, others optional)
   → Oura, Garmin, IronMind, Whoop
5. First check-in (energy pips, mood chips, skin chips, symptoms)
6. Success screen with setup summary + "Go to my dashboard"

### Partner Onboarding (after invite link tap)
1. "Sofia invited you" acceptance screen
   → Shows exactly what he can see
   → Shows what he can NEVER see
   → Her personal message (optional)
2. Create account (email + password)
3. Brief orientation (what the app does for him)
4. Dashboard activates

### Trainer Onboarding (after invite link tap)
1. "Sofia added you as her trainer" acceptance screen
   → Performance-focused language
   → Training data access explained
2. Create account
3. Trainer dashboard orientation
4. Prompt to invite other female clients

---

## INVITE SYSTEM

```typescript
// Supabase Edge Function: create-invite
export async function createInvite(
  herUserId: string,
  connectionType: 'partner' | 'trainer' | 'ironmind' | 'friend',
  permissions: Record<string, boolean>
): Promise<{ inviteUrl: string; token: string }> {

  // 1. Create connection record (status: 'pending')
  const { data: connection } = await supabase
    .from('circle_connections')
    .insert({
      her_user_id: herUserId,
      connection_type: connectionType,
      status: 'pending',
      invite_expires_at: new Date(Date.now() + 48*60*60*1000)
    })
    .select()
    .single();

  // 2. Insert permission rows
  await supabase.from('privacy_permissions').insert(
    Object.entries(permissions).map(([key, enabled]) => ({
      connection_id: connection.id,
      permission_key: key,
      enabled
    }))
  );

  // 3. Return invite URL
  const inviteUrl = `https://herside.app/invite/${connection.invite_token}`;
  return { inviteUrl, token: connection.invite_token };
}
```

Default permissions by connection type:
```typescript
const defaultPermissions = {
  partner: {
    phase_name: true,
    energy_mood: true,
    support_cues: true,
    forecast: true,
    cycle_dates: false,    // always false
    symptoms: false,       // always false
    health_data: false     // always false
  },
  trainer: {
    phase_name: true,
    training_recs: true,
    sleep_hrv: true,
    cycle_dates: false,
    emotional_data: false, // always false
    symptoms: false        // always false
  },
  ironmind: {
    phase_name: true,
    gritscore_context: true,
    symptom_data: false    // optional, user decides
  }
}
```

---

## PHASE CALCULATION

```typescript
// utils/phaseCalculation.ts

export type Phase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export function calculateCurrentPhase(
  lastPeriodStart: Date,
  cycleLength: number = 28
): { phase: Phase; cycleDay: number; daysUntilNextPeriod: number } {

  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const cycleDay = (daysSinceStart % cycleLength) + 1;
  const daysUntilNextPeriod = cycleLength - (cycleDay - 1);

  let phase: Phase;
  if (cycleDay <= 5) {
    phase = 'menstrual';
  } else if (cycleDay <= Math.floor(cycleLength * 0.46)) {
    phase = 'follicular';
  } else if (cycleDay <= Math.floor(cycleLength * 0.57)) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  return { phase, cycleDay, daysUntilNextPeriod };
}

// Phase descriptions for display
export const phaseDescriptions: Record<Phase, {
  name: string;
  tagline: string;
  description: string;
  partnerGuidance: string;
  trainerIntensity: 'push' | 'build' | 'moderate' | 'gentle';
}> = {
  menstrual: {
    name: 'Menstrual',
    tagline: 'Release & Rest',
    description: 'Estrogen and progesterone at their lowest. Your body is working hard. Rest is the most productive thing you can do.',
    partnerGuidance: 'Warmth, quiet, zero pressure. Ask what she needs — then do exactly that.',
    trainerIntensity: 'gentle'
  },
  follicular: {
    name: 'Follicular',
    tagline: 'Rising Energy',
    description: 'Estrogen rising, dopamine with it. Your superpower window is opening. Energy, focus, and motivation are climbing.',
    partnerGuidance: 'She\'s opening up. Plan something, try something new, have the real conversation.',
    trainerIntensity: 'build'
  },
  ovulation: {
    name: 'Ovulation',
    tagline: 'Peak Power',
    description: 'Peak confidence, peak connection, peak physical strength. This is you at your fullest.',
    partnerGuidance: 'Be fully present. Quality time lands deepest here. She is at her most open.',
    trainerIntensity: 'push'
  },
  luteal: {
    name: 'Luteal',
    tagline: 'Inward & Sensitive',
    description: 'Progesterone dominant. Energy naturally lower — not by failure, by design. Rest is productive.',
    partnerGuidance: 'Presence over performance. Soft landing. Less noise, fewer decisions, more warmth.',
    trainerIntensity: 'moderate'
  }
};
```

---

## SUPABASE ON NETLIFY

Yes — Netlify works perfectly for HerSide web. Here's the setup:

```toml
# netlify.toml
[build]
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "your-project-url"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
  ANTHROPIC_API_KEY = "your-api-key"
  NEXT_TELEMETRY_DISABLED = "1"
```

```bash
# Install Netlify Next.js plugin
npm install @netlify/plugin-nextjs
```

Netlify vs Vercel for HerSide:
- Both work. Netlify is slightly more config, Vercel is zero-config Next.js.
- Netlify: better for when you want more control, custom redirects,
           form handling, identity (auth alternative), edge functions.
- Vercel: easier Next.js deploy, better Next.js-specific features.
- Supabase works identically with both — it's just env variables.
- Recommendation: Netlify for the web dashboard (trainer + partner),
  because you'll want custom redirect rules for the invite system.

Netlify redirect for invite links:
```toml
# in netlify.toml
[[redirects]]
  from = "/invite/:token"
  to = "/onboarding/accept/:token"
  status = 200
```

---

## REPLIT USAGE

Replit is best for:
- Rapid prototyping of API integrations (Supabase, Anthropic, IronMind)
- Testing the AI prompt system before mobile integration
- Building and demoing the web partner/trainer dashboards
- Showing investors a live URL without a full deployment pipeline

Replit limitations:
- Not suitable for production mobile app
- Sleep on inactivity (use Replit Always On for demos)
- Use Replit Secrets for all API keys (never commit keys)

Replit → Supabase connection:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # only for server-side
ANTHROPIC_API_KEY=sk-ant-...
```

---

## MONETIZATION — PRICING TIERS

```typescript
export const PLANS = {
  free: {
    price: 0,
    features: [
      'Basic cycle tracking',
      'Current phase display',
      'Daily check-in (30 day history)',
      'Invite 1 person to circle'
    ],
    limits: { history_days: 30, circle_members: 1, ai_insights: 0 }
  },
  her_pro: {
    price_monthly: 9.99,
    price_annual: 79,
    features: [
      'Everything in Free',
      'AI pattern analysis (unlimited)',
      'Full check-in history',
      'Sleep & HRV correlation',
      'Lab interpretation (blood + DUTCH + urine)',
      'Doctor Prep Mode + PDF export',
      'Unlimited circle members',
      'IronMind GritScore integration',
      'Mirror (accountability) tab'
    ],
    limits: { history_days: -1, circle_members: -1, ai_insights: -1 }
  },
  partner: {
    price_monthly: 6.99,
    price_annual: 55,
    features: [
      'Daily phase guidance',
      'What to say scripts',
      'Forecast calendar',
      'IronMind context',
      'Learn section'
    ]
  },
  together: {
    price_monthly: 14.99,
    price_annual: 119,
    description: 'Her Pro + Partner bundled',
    save_vs_separate: 2.0
  },
  peri_pro: {
    price_monthly: 14.99,
    price_annual: 119,
    description: 'Her Pro with Perimenopause mode'
  },
  trainer_pro: {
    price_monthly: 29,
    price_annual: 232,
    per: 'trainer seat',
    features: [
      'Client dashboard (unlimited clients)',
      'Phase-synced session plans',
      'IronMind integration',
      'Science library',
      'Nutrition timing guides'
    ]
  },
  gym_license: {
    price_monthly: 199,
    price_annual: 1588,
    description: 'All trainers at one location'
  }
};
```

---

## FILE STRUCTURE

```
herside/
├── apps/
│   ├── mobile/                    # React Native + Expo
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── role-select.tsx   # Rubik's cube opening
│   │   │   │   ├── onboarding/
│   │   │   │   │   ├── life-stage.tsx
│   │   │   │   │   ├── last-period.tsx
│   │   │   │   │   ├── cycle-length.tsx
│   │   │   │   │   ├── connect-data.tsx
│   │   │   │   │   ├── first-checkin.tsx
│   │   │   │   │   └── success.tsx
│   │   │   │   └── accept-invite.tsx
│   │   │   ├── (her)/
│   │   │   │   ├── today.tsx
│   │   │   │   ├── patterns.tsx
│   │   │   │   ├── toolkit.tsx
│   │   │   │   ├── mirror.tsx
│   │   │   │   ├── labs.tsx
│   │   │   │   └── privacy.tsx
│   │   │   ├── (him)/
│   │   │   │   ├── today.tsx
│   │   │   │   ├── forecast.tsx
│   │   │   │   ├── scripts.tsx
│   │   │   │   └── learn.tsx
│   │   │   ├── (trainer)/
│   │   │   │   ├── today.tsx
│   │   │   │   ├── clients.tsx
│   │   │   │   └── science.tsx
│   │   │   └── (peri)/
│   │   │       ├── today.tsx
│   │   │       ├── toolkit.tsx
│   │   │       ├── his-role.tsx
│   │   │       └── labs.tsx
│   │   ├── components/
│   │   │   ├── cube/
│   │   │   │   └── RubiksCube.tsx    # CSS 3D cube component
│   │   │   ├── phase/
│   │   │   │   ├── PhaseRing.tsx
│   │   │   │   ├── CycleCalendar.tsx
│   │   │   │   └── PhaseHero.tsx
│   │   │   ├── checkin/
│   │   │   │   ├── CheckInTiles.tsx
│   │   │   │   ├── EnergyPips.tsx
│   │   │   │   └── MoodChips.tsx
│   │   │   ├── labs/
│   │   │   │   ├── LabUpload.tsx
│   │   │   │   ├── MarkerRow.tsx
   │   │   │   ├── CortisolChart.tsx
│   │   │   │   └── DoctorBrief.tsx
│   │   │   ├── toolkit/
│   │   │   │   ├── ToolkitCategory.tsx
│   │   │   │   └── ToolkitItem.tsx
│   │   │   ├── mirror/
│   │   │   │   ├── AwarenessMeter.tsx
│   │   │   │   ├── AccountabilityCheck.tsx
│   │   │   │   ├── BreathingTool.tsx
│   │   │   │   └── CommunicationScript.tsx
│   │   │   ├── privacy/
│   │   │   │   ├── PermissionToggle.tsx
│   │   │   │   └── InviteFlow.tsx
│   │   │   └── shared/
│   │   │       ├── AIBubble.tsx
│   │   │       ├── PatternCard.tsx
│   │   │       ├── IronMindStrip.tsx
│   │   │       └── BottomNav.tsx
│   │   └── utils/
│   │       ├── phaseCalculation.ts
│   │       ├── supabase.ts
│   │       └── anthropic.ts
│   │
│   └── web/                       # Next.js (Netlify)
│       ├── app/
│       │   ├── invite/[token]/
│       │   │   └── page.tsx          # Accept invite landing
│       │   ├── trainer/
│       │   │   └── dashboard/
│       │   │       └── page.tsx
│       │   └── partner/
│       │       └── dashboard/
│       │           └── page.tsx
│       └── netlify.toml
│
├── packages/
│   ├── shared/                    # Shared types + utils
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── cycle.ts
│   │   │   └── lab.ts
│   │   └── utils/
│   │       └── phaseCalculation.ts
│   └── supabase/                  # DB types + migrations
│       ├── migrations/
│       └── types.ts               # Generated Supabase types
│
└── supabase/
    ├── functions/
    │   ├── create-invite/
    │   ├── process-lab-pdf/
    │   ├── generate-insights/
    │   └── ironmind-webhook/
    └── migrations/
```

---

## CLAUDE CODE SETUP COMMANDS

Run these in order after cloning:

```bash
# 1. Install dependencies
npm install

# 2. Set up 21st.dev Magic MCP (eliminates AI slop in components)
npx @21st-dev/magic@latest

# 3. Set up Supabase
npx supabase login
npx supabase init
npx supabase db push  # runs all migrations

# 4. Generate Supabase TypeScript types
npx supabase gen types typescript --local > packages/supabase/types.ts

# 5. Set environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          ANTHROPIC_API_KEY, IRONMIND_API_KEY, REVENUECAT_API_KEY

# 6. Start development
npx expo start          # mobile
npm run dev --filter=web  # web dashboards
```

---

## CLAUDE CODE PROMPTS — USE IN ORDER

Feed these to Claude Code after setup:

```
PROMPT 1 — Database:
"Set up the Supabase database using the schema in the master brief.
Create all tables with RLS policies. Generate TypeScript types.
Use the exact column names and constraints specified."

PROMPT 2 — Opening Screen:
"Build the RubiksCube component using CSS 3D transforms.
No Three.js, no emojis, no emoji in tiles.
Scrambled on load, animates to solved brand colors over 1.5 seconds,
then auto-spins. Tap a face to enter that role.
Brand colors: Her=#C96B84, Him=#5085B0, Trainer=#6AA882,
IronMind=#C8943A, Peri=#8B68C0. Text labels only — no icons."

PROMPT 3 — Phase Engine:
"Build the phase calculation utility using the formula in the brief.
Include phaseDescriptions with all partner and trainer guidance.
Add getPhaseColor() and getPhaseIntensity() helpers."

PROMPT 4 — Her Today Screen:
"Build the Her Today tab using the design system in the brief.
Include: PhaseRing, CycleCalendar strip, CheckIn tiles,
stats row, AIBubble, IronMindStrip, PatternCard preview,
Circle summary. Use /ui with 21st.dev for any complex components."

PROMPT 5 — AI Integration:
"Build the Anthropic API integration using the system prompts
in the master brief. Implement: daily insight generation,
pattern analysis (cached 7 days in ai_patterns table),
lab PDF parsing with Claude Vision, accountability responses.
All calls go through Supabase Edge Functions, never direct from client."

PROMPT 6 — Invite System:
"Build the complete invite flow: generate token, create connection
record, set default permissions by type, return shareable URL.
Accept invite screen shows exact permissions. Revoke is instant.
Use the defaultPermissions object from the brief."

PROMPT 7 — Privacy Controls:
"Build the Privacy tab with live permission toggles per connection.
Changes save to Supabase immediately. Revoke connection = set
status to 'revoked', no notification sent to connected user."

PROMPT 8 — Mirror Tab:
"Build the Mirror (accountability) tab: AwarenessMeter with 5
biological factors and data bars connected to real HRV/checkin data,
AccountabilityCheck with 4 questions and AI-generated responses,
BreathingTool with 4-4-4-4 box breathing animation,
CommunicationScript cards, evening reflection checklist."

PROMPT 9 — Partner Experience:
"Build the complete Him experience: Today tab with phase badge,
action list, don't-say card, AI insight, his check-in prompt.
Forecast tab with 28-day map. What to Say tab with scripts
and breathing tool. Learn tab with phase science and stats."

PROMPT 10 — Trainer Experience:
"Build the Trainer experience: client dashboard with phase tags
and intensity pills, session plan generator per client,
IronMind GritScore displayed per client, science library."

PROMPT 11 — Netlify Deploy:
"Set up Netlify deployment for the Next.js web app.
Create netlify.toml with @netlify/plugin-nextjs.
Set up redirect for /invite/:token → /onboarding/accept/:token.
Configure environment variables for Supabase + Anthropic."

PROMPT 12 — RevenueCat Payments:
"Integrate RevenueCat for mobile subscriptions using the pricing
tiers in the master brief. Her Pro $9.99/mo, Partner $6.99/mo,
Together $14.99/mo, Trainer Pro $29/mo. Gate features by plan.
Free tier gets: 30 day history, 1 circle member, no AI insights."
```

---

## NON-NEGOTIABLES

1. RLS on every Supabase table — no exceptions
2. She can always revoke access — instant, silent
3. Exact cycle dates never exposed to partner or trainer
4. Symptom details never exposed to trainer
5. Emotional/mood data never exposed to trainer
6. AI never diagnoses — always "consistent with", never "you have"
7. Doctor Prep Mode always includes the disclaimer
8. No emojis in UI components (Tabler icons or text only)
9. Her data is never sold, never used for ads, never shared with third parties
10. All API keys server-side only — never in client bundle

---

## CONTACT + RESOURCES

Product: herside.app
Concept + design: built in Claude.ai
Stack docs:
  - Supabase: docs.supabase.com
  - Expo: docs.expo.dev
  - RevenueCat: docs.revenuecat.com
  - 21st.dev: 21st.dev/docs
  - IronMind: ironmind.ai/api (confirm with team)
  - Netlify Next.js: docs.netlify.com/frameworks/next-js

---

END OF BRIEF. BUILD HerSide.
