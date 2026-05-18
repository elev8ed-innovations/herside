'use client';

import { useState } from 'react';

const HIM_COLOR = '#5085B0';
const MOODS = ['Good', 'Stressed', 'Tired', 'Disconnected', 'Present', 'Distracted'];

export function HisCheckIn() {
  const [energy, setEnergy] = useState(0);
  const [moods, setMoods] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggleMood = (m: string) =>
    setMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleSave = async () => {
    // TODO: save to Supabase
    setSaved(true);
  };

  if (saved) {
    return (
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5BAA78' }} />
          <p style={{ color: '#F0E8EC', fontSize: 14, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
            Your check-in saved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: HIM_COLOR }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
          How are you doing today?
        </span>
      </div>

      {/* Energy */}
      <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 8px' }}>
        Energy
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(val => {
          const active = val <= energy;
          return (
            <button key={val} onClick={() => setEnergy(val)} style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              background: active ? HIM_COLOR : 'rgba(240,232,236,0.08)',
              color: active ? '#fff' : 'rgba(240,232,236,0.35)',
              fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              cursor: 'pointer', flexShrink: 0, transition: 'all 200ms ease',
            }}>
              {val}
            </button>
          );
        })}
      </div>

      {/* Mood */}
      <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 8px' }}>
        Mood
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {MOODS.map(mood => {
          const active = moods.includes(mood);
          return (
            <button key={mood} onClick={() => toggleMood(mood)} style={{
              padding: '6px 14px', borderRadius: 50, cursor: 'pointer', transition: 'all 200ms ease',
              border: active ? `1px solid ${HIM_COLOR}` : '1px solid rgba(240,232,236,0.09)',
              background: active ? `${HIM_COLOR}22` : 'transparent',
              color: active ? '#F0E8EC' : 'rgba(240,232,236,0.45)',
              fontSize: 12, fontFamily: 'DM Sans, sans-serif',
            }}>
              {mood}
            </button>
          );
        })}
      </div>

      <button onClick={handleSave} disabled={!energy} style={{
        width: '100%', padding: '13px 0', borderRadius: 50, border: 'none',
        background: energy ? HIM_COLOR : 'rgba(240,232,236,0.06)',
        color: energy ? '#fff' : 'rgba(240,232,236,0.25)',
        fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
        cursor: energy ? 'pointer' : 'not-allowed', transition: 'all 300ms ease',
      }}>
        Save check-in
      </button>
    </div>
  );
}
