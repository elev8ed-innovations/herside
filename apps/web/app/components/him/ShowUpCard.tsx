import type { Phase } from '@herside/shared';
import { getPhaseColor, phaseDescriptions, isHighReactivityDay } from '@herside/shared';

const SHOW_UP: Record<Phase, { headline: string; body: string; tip: string }> = {
  ovulation: {
    headline: 'Meet her at her peak.',
    body: 'She has full verbal clarity and connection energy right now. This is the window for real conversations, shared plans, and genuine presence.',
    tip: 'Make eye contact. Put your phone away. Ask one real question.',
  },
  follicular: {
    headline: 'Match her rising energy.',
    body: 'She\'s building momentum. New ideas are flowing. The best thing you can do is engage — ask questions, make plans, be genuinely interested.',
    tip: 'Suggest something new together. Let her lead the energy.',
  },
  luteal: {
    headline: 'Warmth before everything.',
    body: 'Her nervous system is running hotter than usual. This isn\'t about you. Warmth, patience, and zero pressure are the most powerful things you can offer.',
    tip: 'Ask what she needs, then do exactly that. Don\'t interpret quiet as anger.',
  },
  menstrual: {
    headline: 'Rest is the gift.',
    body: 'Her body is working hard. She needs warmth and quiet, not fixing. Handle what you can so she doesn\'t have to think about it.',
    tip: 'One act of care without being asked. That\'s it.',
  },
};

interface ShowUpCardProps {
  phase: Phase;
}

export function ShowUpCard({ phase }: ShowUpCardProps) {
  const color = getPhaseColor(phase);
  const content = SHOW_UP[phase];
  const highReactivity = isHighReactivityDay(phase);

  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderRadius: 20, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
          How to show up today
        </span>
        {highReactivity && (
          <span style={{
            marginLeft: 'auto', padding: '2px 8px', borderRadius: 50,
            background: 'rgba(208,144,64,0.12)', border: '1px solid rgba(208,144,64,0.3)',
            color: '#D09040', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.5px',
          }}>
            High sensitivity
          </span>
        )}
      </div>

      <p style={{ color: '#F0E8EC', fontSize: 15, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.5 }}>
        {content.headline}
      </p>
      <p style={{ color: 'rgba(240,232,236,0.6)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65, margin: '0 0 14px' }}>
        {content.body}
      </p>
      <div style={{
        background: `${color}10`, border: `1px solid ${color}28`,
        borderRadius: 12, padding: '10px 14px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
        <p style={{ color: 'rgba(240,232,236,0.7)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
          {content.tip}
        </p>
      </div>
    </div>
  );
}
