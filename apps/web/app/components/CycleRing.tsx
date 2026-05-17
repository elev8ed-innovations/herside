'use client';

// Segment geometry constants
const R = 100;
const C = 2 * Math.PI * R;
const GAP = 8;
const AVAILABLE = C - GAP * 4;

interface PhaseSpec {
  name: string;
  days: number;
  color: string;
  tagline: string;
  dayStart: number;
}

const PHASES: PhaseSpec[] = [
  { name: 'Menstrual',  days: 5,  color: '#C96B84', tagline: 'Release & Rest',      dayStart: 1  },
  { name: 'Follicular', days: 8,  color: '#6AA882', tagline: 'Rising Energy',       dayStart: 6  },
  { name: 'Ovulation',  days: 3,  color: '#C8943A', tagline: 'Peak Power',          dayStart: 14 },
  { name: 'Luteal',     days: 12, color: '#8B68C0', tagline: 'Inward & Sensitive',  dayStart: 17 },
];

interface Segment extends PhaseSpec {
  length: number;
  arcStart: number; // position on ring (px along circumference)
}

const SEGMENTS: Segment[] = PHASES.reduce<{ segs: Segment[]; cursor: number }>(
  ({ segs, cursor }, phase) => {
    const length = (phase.days / 28) * AVAILABLE;
    return {
      segs: [...segs, { ...phase, length, arcStart: cursor }],
      cursor: cursor + length + GAP,
    };
  },
  { segs: [], cursor: 0 }
).segs;

const TODAY = 14; // Ovulation, day 14

function dotCoords(day: number): { x: number; y: number; color: string; phase: PhaseSpec } | null {
  for (const seg of SEGMENTS) {
    if (day >= seg.dayStart && day < seg.dayStart + seg.days) {
      const progress   = (day - seg.dayStart) / seg.days;
      const posOnRing  = seg.arcStart + progress * seg.length;
      // Ring starts at 12-o'clock (segments group rotated -90°)
      const angleDeg   = (posOnRing / C) * 360 - 90;
      const angleRad   = (angleDeg * Math.PI) / 180;
      return {
        x: 160 + R * Math.cos(angleRad),
        y: 160 + R * Math.sin(angleRad),
        color: seg.color,
        phase: seg,
      };
    }
  }
  return null;
}

const dot = dotCoords(TODAY);
const todayPhase = SEGMENTS.find(s => TODAY >= s.dayStart && TODAY < s.dayStart + s.days);

export function CycleRing() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 340, height: 340 }}
    >
      {/* Ambient glow behind ring */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center,
            rgba(201,107,132,0.18) 0%,
            rgba(139,104,192,0.08) 45%,
            transparent 70%)`,
          animation: 'pulse-bg 5s ease-in-out infinite',
        }}
      />

      <svg
        viewBox="0 0 320 320"
        width={320}
        height={320}
        style={{ animation: 'ring-glow 5s ease-in-out infinite', overflow: 'visible' }}
        aria-label="Cycle ring showing today at Day 14, Ovulation phase"
      >
        <defs>
          {/* Segment glow */}
          <filter id="seg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for indicator dot */}
          <filter id="dot-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft inner glow ring */}
          <filter id="outer-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ambient glow ring */}
        <circle
          cx="160" cy="160" r={R + 14}
          fill="none"
          stroke="rgba(201,107,132,0.12)"
          strokeWidth="28"
          filter="url(#outer-glow)"
          style={{ animation: 'glow-ring 5s ease-in-out infinite' }}
        />

        {/* Track */}
        <circle
          cx="160" cy="160" r={R}
          fill="none"
          stroke="#1A1422"
          strokeWidth="14"
        />

        {/* Phase arc segments — rotated so Day 1 starts at 12 o'clock */}
        <g style={{ transform: 'rotate(-90deg)', transformOrigin: '160px 160px' }}>
          {SEGMENTS.map((seg) => (
            <circle
              key={seg.name}
              cx="160" cy="160" r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${seg.length} ${C - seg.length}`}
              strokeDashoffset={-seg.arcStart}
              filter="url(#seg-glow)"
              opacity="0.95"
            />
          ))}
        </g>

        {/* Today indicator dot */}
        {dot && (
          <>
            {/* Outer pulse ring */}
            <circle
              cx={dot.x} cy={dot.y} r={14}
              fill="none"
              stroke={dot.color}
              strokeWidth="1"
              opacity="0.4"
              style={{ animation: 'dot-ring-pulse 2.5s ease-in-out infinite' }}
            />
            {/* Core dot */}
            <circle
              cx={dot.x} cy={dot.y} r={7}
              fill={dot.color}
              filter="url(#dot-glow)"
              style={{ animation: 'dot-pulse 2.5s ease-in-out infinite' }}
            />
            {/* Inner highlight */}
            <circle
              cx={dot.x - 2} cy={dot.y - 2} r={2.5}
              fill="rgba(255,255,255,0.6)"
            />
          </>
        )}

        {/* Center content */}
        <text
          x="160" y="144"
          textAnchor="middle"
          fill="rgba(240,232,236,0.35)"
          fontSize="10"
          fontFamily="DM Sans, sans-serif"
          letterSpacing="3"
        >
          TODAY · DAY {TODAY}
        </text>
        <text
          x="160" y="167"
          textAnchor="middle"
          fill={todayPhase?.color ?? '#C96B84'}
          fontSize="17"
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          {todayPhase?.name ?? 'Ovulation'}
        </text>
        <text
          x="160" y="184"
          textAnchor="middle"
          fill="rgba(240,232,236,0.28)"
          fontSize="10"
          fontFamily="DM Sans, sans-serif"
        >
          {todayPhase?.tagline ?? 'Peak Power'}
        </text>
      </svg>
    </div>
  );
}
