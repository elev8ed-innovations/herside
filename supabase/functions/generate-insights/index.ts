// Supabase Edge Function — generate-insights
// Handles: daily_insight | pattern_analysis | accountability_response
// All Claude calls are server-side; ANTHROPIC_API_KEY is a Supabase secret.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { callClaude } from '../_shared/anthropic.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const DAILY_INSIGHT_SYSTEM = `You are HerSide generating today's insight for {name}.

Today: {current_date}, Cycle Day {cycle_day}, {current_phase} phase
Recent check-ins: {last_7_days_checkins}
HRV today: {hrv_today} (baseline: {hrv_baseline})
GritScore today: {gritscore_today} (baseline: {gritscore_baseline})
Key lab flags: {top_lab_flags}

Generate a 2-paragraph insight (max 120 words total):
Para 1: What's happening biologically right now, connected to her specific numbers from today vs her baseline.
Para 2: One concrete thing she can use from this — timing, action, or reframe. Make it specific to today.

No bullet points. No headers. Conversational but precise.
Bold key numbers or phrases using **markdown**.
Never diagnose. Never fabricate data.`;

const PATTERN_SYSTEM = `You are HerSide, a cycle pattern analyst for {name}.

Your role: find real patterns in her data, ground every observation in her specific numbers,
and cite published research. You are NOT her doctor. Use language like "this pattern is
consistent with" — never "you have."

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

If something is serious (severe pain, very heavy bleeding, sudden major changes), tell her to see a doctor immediately.
Be specific. Be kind. Never generalize.`;

const ACCOUNTABILITY_SYSTEM = `You are HerSide responding to {name}'s accountability check-in.

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
If her answer shows avoidance: give her one micro-action, not a shame spiral. Make it achievable in the next hour.

Never: lecture, shame, generalize, or give more than one action.`;

type InsightType = 'daily_insight' | 'pattern_analysis' | 'accountability_response';

interface RequestBody {
  type: InsightType;
  context: Record<string, string | number | boolean>;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  // Verify auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', ''),
  );

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const { type, context } = body;

  try {
    // Pattern analysis: check cache first (7-day TTL)
    if (type === 'pattern_analysis') {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: cached } = await supabase
        .from('ai_patterns')
        .select('*')
        .eq('user_id', user.id)
        .gte('generated_at', cutoff)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (cached) {
        return new Response(JSON.stringify({ patterns: cached.patterns, cached: true }), {
          headers: { ...corsHeaders, 'content-type': 'application/json' },
        });
      }
    }

    // Build prompt from template
    let systemPrompt: string;
    let userMessage: string;
    let maxTokens: number;

    if (type === 'daily_insight') {
      systemPrompt = fillTemplate(DAILY_INSIGHT_SYSTEM, context);
      userMessage = 'Generate today\'s insight.';
      maxTokens = 250;
    } else if (type === 'pattern_analysis') {
      systemPrompt = fillTemplate(PATTERN_SYSTEM, context);
      userMessage = 'Analyze her cycle patterns. Return the top 3 patterns you find.';
      maxTokens = 800;
    } else if (type === 'accountability_response') {
      systemPrompt = fillTemplate(ACCOUNTABILITY_SYSTEM, context);
      userMessage = 'Generate the accountability response.';
      maxTokens = 120;
    } else {
      return new Response(JSON.stringify({ error: 'Unknown insight type' }), {
        status: 400,
        headers: { ...corsHeaders, 'content-type': 'application/json' },
      });
    }

    const result = await callClaude(
      apiKey,
      systemPrompt,
      [{ role: 'user', content: userMessage }],
      maxTokens,
    );

    // Cache pattern analysis results
    if (type === 'pattern_analysis') {
      await supabase.from('ai_patterns').insert({
        user_id: user.id,
        phase: String(context.current_phase ?? 'unknown'),
        cycle_day: Number(context.cycle_day ?? 0),
        patterns: parsePatterns(result),
        raw_response: result,
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      return new Response(JSON.stringify({ patterns: parsePatterns(result), cached: false }), {
        headers: { ...corsHeaders, 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('generate-insights error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }
});

function fillTemplate(template: string, context: Record<string, string | number | boolean>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in context ? String(context[key]) : `{${key}}`
  );
}

function parsePatterns(raw: string): Array<{ pattern: string; evidence: string; research: string; whatToTry: string }> {
  const blocks = raw.split(/(?=🌀 PATTERN:)/g).filter(b => b.trim());
  return blocks.map(block => ({
    pattern: extract(block, /🌀 PATTERN:\s*(.+?)(?=📊|$)/s),
    evidence: extract(block, /📊 EVIDENCE:\s*(.+?)(?=📚|$)/s),
    research: extract(block, /📚 RESEARCH:\s*(.+?)(?=💡|$)/s),
    whatToTry: extract(block, /💡 WHAT TO TRY:\s*(.+?)(?=🌀|$)/s),
  }));
}

function extract(text: string, re: RegExp): string {
  return (text.match(re)?.[1] ?? '').trim();
}
