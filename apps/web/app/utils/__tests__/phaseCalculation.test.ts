/**
 * Phase calculation engine — unit tests
 * Run with: npx tsx --test apps/web/app/utils/__tests__/phaseCalculation.test.ts
 */

import {
  calculateCurrentPhase,
  getPhaseForDay,
  getNextTransition,
  getForecast,
  getPhaseColor,
  getPhaseIntensity,
  getIntensityLabel,
  isHighReactivityDay,
  estimateNextPeriod,
} from '@herside/shared';

// ── getPhaseForDay ────────────────────────────────────────────────
const assertPhase = (day: number, expected: string, cycle = 28) => {
  const result = getPhaseForDay(day, cycle);
  if (result !== expected) {
    throw new Error(`Day ${day} (cycle ${cycle}): expected "${expected}", got "${result}"`);
  }
};

// 28-day cycle boundaries
assertPhase(1,  'menstrual');
assertPhase(5,  'menstrual');
assertPhase(6,  'follicular');
assertPhase(12, 'follicular');  // floor(28 * 0.46) = 12
assertPhase(13, 'ovulation');
assertPhase(15, 'ovulation');   // floor(28 * 0.57) = 15
assertPhase(16, 'luteal');
assertPhase(28, 'luteal');

// 30-day cycle boundaries
assertPhase(6,  'follicular', 30);
assertPhase(13, 'follicular', 30); // floor(30 * 0.46) = 13
assertPhase(14, 'ovulation',  30);
assertPhase(17, 'ovulation',  30); // floor(30 * 0.57) = 17
assertPhase(18, 'luteal',     30);

// ── getNextTransition ─────────────────────────────────────────────
const t1 = getNextTransition(3, 28);
if (t1.nextPhase !== 'follicular') throw new Error('Day 3 next phase should be follicular');
if (t1.daysUntilNextPhase !== 3)   throw new Error(`Day 3: expected 3 days left, got ${t1.daysUntilNextPhase}`);

const t2 = getNextTransition(12, 28);
if (t2.nextPhase !== 'ovulation') throw new Error('Day 12 next phase should be ovulation');
if (t2.daysUntilNextPhase !== 1)  throw new Error(`Day 12: expected 1 day left, got ${t2.daysUntilNextPhase}`);

const t3 = getNextTransition(28, 28);
if (t3.nextPhase !== 'menstrual') throw new Error('Day 28 next phase should be menstrual');
if (t3.daysUntilNextPhase !== 1)  throw new Error(`Day 28: expected 1 day left, got ${t3.daysUntilNextPhase}`);

// ── calculateCurrentPhase ─────────────────────────────────────────
// 14 days ago → day 15, ovulation (for 28-day cycle)
const date14ago = new Date();
date14ago.setDate(date14ago.getDate() - 14);
const result = calculateCurrentPhase(date14ago, 28);
if (result.cycleDay !== 15) throw new Error(`Expected cycleDay 15, got ${result.cycleDay}`);
if (result.phase !== 'ovulation') throw new Error(`Expected ovulation, got ${result.phase}`);

// Cycle wrapping: 35 days ago on a 28-day cycle → day 8
const date35ago = new Date();
date35ago.setDate(date35ago.getDate() - 35);
const wrapped = calculateCurrentPhase(date35ago, 28);
if (wrapped.cycleDay !== 8) throw new Error(`Expected cycleDay 8 (wrapped), got ${wrapped.cycleDay}`);
if (wrapped.phase !== 'follicular') throw new Error(`Expected follicular, got ${wrapped.phase}`);

// ── getForecast ───────────────────────────────────────────────────
const forecast = getForecast(new Date(), 28, 28);
if (forecast.length !== 28) throw new Error(`Expected 28 days, got ${forecast.length}`);
if (!forecast[0].isToday) throw new Error('First forecast day should be today');
if (forecast[0].cycleDay !== 1) throw new Error('Forecast from today should start at day 1');

// Check phase transitions are marked
const transitions = forecast.filter(d => d.isPhaseStart);
if (transitions.length < 1) throw new Error('Forecast should have at least one phase start');

// ── Helpers ───────────────────────────────────────────────────────
if (getPhaseColor('menstrual')  !== '#C96B84') throw new Error('Wrong menstrual color');
if (getPhaseColor('follicular') !== '#6AA882') throw new Error('Wrong follicular color');
if (getPhaseColor('ovulation')  !== '#C8943A') throw new Error('Wrong ovulation color');
if (getPhaseColor('luteal')     !== '#8B68C0') throw new Error('Wrong luteal color');

if (getPhaseIntensity('ovulation') !== 'push')   throw new Error('Ovulation should be push');
if (getPhaseIntensity('menstrual') !== 'gentle')  throw new Error('Menstrual should be gentle');
if (getPhaseIntensity('follicular') !== 'build')  throw new Error('Follicular should be build');
if (getPhaseIntensity('luteal') !== 'moderate')   throw new Error('Luteal should be moderate');

if (getIntensityLabel('push') !== 'Push Hard') throw new Error('Wrong push label');
if (getIntensityLabel('gentle') !== 'Gentle Only') throw new Error('Wrong gentle label');

if (!isHighReactivityDay('menstrual')) throw new Error('Menstrual should be high reactivity');
if (!isHighReactivityDay('luteal'))    throw new Error('Luteal should be high reactivity');
if (isHighReactivityDay('ovulation'))  throw new Error('Ovulation should NOT be high reactivity');

// estimateNextPeriod — should be in the future
const nextPeriod = estimateNextPeriod(new Date(), 28);
if (nextPeriod <= new Date()) throw new Error('Next period should be in the future');

console.log('✓ All phase calculation tests passed');
