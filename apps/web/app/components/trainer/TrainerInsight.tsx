// Async Server Component — AI brief summarising today's client roster.
import { callClaude } from '@/lib/claude';
import { MOCK_CLIENTS } from './mockClients';

const TRAIN = '#6AA882';

const SYSTEM = `You are HerSide generating a quick trainer brief.

Today's client roster:
{roster}

Generate a 2-3 sentence brief for the trainer covering:
1. Which clients are in a high-performance window today and why
2. Which clients need a modified session and the specific reason
3. One scheduling or sequencing note for the day

Tone: professional, data-forward, practical. No fluff.
Max 80 words.`;

export async function TrainerInsight() {
  const roster = MOCK_CLIENTS.map(c =>
    `${c.name}: ${c.phaseName} Day ${c.cycleDay} — ${c.intensityLabel}${c.gritScore !== null ? `, GritScore ${c.gritScore} (baseline ${c.gritBaseline})` : ''}`
  ).join('\n');

  const brief = await callClaude(
    SYSTEM.replace('{roster}', roster),
    'Generate the trainer brief.',
    150,
  );

  const fallback = `${MOCK_CLIENTS.filter(c => c.intensityKey === 'push').map(c => c.name).join(' and ')} are in peak windows today. ${MOCK_CLIENTS.filter(c => c.intensityKey === 'gentle').map(c => c.name).join(' and ')} needs a recovery session.`;

  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderLeft: `3px solid ${TRAIN}`, borderRadius: '0 20px 20px 0',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: TRAIN, animation: 'dot-pulse 3s ease-in-out infinite' }} />
        <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          AI · Today's Roster Brief
        </span>
      </div>
      <p style={{ color: 'rgba(240,232,236,0.75)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, margin: 0 }}>
        {brief || fallback}
      </p>
    </div>
  );
}

export function TrainerInsightSkeleton() {
  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderLeft: `3px solid ${TRAIN}`, borderRadius: '0 20px 20px 0', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: TRAIN }} />
        <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          AI · Today's Roster Brief
        </span>
      </div>
      {[100, 80, 60].map(w => (
        <div key={w} style={{ height: 11, width: `${w}%`, borderRadius: 5, background: 'rgba(240,232,236,0.06)', marginBottom: 8, animation: 'pulse-bg 2s ease-in-out infinite' }} />
      ))}
    </div>
  );
}
