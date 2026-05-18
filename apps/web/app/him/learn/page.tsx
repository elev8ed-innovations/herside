import { getPhaseColor, phaseDescriptions } from '@herside/shared';
import type { Phase } from '@herside/shared';

const HIM_COLOR = '#5085B0';

const PHASES_FOR_PARTNERS: Array<{
  phase: Phase;
  partnerHeadline: string;
  whatSheExperiences: string;
  whatYouMightNotice: string;
  commonMistake: string;
}> = [
  {
    phase: 'menstrual',
    partnerHeadline: 'Her body is doing real work. Rest isn\'t laziness.',
    whatSheExperiences: 'Estrogen and progesterone are at their lowest. Energy is genuinely reduced. She may need more warmth and less stimulation.',
    whatYouMightNotice: 'She\'s quieter, slower, less interested in plans. This is biology, not rejection.',
    commonMistake: 'Interpreting her need for rest as her withdrawing from you.',
  },
  {
    phase: 'follicular',
    partnerHeadline: 'She\'s building momentum. Engage it, don\'t question it.',
    whatSheExperiences: 'Estrogen is rising, bringing energy, motivation, and curiosity. She wants to plan, connect, and create.',
    whatYouMightNotice: 'More ideas, more energy, more enthusiasm. She wants to be heard and matched.',
    commonMistake: 'Slowing her down or being dismissive when she\'s excited.',
  },
  {
    phase: 'ovulation',
    partnerHeadline: 'Peak window. Full presence required.',
    whatSheExperiences: 'Estrogen peaks. Verbal fluency, empathy, and connection desire are all at their highest. She\'s at her best — and she knows it.',
    whatYouMightNotice: 'She\'s decisive, articulate, socially magnetic. She wants real conversation and real connection.',
    commonMistake: 'Being on your phone, giving half-presence, missing the window.',
  },
  {
    phase: 'luteal',
    partnerHeadline: 'Her nervous system is running hotter. It\'s not about you.',
    whatSheExperiences: 'Progesterone rises then falls, and estrogen drops. This creates real neurological sensitivity — things that wouldn\'t bother her usually, do now.',
    whatYouMightNotice: 'She may seem more irritable, tired, or emotionally charged. Conflict feels bigger. Small things land harder.',
    commonMistake: 'Taking it personally. Getting defensive. Arguing logic when she needs warmth.',
  },
];

const STATS = [
  { number: '28%', label: 'of male partners understand their partner\'s cycle well enough to adjust their behavior' },
  { number: '3×', label: 'improvement in relationship satisfaction when partners track and respond to cycle phases' },
  { number: '73%', label: 'of women say their partner misreads hormonal symptoms as personality' },
];

export default function LearnPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ paddingTop: 24, paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: HIM_COLOR }} />
          <span style={{ color: '#F0E8EC', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Learn</span>
        </div>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 0 11px' }}>
          The biology behind her cycle — explained for partners.
        </p>
      </div>

      {/* Stats banner */}
      <div style={{ marginTop: 16, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 20px' }}>
        <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 14px' }}>
          The numbers
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STATS.map(stat => (
            <div key={stat.number} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ color: HIM_COLOR, fontSize: 24, fontFamily: 'Georgia, serif', flexShrink: 0, lineHeight: 1 }}>
                {stat.number}
              </span>
              <p style={{ color: 'rgba(240,232,236,0.45)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5, paddingTop: 3 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PHASES_FOR_PARTNERS.map(({ phase, partnerHeadline, whatSheExperiences, whatYouMightNotice, commonMistake }) => {
          const color = getPhaseColor(phase);
          const desc = phaseDescriptions[phase];
          return (
            <div key={phase} style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', gap: 10, background: `${color}06` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span style={{ color: '#F0E8EC', fontSize: 14, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{desc.name}</span>
                <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>{desc.tagline}</span>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ color: '#F0E8EC', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                  {partnerHeadline}
                </p>
                <LearnRow label="What she experiences" text={whatSheExperiences} color={color} />
                <LearnRow label="What you might notice" text={whatYouMightNotice} color={HIM_COLOR} />
                <div style={{ background: 'rgba(208,85,85,0.06)', border: '1px solid rgba(208,85,85,0.15)', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ color: 'rgba(208,85,85,0.5)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 4px' }}>
                    Common mistake
                  </p>
                  <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
                    {commonMistake}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* IronMind section */}
      <div style={{ marginTop: 12, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#C8943A' }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>IronMind GritScore</span>
        </div>
        <p style={{ color: 'rgba(240,232,236,0.55)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.65, margin: '0 0 10px' }}>
          GritScore measures her mental toughness and readiness each session. When you see it drop below her phase baseline, that's a signal — not a personality change.
        </p>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, margin: 0 }}>
          A low GritScore during luteal means her nervous system is taxed. A high GritScore during ovulation means she's ready to be challenged. This data makes her invisible effort visible.
        </p>
      </div>

      {/* Notification preview */}
      <div style={{ marginTop: 12, marginBottom: 4, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 20px' }}>
        <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 12px' }}>
          Daily notification preview
        </p>
        <div style={{ background: 'rgba(240,232,236,0.04)', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${HIM_COLOR}18`, border: `1px solid ${HIM_COLOR}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: HIM_COLOR }} />
          </div>
          <div>
            <p style={{ color: 'rgba(240,232,236,0.7)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 3px', fontWeight: 500 }}>HerSide · Sofia today</p>
            <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
              Ovulation · Day 14 · High energy. Great day for real conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearnRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <p style={{ color: color, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: '0 0 4px', opacity: 0.7 }}>
        {label}
      </p>
      <p style={{ color: 'rgba(240,232,236,0.5)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  );
}
