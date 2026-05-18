interface PatternCardProps {
  pattern: string;
  evidence: string;
  research: string;
  whatToTry: string;
  phaseColor: string;
  cyclesAnalyzed: number;
}

export function PatternCard({
  pattern,
  evidence,
  research,
  whatToTry,
  phaseColor,
  cyclesAnalyzed,
}: PatternCardProps) {
  return (
    <div
      style={{
        background: 'var(--s2)',
        border: '1px solid var(--dim)',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(240,232,236,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{
            color: '#F0E8EC',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif',
          }}>
            Top Pattern
          </span>
        </div>
        <span style={{
          color: 'rgba(240,232,236,0.22)',
          fontSize: 10,
          fontFamily: 'DM Sans, sans-serif',
          letterSpacing: '1px',
        }}>
          {cyclesAnalyzed} cycles analyzed
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PatternRow
          marker="Pattern"
          markerColor={phaseColor}
          text={pattern}
        />
        <PatternRow
          marker="Evidence"
          markerColor="rgba(240,232,236,0.4)"
          text={evidence}
        />
        <PatternRow
          marker="Research"
          markerColor="rgba(240,232,236,0.25)"
          text={research}
        />
        <div style={{
          background: `${phaseColor}12`,
          border: `1px solid ${phaseColor}30`,
          borderRadius: 14,
          padding: '12px 14px',
        }}>
          <span style={{
            color: phaseColor,
            fontSize: 10,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
            display: 'block',
            marginBottom: 6,
          }}>
            What to try
          </span>
          <p style={{
            color: '#F0E8EC',
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {whatToTry}
          </p>
        </div>
      </div>
    </div>
  );
}

function PatternRow({
  marker,
  markerColor,
  text,
}: {
  marker: string;
  markerColor: string;
  text: string;
}) {
  return (
    <div>
      <span style={{
        color: markerColor,
        fontSize: 10,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif',
        display: 'block',
        marginBottom: 4,
      }}>
        {marker}
      </span>
      <p style={{
        color: 'rgba(240,232,236,0.65)',
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
        lineHeight: 1.6,
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}
