import type { Phase } from '@herside/shared';
import { getPhaseColor } from '@herside/shared';

const DONT_SAY: Record<Phase, string[]> = {
  ovulation: [
    '"Why are you so sure about everything all of a sudden?"',
    '"Let me take over" (when she\'s already leading)',
    '"You don\'t need to plan everything"',
    '"You seem different lately"',
  ],
  follicular: [
    '"Slow down, we don\'t need to plan all of this"',
    '"Let me handle it" (taking over her momentum)',
    '"Are you sure you\'re not overdoing it?"',
    '"Why are you so excited about this?"',
  ],
  luteal: [
    '"You\'re just being emotional"',
    '"It\'s not a big deal"',
    '"You were fine yesterday"',
    '"Can you just calm down?"',
    '"Why are you so sensitive?"',
  ],
  menstrual: [
    '"Can you just push through it?"',
    '"But you were fine an hour ago"',
    '"You always get like this"',
    '"Is it that time of the month?"',
  ],
};

const WHY: Record<Phase, string> = {
  ovulation: 'She\'s in peak clarity. Questions about her confidence undermine the moment.',
  follicular: 'Her energy is rising naturally. Questioning it kills momentum.',
  luteal: 'Her nervous system is genuinely elevated. These phrases escalate rather than help.',
  menstrual: 'Her body is doing real work. These phrases minimize a real physical experience.',
};

interface DontSayCardProps {
  phase: Phase;
}

export function DontSayCard({ phase }: DontSayCardProps) {
  const color = getPhaseColor(phase);
  const phrases = DONT_SAY[phase];
  const why = WHY[phase];

  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: '#D05555' }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Don't say today</span>
      </div>
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {phrases.map((phrase, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: '#D05555', fontSize: 14, fontFamily: 'DM Sans, sans-serif', flexShrink: 0, opacity: 0.6, marginTop: 1 }}>✕</span>
              <p style={{ color: 'rgba(240,232,236,0.55)', fontSize: 13, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                {phrase}
              </p>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.6, borderTop: '1px solid rgba(240,232,236,0.05)', paddingTop: 12 }}>
          {why}
        </p>
      </div>
    </div>
  );
}
