import type { Phase } from '@herside/shared';
import { getPhaseColor, phaseDescriptions } from '@herside/shared';

interface PhaseBadgeProps {
  herName: string;
  phase: Phase;
  cycleDay: number;
  cycleLength: number;
}

export function PhaseBadge({ herName, phase, cycleDay, cycleLength }: PhaseBadgeProps) {
  const color = getPhaseColor(phase);
  const desc = phaseDescriptions[phase];

  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--dim)',
      borderLeft: `3px solid ${color}`, borderRadius: '0 20px 20px 0',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          {herName}
        </span>
        <span style={{ color: 'rgba(240,232,236,0.22)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
          Day {cycleDay} of {cycleLength}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: `${color}18`, border: `1.5px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, animation: 'dot-pulse 3s ease-in-out infinite' }} />
        </div>
        <div>
          <p style={{ color: '#F0E8EC', fontSize: 18, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 3px' }}>
            {desc.name}
          </p>
          <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            {desc.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
