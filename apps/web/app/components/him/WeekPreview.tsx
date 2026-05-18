import { getPhaseForDay, getPhaseColor, phaseDescriptions } from '@herside/shared';

interface WeekPreviewProps {
  cycleDay: number;
  cycleLength: number;
}

export function WeekPreview({ cycleDay, cycleLength }: WeekPreviewProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = ((cycleDay - 1 + i) % cycleLength) + 1;
    const phase = getPhaseForDay(day, cycleLength);
    const color = getPhaseColor(phase);
    const isToday = i === 0;
    return { day, phase, color, isToday, offset: i };
  });

  const dayNames = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const fullNames = Array.from({ length: 7 }, (_, i) => {
    if (i === 0) return 'Today';
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: '#5085B0' }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
          This week
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {days.map(({ day, phase, color, isToday }, i) => {
          const desc = phaseDescriptions[phase];
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 9, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.5px' }}>
                {fullNames[i]}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: isToday ? color : `${color}40`,
                border: isToday ? '2px solid #F0E8EC' : 'none',
                outline: isToday ? `2px solid ${color}` : 'none',
                outlineOffset: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 300ms ease',
              }}>
                <span style={{ color: isToday ? '#fff' : `${color}CC`, fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  {day}
                </span>
              </div>
              <span style={{ color: color, fontSize: 8, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: isToday ? 1 : 0.6 }}>
                {desc.name.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
