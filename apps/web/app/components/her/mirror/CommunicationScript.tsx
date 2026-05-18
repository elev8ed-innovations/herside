import type { Phase } from '@herside/shared';
import { getPhaseColor } from '@herside/shared';

interface Script {
  sayThis: string;
  notThat: string;
  context?: string;
}

const SCRIPTS: Record<Phase, Script[]> = {
  menstrual: [
    {
      sayThis: '"I need some quiet time to restore — I\'ll be back."',
      notThat: 'Going silent without explanation',
      context: 'Low hormones mean real fatigue. Rest is the productive choice.',
    },
    {
      sayThis: '"I\'m not at full capacity today. It\'s not about you."',
      notThat: 'Forcing yourself to seem fine',
      context: 'Naming it prevents misreading.',
    },
    {
      sayThis: '"Can we save [thing] for later this week? I\'ll be genuinely better for it."',
      notThat: 'Saying yes and resenting it later',
    },
  ],
  follicular: [
    {
      sayThis: '"I\'d love to plan this together — I have good energy for it."',
      notThat: 'Taking over because momentum is high',
      context: 'Rising estrogen brings collaboration energy. Use it.',
    },
    {
      sayThis: '"I\'m feeling clear-headed. Good moment for a real conversation."',
      notThat: 'Rushing past emotional undercurrents',
    },
    {
      sayThis: '"Let\'s work on this together."',
      notThat: 'Going solo because it\'s faster',
      context: 'Follicular clarity is real. Share it.',
    },
  ],
  ovulation: [
    {
      sayThis: '"I\'m feeling confident — let\'s tackle the hard conversations now."',
      notThat: 'Avoiding depth when you\'re actually equipped for it',
      context: 'Peak estrogen = peak verbal fluency and empathy.',
    },
    {
      sayThis: '"I\'d love your input on this while I\'m thinking clearly."',
      notThat: 'Dismissing input because you feel invincible',
    },
    {
      sayThis: '"Let\'s make real time for each other this week."',
      notThat: 'Overcommitting and leaving nothing for the relationship',
      context: 'Your connection window. Protect it.',
    },
  ],
  luteal: [
    {
      sayThis: '"I\'m more sensitive than usual today — it\'s not about you."',
      notThat: '"I\'m fine" when you\'re clearly not',
      context: 'Progesterone + dropping estrogen = real sensitivity. Name it first.',
    },
    {
      sayThis: '"I need [specific thing] right now — can you help?"',
      notThat: 'Expecting them to guess what you need',
      context: 'Be specific. Vague requests become misread.',
    },
    {
      sayThis: '"I\'m struggling today. Can we keep things simple?"',
      notThat: 'Picking a fight because you\'re uncomfortable',
    },
  ],
};

interface CommunicationScriptProps {
  phase: Phase;
}

export function CommunicationScript({ phase }: CommunicationScriptProps) {
  const scripts = SCRIPTS[phase];
  const phaseColor = getPhaseColor(phase);

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(240,232,236,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: phaseColor }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Say This
          </span>
        </div>
        <span style={{ color: 'rgba(240,232,236,0.22)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '1px' }}>
          NOT THAT
        </span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {scripts.map((script, i) => (
          <div key={i}>
            {/* Say This */}
            <div style={{
              background: `${phaseColor}0C`,
              border: `1px solid ${phaseColor}28`,
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 8,
            }}>
              <p style={{
                color: '#F0E8EC',
                fontSize: 13,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                lineHeight: 1.5,
                margin: '0 0 4px',
              }}>
                {script.sayThis}
              </p>
              {script.context && (
                <p style={{
                  color: phaseColor,
                  fontSize: 11,
                  fontFamily: 'DM Sans, sans-serif',
                  margin: 0,
                  opacity: 0.7,
                }}>
                  {script.context}
                </p>
              )}
            </div>

            {/* Not That */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 4px',
            }}>
              <div style={{ width: 1, height: 28, background: 'rgba(208,85,85,0.2)', flexShrink: 0, marginLeft: 10 }} />
              <p style={{
                color: 'rgba(208,85,85,0.5)',
                fontSize: 12,
                fontFamily: 'DM Sans, sans-serif',
                margin: 0,
                lineHeight: 1.4,
              }}>
                {script.notThat}
              </p>
            </div>

            {i < scripts.length - 1 && (
              <div style={{ height: 1, background: 'rgba(240,232,236,0.04)', marginTop: 16 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
