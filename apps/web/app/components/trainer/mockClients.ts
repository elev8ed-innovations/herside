import { getPhaseForDay, getPhaseColor, getPhaseIntensity, getIntensityLabel, getIntensityColor, phaseDescriptions } from '@herside/shared';
import type { Phase } from '@herside/shared';

export interface MockClient {
  id: string;
  name: string;
  initials: string;
  cycleDay: number;
  cycleLength: number;
  gritScore: number | null;
  gritBaseline: number;
  phase: Phase;
  phaseColor: string;
  phaseName: string;
  intensityKey: ReturnType<typeof getPhaseIntensity>;
  intensityLabel: string;
  intensityColor: string;
}

const RAW = [
  { id: 'sofia', name: 'Sofia R.',  initials: 'SR', cycleDay: 14, cycleLength: 28, gritScore: 82, gritBaseline: 76 },
  { id: 'emma',  name: 'Emma K.',   initials: 'EK', cycleDay: 22, cycleLength: 28, gritScore: 58, gritBaseline: 68 },
  { id: 'jade',  name: 'Jade M.',   initials: 'JM', cycleDay:  3, cycleLength: 28, gritScore: 44, gritBaseline: 60 },
  { id: 'maya',  name: 'Maya L.',   initials: 'ML', cycleDay:  9, cycleLength: 28, gritScore: 71, gritBaseline: 65 },
];

export const MOCK_CLIENTS: MockClient[] = RAW.map(c => {
  const phase = getPhaseForDay(c.cycleDay, c.cycleLength);
  const phaseColor = getPhaseColor(phase);
  const intensityKey = getPhaseIntensity(phase);
  return {
    ...c,
    phase,
    phaseColor,
    phaseName: phaseDescriptions[phase].name,
    intensityKey,
    intensityLabel: getIntensityLabel(intensityKey),
    intensityColor: getIntensityColor(intensityKey),
  };
});

export const SESSION_PLANS: Record<Phase, { protocolName: string; bullets: string[]; ironmindNote: string }> = {
  ovulation: {
    protocolName: 'Peak Power Protocol',
    bullets: [
      'PRs are on the table — estrogen at peak',
      'Plyometrics and explosive compound lifts',
      'ACL/joint awareness drills (laxity elevated at ovulation)',
      'Max effort intervals at 90%+ capacity',
      'Hydration and warm-up critical today',
    ],
    ironmindNote: 'GritScore < 65: reduce explosive work, pivot to skill refinement',
  },
  follicular: {
    protocolName: 'Strength Build Protocol',
    bullets: [
      'Compound lifts at 75-85% 1RM — progressive overload window',
      '3-4 sets × 5-8 reps',
      'Introduce one new skill or movement pattern',
      '15-20 min strength, 10 min conditioning',
      'Pain tolerance and motivation at phase high',
    ],
    ironmindNote: 'GritScore < 60: drop to 70% 1RM, add extra mobility',
  },
  luteal: {
    protocolName: 'Luteal Protocol',
    bullets: [
      'RPE capped at 7/10 — neurological fatigue is real',
      'Technique and form focus over max load',
      'Extended warm-up: 10-15 min minimum',
      'Skip PRs — neuromuscular power is reduced',
      'Longer cool-down and recovery work',
    ],
    ironmindNote: 'GritScore < 55: drop to 60% 1RM, consider swapping to mobility session',
  },
  menstrual: {
    protocolName: 'Recovery Protocol',
    bullets: [
      'Gentle movement — yoga, walk, swim, or stretching',
      'No HIIT, no heavy compound lifts',
      'This is active recovery — it counts as training',
      'Breathwork if session is in-person',
      'Acknowledge the effort it took to show up',
    ],
    ironmindNote: 'GritScore < 40: rest day recommended — do not push through',
  },
};
