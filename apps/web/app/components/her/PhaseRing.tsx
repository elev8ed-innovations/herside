'use client';

import { useEffect, useRef } from 'react';
import type { Phase } from '@herside/shared';

interface PhaseRingProps {
  phase: Phase;
  cycleDay: number;
  cycleLength: number;
  daysUntilNextPhase: number;
  nextPhase: Phase;
  phaseColor: string;
  phaseName: string;
  phaseTagline: string;
}

const R = 76;
const C = 2 * Math.PI * R;
const SIZE = 200;
const CX = SIZE / 2;

export function PhaseRing({
  phase,
  cycleDay,
  cycleLength,
  daysUntilNextPhase,
  nextPhase,
  phaseColor,
  phaseName,
  phaseTagline,
}: PhaseRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Cycle progress — how far through the full cycle
  const cycleProgress = cycleDay / cycleLength;
  const arcLength = C * cycleProgress;

  // Phase segment — small tick showing current phase window
  const PHASE_BOUNDARIES: Record<Phase, [number, number]> = {
    menstrual:  [0,                            5 / cycleLength],
    follicular: [5 / cycleLength,              Math.floor(cycleLength * 0.46) / cycleLength],
    ovulation:  [Math.floor(cycleLength * 0.46) / cycleLength, Math.floor(cycleLength * 0.57) / cycleLength],
    luteal:     [Math.floor(cycleLength * 0.57) / cycleLength, 1],
  };
  const [phaseStart, phaseEnd] = PHASE_BOUNDARIES[phase];
  const phaseArcStart = C * phaseStart;
  const phaseArcLen   = C * (phaseEnd - phaseStart);

  useEffect(() => {
    if (!svgRef.current) return;
    // Entrance animation: draw arc from 0
    const arc = svgRef.current.querySelector<SVGCircleElement>('#progress-arc');
    if (!arc) return;
    arc.style.strokeDasharray = `0 ${C}`;
    arc.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        arc.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.34, 1.1, 0.64, 1)';
        arc.style.strokeDasharray = `${arcLength} ${C - arcLength}`;
      });
    });
  }, [arcLength]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        {/* Ambient glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 20,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${phaseColor}22 0%, transparent 70%)`,
            animation: 'pulse-bg 4s ease-in-out infinite',
          }}
        />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          style={{ animation: 'ring-glow 4s ease-in-out infinite', overflow: 'visible' }}
          aria-label={`${phaseName}, Day ${cycleDay} of ${cycleLength}`}
        >
          <defs>
            <filter id="ring-glow-f" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle cx={CX} cy={CX} r={R} fill="none" stroke="#1A1422" strokeWidth={10} />

          {/* Phase window on track (dim) */}
          <g style={{ transform: `rotate(-90deg)`, transformOrigin: `${CX}px ${CX}px` }}>
            <circle
              cx={CX} cy={CX} r={R}
              fill="none"
              stroke={phaseColor}
              strokeWidth={10}
              strokeDasharray={`${phaseArcLen} ${C - phaseArcLen}`}
              strokeDashoffset={-phaseArcStart}
              opacity={0.18}
            />
          </g>

          {/* Cycle progress arc */}
          <g style={{ transform: `rotate(-90deg)`, transformOrigin: `${CX}px ${CX}px` }}>
            <circle
              id="progress-arc"
              cx={CX} cy={CX} r={R}
              fill="none"
              stroke={phaseColor}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${C - arcLength}`}
              filter="url(#ring-glow-f)"
            />
          </g>

          {/* Indicator dot at today's position */}
          {(() => {
            const angleDeg = cycleProgress * 360 - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const dx = CX + R * Math.cos(angleRad);
            const dy = CX + R * Math.sin(angleRad);
            return (
              <>
                <circle cx={dx} cy={dy} r={6} fill={phaseColor} filter="url(#ring-glow-f)"
                  style={{ animation: 'dot-pulse 3s ease-in-out infinite' }} />
                <circle cx={dx - 1.5} cy={dy - 1.5} r={2} fill="rgba(255,255,255,0.55)" />
              </>
            );
          })()}

          {/* Center: day number */}
          <text x={CX} y={CX - 18} textAnchor="middle"
            fill="rgba(240,232,236,0.35)" fontSize={11}
            fontFamily="DM Sans, sans-serif" letterSpacing={3}>
            DAY
          </text>
          <text x={CX} y={CX + 22} textAnchor="middle"
            fill="#F0E8EC" fontSize={38}
            fontFamily="Georgia, serif">
            {cycleDay}
          </text>
          <text x={CX} y={CX + 40} textAnchor="middle"
            fill={phaseColor} fontSize={12}
            fontFamily="Georgia, serif" fontStyle="italic">
            {phaseName}
          </text>
        </svg>
      </div>

      {/* Tagline + next phase */}
      <p style={{ color: 'rgba(240,232,236,0.5)', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
        {phaseTagline}
      </p>
      <p style={{ color: 'rgba(240,232,236,0.22)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
        {daysUntilNextPhase === 1 ? 'Tomorrow' : `${daysUntilNextPhase} days`} until {nextPhase}
      </p>
    </div>
  );
}
