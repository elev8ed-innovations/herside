// Async Server Component — calls Claude with Partner Daily Brief system prompt.
// API key stays server-side. Wrap in Suspense.

import { callClaude } from '@/lib/claude';
import { isHighReactivityDay, phaseDescriptions } from '@herside/shared';
import type { Phase } from '@herside/shared';

const SYSTEM = `You are HerSide generating today's brief for {partner_name}, the partner of {her_name}.

Her current state (what she's permitted to share):
- Phase: {phase} Day {cycle_day}
- Energy level: {energy_level}
- GritScore: {gritscore} (context: {gritscore_context})
- Is high reactivity day: {is_high_reactivity}

Generate:
1. One sentence explaining what's happening with her biology today (plain language, no jargon, never clinical)
2. Three specific actions for him today (concrete, not generic)
3. Two phrases to avoid today (specific to this phase)

Tone: warm, direct, brother-to-brother. Not preachy.
He's a good person who wants to show up — give him the tools.
Max 150 words total.`;

interface Props {
  phase: Phase;
  cycleDay: number;
  phaseColor: string;
  herName?: string;
  partnerName?: string;
}

export async function HimInsight({
  phase, cycleDay, phaseColor,
  herName = 'Sofia', partnerName = 'Marcus',
}: Props) {
  const reactivity = isHighReactivityDay(phase);
  const desc = phaseDescriptions[phase];

  const system = SYSTEM
    .replace('{partner_name}', partnerName)
    .replace('{her_name}', herName)
    .replace('{phase}', desc.name)
    .replace('{cycle_day}', String(cycleDay))
    .replace('{energy_level}', '7.2/10')
    .replace('{gritscore}', '82')
    .replace('{gritscore_context}', 'above her phase baseline of 76')
    .replace('{is_high_reactivity}', reactivity ? 'yes' : 'no');

  const insight = await callClaude(system, 'Generate today\'s brief.', 200);

  const fallback = `${herName} is in ${desc.name} — ${desc.partnerGuidance}`;

  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderLeft: `3px solid ${phaseColor}`,
      borderRadius: '0 20px 20px 0', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: phaseColor, animation: 'dot-pulse 3s ease-in-out infinite' }} />
        <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          HerSide AI · Partner Brief
        </span>
      </div>
      <p style={{ color: 'rgba(240,232,236,0.75)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
        {insight || fallback}
      </p>
    </div>
  );
}

export function HimInsightSkeleton({ phaseColor }: { phaseColor: string }) {
  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderLeft: `3px solid ${phaseColor}`,
      borderRadius: '0 20px 20px 0', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: phaseColor }} />
        <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          HerSide AI · Partner Brief
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[100, 85, 70, 55].map(w => (
          <div key={w} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: 'rgba(240,232,236,0.06)', animation: 'pulse-bg 2s ease-in-out infinite' }} />
        ))}
      </div>
    </div>
  );
}
