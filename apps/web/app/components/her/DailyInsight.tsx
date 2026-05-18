// Async Server Component — calls Claude server-side, never exposes API key.
// Wrap in <Suspense fallback={<AIBubble isLoading />}> in the parent.

import type { Phase } from '@herside/shared';
import { phaseDescriptions } from '@herside/shared';
import { callClaude } from '@/lib/claude';
import { AIBubble } from './AIBubble';

const SYSTEM_PROMPT = `You are HerSide generating today's insight for the user.

Generate a 2-paragraph insight (max 120 words total):
Para 1: What's happening biologically right now, connected to her specific numbers from today vs her baseline.
Para 2: One concrete thing she can use from this — timing, action, or reframe. Make it specific to today.

No bullet points. No headers. Conversational but precise.
Bold key numbers or phrases using **markdown**.
Never diagnose. Never fabricate data. Use "this is consistent with" not "you have."`;

interface Props {
  phase: Phase;
  cycleDay: number;
  cycleLength: number;
  phaseColor: string;
  // Real wearable/checkin data passed in once auth + data layer is wired
  energyAvg?: number;
  gritScore?: number;
  gritBaseline?: number;
  hrv?: number;
  hrvBaseline?: number;
}

export async function DailyInsight({
  phase,
  cycleDay,
  cycleLength,
  phaseColor,
  energyAvg = 7.2,
  gritScore = 82,
  gritBaseline = 76,
  hrv = 58,
  hrvBaseline = 54,
}: Props) {
  const desc = phaseDescriptions[phase];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const userMessage = `Today: ${today}, Cycle Day ${cycleDay} of ${cycleLength}, ${desc.name} phase.
Recent check-ins: Energy avg ${energyAvg}/10 over last 7 days.
HRV today: ${hrv}ms (baseline: ${hrvBaseline}ms).
GritScore today: ${gritScore} (baseline: ${gritBaseline}).
Key lab flags: Vitamin D slightly low-normal (38 ng/mL).

Generate today's insight.`;

  const insight = await callClaude(SYSTEM_PROMPT, userMessage, 200);

  const fallback = `You're in **${desc.name}** — ${desc.description} **HRV at ${hrv}ms** is above your ${hrvBaseline}ms baseline, signaling strong recovery. Use this window for high-intensity training, bold conversations, and ambitious goals.`;

  return <AIBubble insight={insight || fallback} phaseColor={phaseColor} />;
}
