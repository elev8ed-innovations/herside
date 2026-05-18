interface AIBubbleProps {
  insight: string; // markdown-lite: **bold** supported
  phaseColor: string;
  isLoading?: boolean;
}

export function AIBubble({ insight, phaseColor, isLoading }: AIBubbleProps) {
  return (
    <div
      style={{
        background: 'var(--s2)',
        border: '1px solid var(--dim)',
        borderLeft: `3px solid ${phaseColor}`,
        borderRadius: '0 20px 20px 0',
        padding: '18px 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: phaseColor,
            animation: 'dot-pulse 3s ease-in-out infinite',
          }}
        />
        <span
          style={{
            color: 'rgba(240,232,236,0.35)',
            fontSize: 10,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          HerSide AI · Today&apos;s Insight
        </span>
      </div>

      {isLoading ? (
        <InsightSkeleton />
      ) : (
        <InsightText text={insight} />
      )}
    </div>
  );
}

function InsightText({ text }: { text: string }) {
  // Render **bold** markdown
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p
      style={{
        color: 'rgba(240,232,236,0.75)',
        fontSize: 14,
        lineHeight: 1.75,
        fontFamily: 'DM Sans, sans-serif',
        margin: 0,
      }}
    >
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} style={{ color: '#F0E8EC', fontWeight: 500 }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

function InsightSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[100, 85, 65].map(w => (
        <div
          key={w}
          style={{
            height: 12,
            width: `${w}%`,
            borderRadius: 6,
            background: 'rgba(240,232,236,0.06)',
            animation: 'pulse-bg 2s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}
