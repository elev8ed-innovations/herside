'use client';

import { useState } from 'react';

const ITEMS = [
  'I communicated how I actually felt today',
  'I noticed when my biology was influencing my mood',
  'I gave myself grace for my limits today',
  'I reached out when I needed support',
  'I did something for my body today',
];

interface ReflectionChecklistProps {
  phaseColor: string;
}

export function ReflectionChecklist({ phaseColor }: ReflectionChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const count = checked.size;
  const done = count === ITEMS.length;

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
            Evening Reflection
          </span>
        </div>
        <span style={{ color: count > 0 ? phaseColor : 'rgba(240,232,236,0.22)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'color 300ms ease' }}>
          {count}/{ITEMS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(240,232,236,0.05)' }}>
        <div style={{
          height: '100%',
          width: `${(count / ITEMS.length) * 100}%`,
          background: phaseColor,
          transition: 'width 400ms cubic-bezier(0.34,1.1,0.64,1)',
          opacity: 0.7,
        }} />
      </div>

      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ITEMS.map((item, i) => {
          const isChecked = checked.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
              aria-pressed={isChecked}
            >
              {/* Checkbox */}
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: isChecked ? `1.5px solid ${phaseColor}` : '1.5px solid rgba(240,232,236,0.15)',
                background: isChecked ? `${phaseColor}20` : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}>
                {isChecked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={phaseColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{
                color: isChecked ? 'rgba(240,232,236,0.4)' : 'rgba(240,232,236,0.65)',
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                lineHeight: 1.4,
                textDecoration: isChecked ? 'line-through' : 'none',
                textDecorationColor: 'rgba(240,232,236,0.2)',
                transition: 'all 200ms ease',
              }}>
                {item}
              </span>
            </button>
          );
        })}

        {done && (
          <p style={{
            color: phaseColor,
            fontSize: 13,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 0,
          }}>
            You showed up for yourself today.
          </p>
        )}
      </div>
    </div>
  );
}
