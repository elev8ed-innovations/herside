'use server';

import { callClaude } from '@/lib/claude';
import { isHighReactivityDay } from '@herside/shared';
import type { Phase } from '@herside/shared';

const SYSTEM = `You are HerSide responding to a user's accountability check-in.

Question: {question}
Her answer: {answer_type} ({answer_label})
Current phase: {phase}, Day {cycle_day}
This is a {reactivity_level} reactivity day.

Generate a response that is:
- Kind but honest (not validating avoidance)
- Specific to the phase (her biology is real context)
- Action-oriented (one next step, not a lecture)
- 2-3 sentences maximum

If her answer shows growth: acknowledge it specifically.
If her answer shows avoidance: give her one micro-action,
  not a shame spiral. Make it achievable in the next hour.

Never: lecture, shame, generalize, or give more than one action.`;

const FALLBACKS: Record<string, Record<string, string>> = {
  yes: {
    default: 'That took awareness. Keep building on it.',
  },
  somewhat: {
    default: "Partial is still movement. Notice what got in the way — that's the next thing to work with.",
  },
  not_really: {
    default: 'One small step in the next hour counts. What is the tiniest version of this you could do right now?',
  },
};

export async function getAccountabilityResponse(
  question: string,
  answerType: 'yes' | 'somewhat' | 'not_really',
  answerLabel: string,
  phase: Phase,
  cycleDay: number,
): Promise<string> {
  const reactivityLevel = isHighReactivityDay(phase) ? 'high' : 'low';

  const system = SYSTEM
    .replace('{question}', question)
    .replace('{answer_type}', answerType)
    .replace('{answer_label}', answerLabel)
    .replace('{phase}', phase)
    .replace('{cycle_day}', String(cycleDay))
    .replace('{reactivity_level}', reactivityLevel);

  const result = await callClaude(system, 'Generate the accountability response.', 120);
  return result || FALLBACKS[answerType]?.default || 'You showed up. That matters.';
}
