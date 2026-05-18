'use client';

import { useState } from 'react';
import type { Phase } from '@herside/shared';

interface CheckInProps {
  phase: Phase;
  phaseColor: string;
}

const MOOD_OPTIONS = ['Calm', 'Happy', 'Energized', 'Focused', 'Anxious', 'Tired', 'Irritable', 'Sad'];
const SKIN_OPTIONS = [
  { value: 'clear' as const,       label: 'Clear'        },
  { value: 'okay' as const,        label: 'Okay'         },
  { value: 'breaking_out' as const, label: 'Breaking out' },
];
const SYMPTOM_OPTIONS = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Brain fog', 'Back pain', 'Tender breasts', 'Acne'];

type SkinValue = 'clear' | 'okay' | 'breaking_out';

interface CheckInState {
  energy: number;
  moods: string[];
  skin: SkinValue | null;
  symptoms: string[];
}

export function CheckIn({ phase, phaseColor }: CheckInProps) {
  const [state, setState] = useState<CheckInState>({
    energy: 0,
    moods: [],
    skin: null,
    symptoms: [],
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!state.energy) return;
    setSaving(true);
    // TODO: save to Supabase (Prompt 5+)
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5BAA78' }} />
          <p style={{ color: '#F0E8EC', fontSize: 15, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
            Check-in saved
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            <Pill color={phaseColor}>Energy {state.energy}/10</Pill>
            {state.moods.map(m => <Pill key={m} color="rgba(240,232,236,0.15)">{m}</Pill>)}
            {state.skin && <Pill color="rgba(240,232,236,0.15)">{SKIN_OPTIONS.find(s => s.value === state.skin)?.label}</Pill>}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionLabel color={phaseColor}>Today&apos;s Check-in</SectionLabel>

      {/* Energy */}
      <div style={{ marginTop: 16 }}>
        <FieldLabel>Energy</FieldLabel>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: 10 }, (_, i) => {
            const val = i + 1;
            const active = val <= state.energy;
            return (
              <button
                key={val}
                onClick={() => setState(s => ({ ...s, energy: val }))}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: active ? phaseColor : 'rgba(240,232,236,0.08)',
                  color: active ? '#fff' : 'rgba(240,232,236,0.35)',
                  fontSize: 11,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  flexShrink: 0,
                }}
                aria-label={`Energy ${val}`}
                aria-pressed={active}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood */}
      <div style={{ marginTop: 16 }}>
        <FieldLabel>Mood</FieldLabel>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {MOOD_OPTIONS.map(mood => {
            const active = state.moods.includes(mood);
            return (
              <ChipButton
                key={mood}
                active={active}
                color={phaseColor}
                onClick={() => setState(s => ({
                  ...s,
                  moods: active ? s.moods.filter(m => m !== mood) : [...s.moods, mood],
                }))}
              >
                {mood}
              </ChipButton>
            );
          })}
        </div>
      </div>

      {/* Skin */}
      <div style={{ marginTop: 16 }}>
        <FieldLabel>Skin</FieldLabel>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {SKIN_OPTIONS.map(({ value, label }) => {
            const active = state.skin === value;
            return (
              <ChipButton
                key={value}
                active={active}
                color={phaseColor}
                onClick={() => setState(s => ({ ...s, skin: active ? null : value }))}
              >
                {label}
              </ChipButton>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div style={{ marginTop: 16 }}>
        <FieldLabel>Symptoms <span style={{ color: 'rgba(240,232,236,0.25)', fontWeight: 300 }}>optional</span></FieldLabel>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {SYMPTOM_OPTIONS.map(symptom => {
            const active = state.symptoms.includes(symptom);
            return (
              <ChipButton
                key={symptom}
                active={active}
                color="rgba(240,232,236,0.25)"
                onClick={() => setState(s => ({
                  ...s,
                  symptoms: active
                    ? s.symptoms.filter(sy => sy !== symptom)
                    : [...s.symptoms, symptom],
                }))}
              >
                {symptom}
              </ChipButton>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!state.energy || saving}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '13px 0',
          borderRadius: 50,
          border: 'none',
          background: state.energy ? phaseColor : 'rgba(240,232,236,0.06)',
          color: state.energy ? '#fff' : 'rgba(240,232,236,0.25)',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          letterSpacing: '1px',
          cursor: state.energy ? 'pointer' : 'not-allowed',
          transition: 'all 300ms ease',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving...' : 'Save check-in'}
      </button>
    </Card>
  );
}

// ── Mini design system for CheckIn ───────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '20px 20px 20px',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
      <span style={{
        color: '#F0E8EC',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '0.5px',
      }}>
        {children}
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      color: 'rgba(240,232,236,0.45)',
      fontSize: 11,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: 'DM Sans, sans-serif',
      margin: 0,
    }}>
      {children}
    </p>
  );
}

function ChipButton({
  children,
  active,
  color,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 50,
        border: active ? `1px solid ${color}` : '1px solid rgba(240,232,236,0.09)',
        background: active ? `${color}22` : 'transparent',
        color: active ? '#F0E8EC' : 'rgba(240,232,236,0.45)',
        fontSize: 12,
        fontFamily: 'DM Sans, sans-serif',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        whiteSpace: 'nowrap',
      }}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: 50,
      background: color,
      color: '#fff',
      fontSize: 11,
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {children}
    </span>
  );
}
