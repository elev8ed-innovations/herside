interface IronMindStripProps {
  score: number;          // 0-100
  baseline: number;       // her average for this phase
  phaseName: string;
  note: string;
}

export function IronMindStrip({ score, baseline, phaseName, note }: IronMindStripProps) {
  const diff = score - baseline;
  const diffLabel = diff >= 0 ? `+${diff}` : `${diff}`;
  const diffColor = diff >= -5 ? '#5BAA78' : diff >= -15 ? '#D09040' : '#D05555';
  const barPct = Math.max(0, Math.min(100, score));

  return (
    <div
      style={{
        background: 'var(--s2)',
        border: '1px solid var(--dim)',
        borderRadius: 20,
        padding: '16px 20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#C8943A' }} />
          <span style={{
            color: '#C8943A',
            fontSize: 10,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            IronMind GritScore
          </span>
        </div>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
          {phaseName} avg: {baseline}
        </span>
      </div>

      {/* Score + bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div>
          <span style={{
            color: '#F0E8EC',
            fontSize: 36,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
          }}>
            {score}
          </span>
          <span style={{
            color: diffColor,
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            marginLeft: 8,
          }}>
            {diffLabel}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            height: 6,
            background: 'rgba(240,232,236,0.06)',
            borderRadius: 50,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${barPct}%`,
              background: `linear-gradient(to right, #C8943A, #D09040)`,
              borderRadius: 50,
              transition: 'width 1s cubic-bezier(0.34, 1.1, 0.64, 1)',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
          }}>
            <span style={{ color: 'rgba(240,232,236,0.2)', fontSize: 9, fontFamily: 'DM Sans, sans-serif' }}>0</span>
            <span style={{ color: 'rgba(240,232,236,0.2)', fontSize: 9, fontFamily: 'DM Sans, sans-serif' }}>100</span>
          </div>
        </div>
      </div>

      {/* Note */}
      <p style={{
        color: 'rgba(240,232,236,0.4)',
        fontSize: 12,
        fontFamily: 'DM Sans, sans-serif',
        lineHeight: 1.6,
        margin: '12px 0 0',
      }}>
        {note}
      </p>
    </div>
  );
}
