import { Suspense } from 'react';
import {
  calculateCurrentPhase,
  getNextTransition,
  phaseDescriptions,
  getPhaseColor,
} from '@herside/shared';
import { PhaseRing } from '../components/her/PhaseRing';
import { CycleCalendar } from '../components/her/CycleCalendar';
import { CheckIn } from '../components/her/CheckIn';
import { AIBubble } from '../components/her/AIBubble';
import { DailyInsight } from '../components/her/DailyInsight';
import { IronMindStrip } from '../components/her/IronMindStrip';
import { PatternCard } from '../components/her/PatternCard';


// Demo anchor: today is always Day 14 (ovulation) for the mock
function getMockLastPeriodStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 13); // day 14 of cycle
  return d;
}

export default function HerTodayPage() {
  const CYCLE_LENGTH = 28;
  const lastPeriodStart = getMockLastPeriodStart();
  const { phase, cycleDay } = calculateCurrentPhase(lastPeriodStart, CYCLE_LENGTH);
  const { daysUntilNextPhase, nextPhase } = getNextTransition(cycleDay, CYCLE_LENGTH);
  const phaseColor = getPhaseColor(phase);
  const desc = phaseDescriptions[phase];

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Wordmark */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 8,
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 20,
          color: '#F0E8EC',
          letterSpacing: '-0.5px',
        }}>
          HerSide
        </span>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `${phaseColor}22`,
          border: `1px solid ${phaseColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: phaseColor }} />
        </div>
      </div>

      {/* Phase Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16, paddingBottom: 8 }}>
        <PhaseRing
          phase={phase}
          cycleDay={cycleDay}
          cycleLength={CYCLE_LENGTH}
          daysUntilNextPhase={daysUntilNextPhase}
          nextPhase={nextPhase}
          phaseColor={phaseColor}
          phaseName={desc.name}
          phaseTagline={desc.tagline}
        />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginTop: 20,
        marginBottom: 0,
      }}>
        <StatChip label="Cycle length" value="28 days" color={phaseColor} />
        <StatChip label="Avg energy" value="7.2 / 10" color={phaseColor} />
        <StatChip label="Next period" value={`${CYCLE_LENGTH - cycleDay} days`} color={phaseColor} />
      </div>

      {/* Cycle calendar strip */}
      <Section>
        <SectionHeader color={phaseColor} label="Cycle Map" />
        <div style={{ marginTop: 12 }}>
          <CycleCalendar cycleDay={cycleDay} cycleLength={CYCLE_LENGTH} />
        </div>
      </Section>

      {/* AI insight — async server component, streams from Claude */}
      <Section>
        <Suspense fallback={<AIBubble insight="" phaseColor={phaseColor} isLoading />}>
          <DailyInsight
            phase={phase}
            cycleDay={cycleDay}
            cycleLength={CYCLE_LENGTH}
            phaseColor={phaseColor}
          />
        </Suspense>
      </Section>

      {/* IronMind GritScore */}
      <Section>
        <IronMindStrip
          score={82}
          baseline={76}
          phaseName={desc.name}
          note={`Your GritScore is above your ${desc.name} baseline. Ovulation tends to sharpen focus and raise pain tolerance — a great window for PRs.`}
        />
      </Section>

      {/* Check-in */}
      <Section>
        <CheckIn phase={phase} phaseColor={phaseColor} />
      </Section>

      {/* Pattern card */}
      <Section>
        <PatternCard
          cyclesAnalyzed={6}
          phaseColor={phaseColor}
          pattern="Energy peaks reliably on Days 13–15"
          evidence="Avg energy logged: 8.4/10 across 6 ovulation windows vs 5.9 overall"
          research="Estrogen surge at ovulation correlates with increased dopamine and norepinephrine, elevating both mood and physical capacity."
          whatToTry="Schedule your hardest workouts, most important conversations, and creative work for Days 12–16. Protect this window."
        />
      </Section>

      {/* Circle summary */}
      <Section>
        <CircleSummary phaseColor={phaseColor} phase={desc.name} />
      </Section>
    </div>
  );
}

// ── Local sub-components ──────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: 16 }}>{children}</div>;
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
      <span style={{
        color: '#F0E8EC',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {label}
      </span>
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 14,
      padding: '10px 12px',
    }}>
      <p style={{
        color: 'rgba(240,232,236,0.28)',
        fontSize: 9,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif',
        margin: '0 0 4px',
      }}>
        {label}
      </p>
      <p style={{
        color: color,
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 500,
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
}

function CircleSummary({ phaseColor, phase }: { phaseColor: string; phase: string }) {
  const members = [
    { name: 'Marcus', role: 'Partner', initials: 'M', color: '#5085B0', canSee: 'Phase & energy' },
    { name: 'Coach Tay', role: 'Trainer', initials: 'T', color: '#6AA882', canSee: 'Energy & intensity' },
  ];

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Your Circle
          </span>
        </div>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
          {members.length} connected
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map(m => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: `${m.color}22`,
              border: `1px solid ${m.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: m.color, fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                {m.initials}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#F0E8EC', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 2px', fontWeight: 500 }}>
                {m.name}
              </p>
              <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                {m.role} · sees {m.canSee}
              </p>
            </div>
            <div style={{
              padding: '4px 10px',
              borderRadius: 50,
              background: `${phaseColor}14`,
              border: `1px solid ${phaseColor}30`,
            }}>
              <span style={{ color: phaseColor, fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
                {phase}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
