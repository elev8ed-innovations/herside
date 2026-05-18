'use client';

import { useState } from 'react';
import { BreathingTool } from '../../components/her/mirror/BreathingTool';

const HIM_COLOR = '#5085B0';

const SCRIPTS_BY_PHASE: Record<string, Array<{ sayThis: string; insteadOf: string }>> = {
  ovulation: [
    { sayThis: '"I want to hear what you\'re thinking about this."', insteadOf: '"I\'ll just handle it."' },
    { sayThis: '"Let\'s make time for a real conversation tonight."', insteadOf: '"We can talk later" (indefinitely)' },
    { sayThis: '"You seem really clear — what do you think we should do?"', insteadOf: '"I already decided."' },
  ],
  follicular: [
    { sayThis: '"I love watching you get into something new."', insteadOf: '"You\'re always starting something."' },
    { sayThis: '"What are you excited about right now?"', insteadOf: '"Can we not plan everything?"' },
    { sayThis: '"I\'m in — let\'s do this together."', insteadOf: '"Sounds like a lot of work."' },
  ],
  luteal: [
    { sayThis: '"What do you need from me right now?"', insteadOf: '"What\'s wrong with you?"' },
    { sayThis: '"I can see you\'re carrying a lot. I\'m here."', insteadOf: '"You\'re being so dramatic."' },
    { sayThis: '"Let me handle dinner tonight."', insteadOf: '"Why can\'t you just relax?"' },
  ],
  menstrual: [
    { sayThis: '"Rest. I\'ve got everything else today."', insteadOf: '"Can you just push through?"' },
    { sayThis: '"What would feel good right now?"', insteadOf: '"You always get like this."' },
    { sayThis: '"Take all the time you need."', insteadOf: '"How much longer is this going to last?"' },
  ],
};

const REFLECTION_ITEMS = [
  'I showed up with patience today, not just presence',
  'I asked what she needed instead of assuming',
  'I didn\'t take her mood personally',
];

export default function SayPage() {
  const [phase] = useState('ovulation'); // real: from context/store
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const scripts = SCRIPTS_BY_PHASE[phase] ?? SCRIPTS_BY_PHASE.ovulation;

  const toggle = (i: number) =>
    setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ paddingTop: 24, paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: HIM_COLOR }} />
          <span style={{ color: '#F0E8EC', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>What to Say</span>
        </div>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 0 11px' }}>
          Specific words. Not therapy. Not generic. Just what actually helps.
        </p>
      </div>

      {/* Scripts */}
      <div style={{ marginTop: 16, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: HIM_COLOR }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Say This</span>
          </div>
          <span style={{ color: 'rgba(240,232,236,0.2)', fontSize: 10, letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif' }}>INSTEAD OF</span>
        </div>
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {scripts.map((s, i) => (
            <div key={i}>
              <div style={{ background: `${HIM_COLOR}0C`, border: `1px solid ${HIM_COLOR}28`, borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
                <p style={{ color: '#F0E8EC', fontSize: 13, fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                  {s.sayThis}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
                <div style={{ width: 1, height: 24, background: 'rgba(208,85,85,0.2)', marginLeft: 10, flexShrink: 0 }} />
                <p style={{ color: 'rgba(208,85,85,0.45)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                  {s.insteadOf}
                </p>
              </div>
              {i < scripts.length - 1 && <div style={{ height: 1, background: 'rgba(240,232,236,0.04)', marginTop: 16 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Research card */}
      <div style={{
        marginTop: 12, background: 'var(--s2)', border: '1px solid var(--dim)',
        borderRadius: 20, padding: '16px 20px',
      }}>
        <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 10px' }}>
          Why this works
        </p>
        <p style={{ color: 'rgba(240,232,236,0.55)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65, margin: 0 }}>
          During ovulation, estrogen peaks and so does a woman's verbal fluency, emotional sensitivity, and desire for genuine connection. The words you choose now land differently — and are remembered longer.{' '}
          <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11 }}>
            Hammen et al., 2009 · Pillsworth & Haselton, 2006
          </span>
        </p>
      </div>

      {/* Breathing tool */}
      <div style={{ marginTop: 12 }}>
        <BreathingTool phaseColor={HIM_COLOR} />
      </div>

      {/* Evening reflection */}
      <div style={{ marginTop: 12, marginBottom: 4, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: HIM_COLOR }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Evening Reflection</span>
          </div>
        </div>
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {REFLECTION_ITEMS.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: isChecked ? `1.5px solid ${HIM_COLOR}` : '1.5px solid rgba(240,232,236,0.15)',
                  background: isChecked ? `${HIM_COLOR}20` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}>
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke={HIM_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  color: isChecked ? 'rgba(240,232,236,0.3)' : 'rgba(240,232,236,0.65)',
                  fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4,
                  textDecoration: isChecked ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(240,232,236,0.2)', transition: 'all 200ms ease',
                }}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
