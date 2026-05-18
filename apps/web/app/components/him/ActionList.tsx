'use client';

import { useState } from 'react';
import type { Phase } from '@herside/shared';

const ACTIONS: Record<Phase, string[]> = {
  ovulation: [
    'Have the conversation you\'ve been putting off',
    'Make a real plan together — she\'s in full clarity mode',
    'Put your phone away when she\'s talking',
    'Ask her what she\'s excited about right now',
    'Match her energy — initiate quality time',
  ],
  follicular: [
    'Engage her ideas without taking them over',
    'Suggest something new you could do together',
    'Be present for conversation — she wants connection',
    'Let her lead the planning',
    'Celebrate her energy, don\'t question it',
  ],
  luteal: [
    'Ask "what do you need?" and wait for the full answer',
    'Handle one task she usually does — without being asked',
    'Don\'t interpret her quiet as anger at you',
    'Physical warmth without expectation',
    'Keep the environment calm — less noise, less pressure',
  ],
  menstrual: [
    'Bring warmth. Ask, don\'t assume.',
    'Handle logistics so she doesn\'t have to think',
    'Let her rest without guilt or commentary',
    'Don\'t take the low energy personally',
    'One genuine act of care today',
  ],
};

interface ActionListProps {
  phase: Phase;
  phaseColor: string;
}

export function ActionList({ phase, phaseColor }: ActionListProps) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const actions = ACTIONS[phase];

  const toggle = (i: number) =>
    setDone(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Today's Actions</span>
        </div>
        {done.size > 0 && (
          <span style={{ color: phaseColor, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>{done.size}/{actions.length}</span>
        )}
      </div>
      <div style={{ padding: '8px 20px 14px' }}>
        {actions.map((action, i) => {
          const checked = done.has(i);
          return (
            <button key={i} onClick={() => toggle(i)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                border: checked ? `1.5px solid ${phaseColor}` : '1.5px solid rgba(240,232,236,0.15)',
                background: checked ? `${phaseColor}20` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms ease',
              }}>
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={phaseColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{
                color: checked ? 'rgba(240,232,236,0.3)' : 'rgba(240,232,236,0.7)',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4,
                textDecoration: checked ? 'line-through' : 'none',
                textDecorationColor: 'rgba(240,232,236,0.2)',
                transition: 'all 200ms ease',
              }}>
                {action}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
