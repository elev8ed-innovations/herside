import type { Phase } from '../types/cycle';

// ── Core calculation (exact formula from brief) ───────────────────

export interface PhaseResult {
  phase: Phase;
  cycleDay: number;
  daysUntilNextPeriod: number;
  daysUntilNextPhase: number;
  nextPhase: Phase;
  cycleLength: number;
}

export function calculateCurrentPhase(
  lastPeriodStart: Date,
  cycleLength: number = 28,
): PhaseResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(lastPeriodStart);
  start.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const cycleDay = (daysSinceStart % cycleLength) + 1;
  const daysUntilNextPeriod = cycleLength - (cycleDay - 1);

  const phase = getPhaseForDay(cycleDay, cycleLength);
  const { daysUntilNextPhase, nextPhase } = getNextTransition(
    cycleDay,
    cycleLength,
  );

  return {
    phase,
    cycleDay,
    daysUntilNextPeriod,
    daysUntilNextPhase,
    nextPhase,
    cycleLength,
  };
}

// Given any cycle day (1-based), return its phase
export function getPhaseForDay(
  cycleDay: number,
  cycleLength: number = 28,
): Phase {
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= Math.floor(cycleLength * 0.46)) return 'follicular';
  if (cycleDay <= Math.floor(cycleLength * 0.57)) return 'ovulation';
  return 'luteal';
}

// Days remaining in current phase + what comes next
export function getNextTransition(
  cycleDay: number,
  cycleLength: number = 28,
): { daysUntilNextPhase: number; nextPhase: Phase } {
  const follicularEnd = Math.floor(cycleLength * 0.46);
  const ovulationEnd = Math.floor(cycleLength * 0.57);

  if (cycleDay <= 5) {
    return { daysUntilNextPhase: 5 - cycleDay + 1, nextPhase: 'follicular' };
  }
  if (cycleDay <= follicularEnd) {
    return {
      daysUntilNextPhase: follicularEnd - cycleDay + 1,
      nextPhase: 'ovulation',
    };
  }
  if (cycleDay <= ovulationEnd) {
    return {
      daysUntilNextPhase: ovulationEnd - cycleDay + 1,
      nextPhase: 'luteal',
    };
  }
  return {
    daysUntilNextPhase: cycleLength - cycleDay + 1,
    nextPhase: 'menstrual',
  };
}

// ── N-day forecast ────────────────────────────────────────────────

export interface ForecastDay {
  date: Date;
  cycleDay: number;
  phase: Phase;
  isPhaseStart: boolean;
  isToday: boolean;
}

export function getForecast(
  lastPeriodStart: Date,
  cycleLength: number = 28,
  days: number = 28,
): ForecastDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const daysSinceStart = Math.floor(
      (date.getTime() - new Date(lastPeriodStart).setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24),
    );

    const cycleDay = (daysSinceStart % cycleLength) + 1;
    const phase = getPhaseForDay(cycleDay, cycleLength);
    const prevCycleDay = cycleDay === 1 ? cycleLength : cycleDay - 1;
    const prevPhase = getPhaseForDay(prevCycleDay, cycleLength);

    return {
      date,
      cycleDay,
      phase,
      isPhaseStart: phase !== prevPhase || cycleDay === 1,
      isToday: i === 0,
    };
  });
}

// ── Phase metadata ────────────────────────────────────────────────

export type TrainingIntensity = 'push' | 'build' | 'moderate' | 'gentle';

export interface PhaseDescription {
  name: string;
  tagline: string;
  description: string;
  partnerGuidance: string;
  trainerGuidance: string;
  trainerIntensity: TrainingIntensity;
  trainerProtocol: string;
  isHighReactivity: boolean;
  energyLevel: 1 | 2 | 3 | 4; // 1=lowest, 4=peak
  communicationTip: string;
}

export const phaseDescriptions: Record<Phase, PhaseDescription> = {
  menstrual: {
    name: 'Menstrual',
    tagline: 'Release & Rest',
    description:
      'Estrogen and progesterone at their lowest. Your body is working hard. Rest is the most productive thing you can do.',
    partnerGuidance:
      'Warmth, quiet, zero pressure. Ask what she needs — then do exactly that.',
    trainerGuidance:
      'Gentle movement only. Her body is in active recovery. Honor that.',
    trainerIntensity: 'gentle',
    trainerProtocol: 'Gentle Movement Protocol',
    isHighReactivity: true,
    energyLevel: 1,
    communicationTip:
      'Keep it simple. Less is more. Presence without agenda.',
  },
  follicular: {
    name: 'Follicular',
    tagline: 'Rising Energy',
    description:
      'Estrogen rising, dopamine with it. Your superpower window is opening. Energy, focus, and motivation are climbing.',
    partnerGuidance:
      "She's opening up. Plan something, try something new, have the real conversation.",
    trainerGuidance:
      'Build load progressively. She responds well to new challenges and PR attempts this phase.',
    trainerIntensity: 'build',
    trainerProtocol: 'Progressive Build Protocol',
    isHighReactivity: false,
    energyLevel: 3,
    communicationTip:
      "She's curious and open. This is the window for bigger conversations.",
  },
  ovulation: {
    name: 'Ovulation',
    tagline: 'Peak Power',
    description:
      'Peak confidence, peak connection, peak physical strength. This is you at your fullest.',
    partnerGuidance:
      'Be fully present. Quality time lands deepest here. She is at her most open.',
    trainerGuidance:
      'Push hard — this is her peak strength window. Note: ACL/ligament injury risk is elevated; cue form carefully.',
    trainerIntensity: 'push',
    trainerProtocol: 'Peak Performance Protocol',
    isHighReactivity: false,
    energyLevel: 4,
    communicationTip:
      'She is at her most socially confident. High-stakes conversations land well here.',
  },
  luteal: {
    name: 'Luteal',
    tagline: 'Inward & Sensitive',
    description:
      'Progesterone dominant. Energy naturally lower — not by failure, by design. Rest is productive.',
    partnerGuidance:
      'Presence over performance. Soft landing. Less noise, fewer decisions, more warmth.',
    trainerGuidance:
      'Moderate intensity. Technique work over max loads. Watch for fatigue accumulating faster than normal.',
    trainerIntensity: 'moderate',
    trainerProtocol: 'Luteal Protocol',
    isHighReactivity: true,
    energyLevel: 2,
    communicationTip:
      "Don't interpret quiet or sensitivity as conflict. She needs soft presence.",
  },
};

// ── Color helpers ─────────────────────────────────────────────────

const PHASE_COLORS: Record<Phase, string> = {
  menstrual:  '#C96B84',
  follicular: '#6AA882',
  ovulation:  '#C8943A',
  luteal:     '#8B68C0',
};

export function getPhaseColor(phase: Phase): string {
  return PHASE_COLORS[phase];
}

export function getPhaseColorRgb(phase: Phase): string {
  const hex = PHASE_COLORS[phase];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Intensity helpers ─────────────────────────────────────────────

export function getPhaseIntensity(phase: Phase): TrainingIntensity {
  return phaseDescriptions[phase].trainerIntensity;
}

export function getIntensityLabel(intensity: TrainingIntensity): string {
  const labels: Record<TrainingIntensity, string> = {
    push:     'Push Hard',
    build:    'Build',
    moderate: 'Moderate',
    gentle:   'Gentle Only',
  };
  return labels[intensity];
}

export function getIntensityColor(intensity: TrainingIntensity): string {
  const colors: Record<TrainingIntensity, string> = {
    push:     '#D05555',
    build:    '#C8943A',
    moderate: '#5085B0',
    gentle:   '#6AA882',
  };
  return colors[intensity];
}

// ── Reactivity helpers (for partner view) ────────────────────────

export function isHighReactivityDay(phase: Phase): boolean {
  return phaseDescriptions[phase].isHighReactivity;
}

export function getEnergyLevel(phase: Phase): 1 | 2 | 3 | 4 {
  return phaseDescriptions[phase].energyLevel;
}

// ── Date utilities ────────────────────────────────────────────────

export function formatCycleDay(cycleDay: number): string {
  return `Day ${cycleDay}`;
}

export function formatDaysUntil(days: number, label = 'next period'): string {
  if (days === 1) return `1 day until ${label}`;
  return `${days} days until ${label}`;
}

export function estimateNextPeriod(
  lastPeriodStart: Date,
  cycleLength: number = 28,
): Date {
  const next = new Date(lastPeriodStart);
  next.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Advance by full cycle lengths until the result is strictly after today
  while (next <= today) {
    next.setDate(next.getDate() + cycleLength);
  }
  return next;
}

// Re-export Phase type so callers only need one import
export type { Phase };
