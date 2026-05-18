import { getPhaseForDay, getPhaseColor } from '@herside/shared';

interface CycleCalendarProps {
  cycleDay: number;
  cycleLength: number;
}

export function CycleCalendar({ cycleDay, cycleLength }: CycleCalendarProps) {
  const days = Array.from({ length: cycleLength }, (_, i) => {
    const day = i + 1;
    const phase = getPhaseForDay(day, cycleLength);
    const color = getPhaseColor(phase);
    const isToday = day === cycleDay;
    const isPast = day < cycleDay;
    return { day, phase, color, isToday, isPast };
  });

  // Find phase start days for labels
  const phaseStarts: { day: number; label: string; color: string }[] = [];
  for (let i = 0; i < days.length; i++) {
    if (i === 0 || days[i].phase !== days[i - 1].phase) {
      const labels: Record<string, string> = {
        menstrual: 'M', follicular: 'F', ovulation: 'O', luteal: 'L',
      };
      phaseStarts.push({
        day: days[i].day,
        label: labels[days[i].phase],
        color: days[i].color,
      });
    }
  }

  return (
    <div>
      <div
        style={{
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 5, padding: '4px 2px', width: 'max-content' }}>
          {days.map(({ day, color, isToday, isPast }) => (
            <div
              key={day}
              title={`Day ${day}`}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: isToday ? color : isPast ? color : `${color}40`,
                border: isToday ? `2px solid #F0E8EC` : 'none',
                outline: isToday ? `2px solid ${color}` : 'none',
                outlineOffset: 2,
                flexShrink: 0,
                transition: 'all 300ms ease',
                boxSizing: 'border-box',
              }}
            />
          ))}
        </div>
      </div>

      {/* Phase labels */}
      <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
        {phaseStarts.map(({ label, color, day }) => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
            <span style={{
              fontSize: 10,
              color: 'rgba(240,232,236,0.35)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {label} · {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
