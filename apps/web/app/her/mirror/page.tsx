import {
  calculateCurrentPhase,
  getNextTransition,
  phaseDescriptions,
  getPhaseColor,
  isHighReactivityDay,
} from '@herside/shared';
import { AwarenessMeter } from '../../components/her/mirror/AwarenessMeter';
import { AccountabilityCheck } from '../../components/her/mirror/AccountabilityCheck';
import { BreathingTool } from '../../components/her/mirror/BreathingTool';
import { CommunicationScript } from '../../components/her/mirror/CommunicationScript';
import { ReflectionChecklist } from '../../components/her/mirror/ReflectionChecklist';


function getMockLastPeriodStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 13); // Day 14
  return d;
}

export default function MirrorPage() {
  const CYCLE_LENGTH = 28;
  const lastPeriodStart = getMockLastPeriodStart();
  const { phase, cycleDay } = calculateCurrentPhase(lastPeriodStart, CYCLE_LENGTH);
  const phaseColor = getPhaseColor(phase);
  const desc = phaseDescriptions[phase];
  const highReactivity = isHighReactivityDay(phase);

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Header */}
      <div style={{ paddingTop: 24, paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Mirror
          </span>
        </div>
        <p style={{
          color: 'rgba(240,232,236,0.35)',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          margin: '0 0 0 11px',
          lineHeight: 1.5,
        }}>
          Accountability, awareness, and communication — grounded in your biology.
        </p>
      </div>

      {/* Reactivity alert — only in high-reactivity phases */}
      {highReactivity && (
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: 'rgba(208,144,64,0.08)',
          border: '1px solid rgba(208,144,64,0.25)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D09040', flexShrink: 0 }} />
          <p style={{
            color: 'rgba(240,232,236,0.45)',
            fontSize: 11,
            fontFamily: 'DM Sans, sans-serif',
            margin: 0,
            lineHeight: 1.5,
          }}>
            High-reactivity phase. Your nervous system is running hotter. The tools below are most useful right now.
          </p>
        </div>
      )}

      {/* Awareness Meter */}
      <div style={{ marginTop: 16 }}>
        <AwarenessMeter phase={phase} />
      </div>

      {/* The 3 honest questions */}
      <div style={{ marginTop: 16 }}>
        <HonestQuestions phaseColor={phaseColor} phase={desc.name} cycleDay={cycleDay} />
      </div>

      {/* Accountability Check */}
      <div style={{ marginTop: 16 }}>
        <AccountabilityCheck phase={phase} cycleDay={cycleDay} phaseColor={phaseColor} />
      </div>

      {/* Communication Scripts */}
      <div style={{ marginTop: 16 }}>
        <CommunicationScript phase={phase} />
      </div>

      {/* Breathing Tool */}
      <div style={{ marginTop: 16 }}>
        <BreathingTool phaseColor={phaseColor} />
      </div>

      {/* Evening Reflection */}
      <div style={{ marginTop: 16, marginBottom: 4 }}>
        <ReflectionChecklist phaseColor={phaseColor} />
      </div>
    </div>
  );
}

// ── Honest Questions — static awareness prompts ──────────────────

const HONEST_QUESTIONS: Record<string, string[]> = {
  menstrual: [
    'What do you actually need right now — and have you asked for it?',
    'Are you withdrawing from connection or from overstimulation?',
    'What would you tell a friend who felt exactly this way?',
  ],
  follicular: [
    'Are you running on your own plan, or including the people around you?',
    'What important conversation have you been putting off?',
    'Where is your rising energy going — toward what matters?',
  ],
  ovulation: [
    'Are you using your clarity to tackle hard things, or avoid them?',
    'Who needs your full presence right now, not just your energy?',
    'Are you listening as well as you\'re speaking this week?',
  ],
  luteal: [
    'Is what\'s bothering you real, or magnified by your biology right now?',
    'Have you communicated your needs, or expected them to be guessed?',
    'What\'s one small thing that would make today more manageable?',
  ],
};

function HonestQuestions({
  phaseColor,
  phase,
  cycleDay,
}: {
  phaseColor: string;
  phase: string;
  cycleDay: number;
}) {
  const phaseKey = phase.toLowerCase() as keyof typeof HONEST_QUESTIONS;
  const questions = HONEST_QUESTIONS[phaseKey] ?? HONEST_QUESTIONS.follicular;

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
        <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
          What's yours right now
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <span style={{
              color: phaseColor,
              fontSize: 13,
              fontFamily: 'Georgia, serif',
              flexShrink: 0,
              opacity: 0.6,
            }}>
              {i + 1}.
            </span>
            <p style={{
              color: 'rgba(240,232,236,0.6)',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.6,
              margin: 0,
            }}>
              {q}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
