import { Suspense } from 'react';
import { calculateCurrentPhase, getNextTransition, getPhaseColor } from '@herside/shared';
import { PhaseBadge } from '../components/him/PhaseBadge';
import { ShowUpCard } from '../components/him/ShowUpCard';
import { ActionList } from '../components/him/ActionList';
import { DontSayCard } from '../components/him/DontSayCard';
import { HimInsight, HimInsightSkeleton } from '../components/him/HimInsight';
import { HisCheckIn } from '../components/him/HisCheckIn';
import { WeekPreview } from '../components/him/WeekPreview';
import { CycleCalendar } from '../components/her/CycleCalendar';
import { IronMindStrip } from '../components/her/IronMindStrip';


function getMockLastPeriodStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 13);
  return d;
}

export default function HimTodayPage() {
  const CYCLE_LENGTH = 28;
  const { phase, cycleDay } = calculateCurrentPhase(getMockLastPeriodStart(), CYCLE_LENGTH);
  const { daysUntilNextPhase } = getNextTransition(cycleDay, CYCLE_LENGTH);
  const phaseColor = getPhaseColor(phase);

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Wordmark */}
      <div style={{ paddingTop: 20, paddingBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#F0E8EC' }}>HerSide</span>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>Partner view</span>
      </div>

      {/* Phase badge */}
      <PhaseBadge herName="Sofia" phase={phase} cycleDay={cycleDay} cycleLength={CYCLE_LENGTH} />

      {/* How to show up */}
      <div style={{ marginTop: 12 }}>
        <ShowUpCard phase={phase} />
      </div>

      {/* Cycle strip */}
      <div style={{ marginTop: 12, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Her Cycle</span>
          <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', marginLeft: 'auto' }}>
            {daysUntilNextPhase}d until next phase
          </span>
        </div>
        <CycleCalendar cycleDay={cycleDay} cycleLength={CYCLE_LENGTH} />
      </div>

      {/* IronMind */}
      <div style={{ marginTop: 12 }}>
        <IronMindStrip
          score={82} baseline={76}
          phaseName={phase} note="Sofia's GritScore is above her baseline. High energy for connection today."
        />
      </div>

      {/* AI insight */}
      <div style={{ marginTop: 12 }}>
        <Suspense fallback={<HimInsightSkeleton phaseColor={phaseColor} />}>
          <HimInsight phase={phase} cycleDay={cycleDay} phaseColor={phaseColor} />
        </Suspense>
      </div>

      {/* Action list */}
      <div style={{ marginTop: 12 }}>
        <ActionList phase={phase} phaseColor={phaseColor} />
      </div>

      {/* Don't say */}
      <div style={{ marginTop: 12 }}>
        <DontSayCard phase={phase} />
      </div>

      {/* His check-in */}
      <div style={{ marginTop: 12 }}>
        <HisCheckIn />
      </div>

      {/* Week preview */}
      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <WeekPreview cycleDay={cycleDay} cycleLength={CYCLE_LENGTH} />
      </div>
    </div>
  );
}
