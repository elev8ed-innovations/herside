'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type BPhase = 'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2';

const SEQUENCE: BPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
const DURATION_S = 4;

const LABELS: Record<BPhase, string> = {
  idle: 'Box Breathing',
  inhale: 'Inhale',
  hold1: 'Hold',
  exhale: 'Exhale',
  hold2: 'Hold',
};

// Fraction of max size for each phase
const SCALE: Record<BPhase, number> = {
  idle: 0.6,
  inhale: 1,
  hold1: 1,
  exhale: 0.6,
  hold2: 0.6,
};

const TRANSITION: Record<BPhase, string> = {
  idle:   'transform 600ms ease',
  inhale: `transform ${DURATION_S}s ease-in`,
  hold1:  'transform 200ms ease',
  exhale: `transform ${DURATION_S}s ease-out`,
  hold2:  'transform 200ms ease',
};

interface BreathingToolProps {
  phaseColor: string;
}

export function BreathingTool({ phaseColor }: BreathingToolProps) {
  const [bPhase, setBPhase] = useState<BPhase>('idle');
  const [count, setCount] = useState(DURATION_S);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const seqRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
  };

  const startCount = useCallback(() => {
    setCount(DURATION_S);
    if (countRef.current) clearInterval(countRef.current);
    countRef.current = setInterval(() => {
      setCount(c => (c > 1 ? c - 1 : DURATION_S));
    }, 1000);
  }, []);

  const advance = useCallback(() => {
    seqRef.current = (seqRef.current + 1) % SEQUENCE.length;
    const next = SEQUENCE[seqRef.current];
    setBPhase(next);
    if (next === 'inhale') setCycles(c => c + 1);
    startCount();
    timerRef.current = setTimeout(advance, DURATION_S * 1000);
  }, [startCount]);

  const handleStart = () => {
    setRunning(true);
    seqRef.current = -1;
    setCycles(0);
    advance();
  };

  const handleStop = () => {
    setRunning(false);
    clearTimers();
    setBPhase('idle');
    setCount(DURATION_S);
  };

  useEffect(() => () => clearTimers(), []);

  const size = 140;
  const scale = SCALE[bPhase];

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Breathing Tool
          </span>
        </div>
        {cycles > 0 && (
          <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'}
          </span>
        )}
      </div>

      {/* Breathing circle */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Outer glow ring */}
          {running && (
            <div style={{
              position: 'absolute',
              inset: -12,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${phaseColor}18 0%, transparent 70%)`,
              animation: 'pulse-bg 4s ease-in-out infinite',
            }} />
          )}
          {/* Breathing circle */}
          <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `${phaseColor}14`,
            border: `1.5px solid ${phaseColor}40`,
            transform: `scale(${scale})`,
            transition: TRANSITION[bPhase],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}>
            <span style={{
              color: phaseColor,
              fontSize: running ? 11 : 13,
              letterSpacing: running ? '2px' : '1px',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}>
              {LABELS[bPhase]}
            </span>
            {running && (
              <span style={{
                color: 'rgba(240,232,236,0.4)',
                fontSize: 22,
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
              }}>
                {count}
              </span>
            )}
          </div>
        </div>

        {/* Phase strip */}
        {running && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {SEQUENCE.map((p, i) => {
              const active = p === bPhase;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: active ? 24 : 8,
                    height: 3,
                    borderRadius: 50,
                    background: active ? phaseColor : 'rgba(240,232,236,0.12)',
                    transition: 'all 300ms ease',
                  }} />
                  {i < SEQUENCE.length - 1 && (
                    <div style={{ width: 4 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4-4-4-4 labels */}
        {!running && (
          <div style={{ display: 'flex', gap: 16 }}>
            {(['Inhale', 'Hold', 'Exhale', 'Hold'] as const).map((label, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ color: phaseColor, fontSize: 14, fontFamily: 'Georgia, serif' }}>4</span>
                <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Start / Stop */}
        <button
          onClick={running ? handleStop : handleStart}
          style={{
            padding: '11px 32px',
            borderRadius: 50,
            border: running ? '1px solid rgba(240,232,236,0.12)' : 'none',
            background: running ? 'transparent' : phaseColor,
            color: running ? 'rgba(240,232,236,0.4)' : '#fff',
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.5px',
            transition: 'all 300ms ease',
          }}
        >
          {running ? 'Stop' : 'Begin'}
        </button>

        {!running && (
          <p style={{
            color: 'rgba(240,232,236,0.2)',
            fontSize: 11,
            fontFamily: 'DM Sans, sans-serif',
            textAlign: 'center',
            margin: 0,
          }}>
            Use before difficult conversations or when reactive
          </p>
        )}
      </div>
    </div>
  );
}
