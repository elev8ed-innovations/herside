import type { Phase } from '@herside/shared';
import { getPhaseColor } from '@herside/shared';

interface Factor {
  label: string;
  description: string;
  value: number;        // 0–100
  baseline: number;     // her phase average
  dataSource: string;
}

// Phase-calibrated factor levels — real data replaces these once wired
const PHASE_FACTORS: Record<Phase, Factor[]> = {
  ovulation: [
    { label: 'Emotional reactivity', description: 'Likelihood of outsized emotional responses', value: 28, baseline: 62, dataSource: 'HRV + checkins' },
    { label: 'Rumination tendency', description: 'Looping thoughts after conflict or stress', value: 22, baseline: 55, dataSource: 'Checkin history' },
    { label: 'Tone misreading', description: 'Risk of misinterpreting neutral expressions', value: 30, baseline: 58, dataSource: 'Self-reported' },
    { label: 'Energy withdrawal', description: 'Tendency to disengage when overwhelmed', value: 18, baseline: 48, dataSource: 'Energy logs' },
    { label: 'Physical sensitivity', description: 'Pain and discomfort threshold changes', value: 40, baseline: 50, dataSource: 'Wearable + checkins' },
  ],
  follicular: [
    { label: 'Emotional reactivity', description: 'Likelihood of outsized emotional responses', value: 35, baseline: 62, dataSource: 'HRV + checkins' },
    { label: 'Rumination tendency', description: 'Looping thoughts after conflict or stress', value: 30, baseline: 55, dataSource: 'Checkin history' },
    { label: 'Tone misreading', description: 'Risk of misinterpreting neutral expressions', value: 38, baseline: 58, dataSource: 'Self-reported' },
    { label: 'Energy withdrawal', description: 'Tendency to disengage when overwhelmed', value: 25, baseline: 48, dataSource: 'Energy logs' },
    { label: 'Physical sensitivity', description: 'Pain and discomfort threshold changes', value: 35, baseline: 50, dataSource: 'Wearable + checkins' },
  ],
  luteal: [
    { label: 'Emotional reactivity', description: 'Likelihood of outsized emotional responses', value: 78, baseline: 62, dataSource: 'HRV + checkins' },
    { label: 'Rumination tendency', description: 'Looping thoughts after conflict or stress', value: 70, baseline: 55, dataSource: 'Checkin history' },
    { label: 'Tone misreading', description: 'Risk of misinterpreting neutral expressions', value: 72, baseline: 58, dataSource: 'Self-reported' },
    { label: 'Energy withdrawal', description: 'Tendency to disengage when overwhelmed', value: 65, baseline: 48, dataSource: 'Energy logs' },
    { label: 'Physical sensitivity', description: 'Pain and discomfort threshold changes', value: 68, baseline: 50, dataSource: 'Wearable + checkins' },
  ],
  menstrual: [
    { label: 'Emotional reactivity', description: 'Likelihood of outsized emotional responses', value: 55, baseline: 62, dataSource: 'HRV + checkins' },
    { label: 'Rumination tendency', description: 'Looping thoughts after conflict or stress', value: 48, baseline: 55, dataSource: 'Checkin history' },
    { label: 'Tone misreading', description: 'Risk of misinterpreting neutral expressions', value: 52, baseline: 58, dataSource: 'Self-reported' },
    { label: 'Energy withdrawal', description: 'Tendency to disengage when overwhelmed', value: 72, baseline: 48, dataSource: 'Energy logs' },
    { label: 'Physical sensitivity', description: 'Pain and discomfort threshold changes', value: 80, baseline: 50, dataSource: 'Wearable + checkins' },
  ],
};

function barColor(value: number, phaseColor: string): string {
  if (value < 35) return '#5BAA78';
  if (value < 65) return '#D09040';
  return '#D05555';
}

interface AwarenessMeterProps {
  phase: Phase;
}

export function AwarenessMeter({ phase }: AwarenessMeterProps) {
  const factors = PHASE_FACTORS[phase];
  const phaseColor = getPhaseColor(phase);

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(240,232,236,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Awareness Meter
          </span>
        </div>
        <span style={{ color: 'rgba(240,232,236,0.22)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '1px' }}>
          TODAY
        </span>
      </div>

      {/* Factors */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {factors.map((f, i) => {
          const color = barColor(f.value, phaseColor);
          const diff = f.value - f.baseline;
          const diffLabel = diff >= 0 ? `+${diff}` : `${diff}`;
          return (
            <div key={f.label}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ color: 'rgba(240,232,236,0.7)', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                    {f.label}
                  </span>
                  <span style={{
                    color: 'rgba(240,232,236,0.25)',
                    fontSize: 10,
                    fontFamily: 'DM Sans, sans-serif',
                    marginLeft: 8,
                  }}>
                    {f.dataSource}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ color, fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                    {f.value}
                  </span>
                  <span style={{
                    color: diff < 0 ? '#5BAA78' : '#D09040',
                    fontSize: 10,
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {diffLabel} vs avg
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div style={{
                height: 5,
                background: 'rgba(240,232,236,0.06)',
                borderRadius: 50,
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Baseline marker */}
                <div style={{
                  position: 'absolute',
                  left: `${f.baseline}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: 'rgba(240,232,236,0.2)',
                  zIndex: 1,
                }} />
                {/* Value bar */}
                <div style={{
                  height: '100%',
                  width: `${f.value}%`,
                  background: color,
                  borderRadius: 50,
                  opacity: 0.85,
                }} />
              </div>

              <p style={{
                color: 'rgba(240,232,236,0.25)',
                fontSize: 11,
                fontFamily: 'DM Sans, sans-serif',
                margin: '5px 0 0',
                lineHeight: 1.4,
              }}>
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
