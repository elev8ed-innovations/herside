import { calculateCurrentPhase, getNextTransition, getPhaseForDay, getPhaseColor, phaseDescriptions } from '@herside/shared';
import type { Phase } from '@herside/shared';

export const dynamic = 'force-dynamic';

function getMockLastPeriodStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 13);
  return d;
}

const HIS_ROLE: Record<Phase, { job: string; actions: string[] }> = {
  menstrual: {
    job: 'Rest support. Warmth, not fixing.',
    actions: [
      'Handle logistics quietly',
      'Bring warmth without pressure',
      'Let her set the pace',
      'Don\'t interpret rest as rejection',
    ],
  },
  follicular: {
    job: 'Engage her rising energy. Be curious.',
    actions: [
      'Ask about her ideas and plans',
      'Be genuinely present for conversation',
      'Suggest something new together',
      'Let her take the lead',
    ],
  },
  ovulation: {
    job: 'Meet her at her peak. Full presence.',
    actions: [
      'Have the real conversations',
      'Make shared plans',
      'Match her connection energy',
      'Put your phone away',
    ],
  },
  luteal: {
    job: 'Warmth first. Zero pressure. No judgment.',
    actions: [
      'Ask what she needs',
      'Handle something without being asked',
      'Don\'t take quiet personally',
      'Keep the environment calm',
    ],
  },
};

const PHASE_ORDER: Phase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

export default function ForecastPage() {
  const CYCLE_LENGTH = 28;
  const { phase: currentPhase, cycleDay } = calculateCurrentPhase(getMockLastPeriodStart(), CYCLE_LENGTH);
  const { daysUntilNextPhase, nextPhase } = getNextTransition(cycleDay, CYCLE_LENGTH);

  // Build 28-day strip
  const days = Array.from({ length: CYCLE_LENGTH }, (_, i) => {
    const day = i + 1;
    const phase = getPhaseForDay(day, CYCLE_LENGTH);
    const color = getPhaseColor(phase);
    const isToday = day === cycleDay;
    const isPast = day < cycleDay;
    return { day, phase, color, isToday, isPast };
  });

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ paddingTop: 24, paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#5085B0' }} />
          <span style={{ color: '#F0E8EC', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>28-Day Forecast</span>
        </div>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 0 11px' }}>
          Sofia's full cycle — your role in each phase.
        </p>
      </div>

      {/* Next transition callout */}
      <div style={{
        marginTop: 16, padding: '12px 16px',
        background: `${getPhaseColor(nextPhase)}10`,
        border: `1px solid ${getPhaseColor(nextPhase)}30`,
        borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: getPhaseColor(nextPhase), flexShrink: 0 }} />
        <p style={{ color: 'rgba(240,232,236,0.6)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          <strong style={{ color: '#F0E8EC' }}>{phaseDescriptions[nextPhase].name}</strong> begins in{' '}
          <strong style={{ color: getPhaseColor(nextPhase) }}>{daysUntilNextPhase} {daysUntilNextPhase === 1 ? 'day' : 'days'}</strong>
        </p>
      </div>

      {/* 28-day strip */}
      <div style={{
        marginTop: 16, background: 'var(--s2)', border: '1px solid var(--dim)',
        borderRadius: 20, padding: '16px 20px',
      }}>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 5, width: 'max-content', padding: '4px 2px' }}>
            {days.map(({ day, color, isToday, isPast }) => (
              <div key={day} title={`Day ${day}`} style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: isToday ? color : isPast ? color : `${color}40`,
                border: isToday ? '2px solid #F0E8EC' : 'none',
                outline: isToday ? `2px solid ${color}` : 'none',
                outlineOffset: 2, boxSizing: 'border-box',
              }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          {PHASE_ORDER.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: getPhaseColor(p) }} />
              <span style={{ fontSize: 10, color: 'rgba(240,232,236,0.35)', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {phaseDescriptions[p].name.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PHASE_ORDER.map(phase => {
          const color = getPhaseColor(phase);
          const desc = phaseDescriptions[phase];
          const role = HIS_ROLE[phase];
          const isCurrent = phase === currentPhase;

          return (
            <div key={phase} style={{
              background: 'var(--s2)', border: `1px solid ${isCurrent ? `${color}40` : 'var(--dim)'}`,
              borderRadius: 20, overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: isCurrent ? `${color}08` : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ color: '#F0E8EC', fontSize: 14, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{desc.name}</span>
                  <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>{desc.tagline}</span>
                </div>
                {isCurrent && (
                  <span style={{ color: color, fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '1px' }}>NOW</span>
                )}
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ color: 'rgba(240,232,236,0.5)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.6 }}>
                  {desc.description}
                </p>
                <div style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 12, padding: '10px 14px' }}>
                  <p style={{ color: color, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 8px' }}>
                    Your job
                  </p>
                  <p style={{ color: 'rgba(240,232,236,0.7)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 10px', fontWeight: 500 }}>
                    {role.job}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {role.actions.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: color, fontSize: 11, flexShrink: 0, opacity: 0.6 }}>·</span>
                        <span style={{ color: 'rgba(240,232,236,0.55)', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
