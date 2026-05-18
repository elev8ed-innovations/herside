const TRAIN = '#6AA882';

const PHASE_SCIENCE = [
  {
    phase: 'Follicular',
    color: '#6AA882',
    window: 'Days 1–13',
    headline: 'Rising estrogen drives strength gains',
    evidence: [
      'Estrogen upregulates satellite cells, accelerating muscle protein synthesis',
      'Pain tolerance peaks — ideal window for skill acquisition and loading',
      'Motor learning enhanced: best phase to introduce complex movement patterns',
      'Aerobic capacity increases alongside estrogen rise',
    ],
    protocol: 'Progressive overload at 75–85% 1RM, 3–4 × 5–8 reps. Introduce one new skill per session.',
    source: 'Wikström-Frisén et al. (2017), Reis et al. (2021)',
  },
  {
    phase: 'Ovulation',
    color: '#C8943A',
    window: 'Days 14–16',
    headline: 'Peak strength window — with one critical caveat',
    evidence: [
      'Estrogen peaks alongside LH surge — neuromuscular output is highest',
      'PRs are statistically most likely in this 48–72 hour window',
      'ACL and ligament laxity elevates significantly — injury risk rises',
      'Joint awareness drills are non-negotiable during this phase',
    ],
    protocol: 'Max effort + explosive work at 90%+. Always include ACL awareness drills and proper warm-up.',
    source: 'Herzberg et al. (2017), Slauterbeck et al. (2002)',
  },
  {
    phase: 'Luteal',
    color: '#8B68C0',
    window: 'Days 17–28',
    headline: 'Progesterone creates real neurological fatigue',
    evidence: [
      'Progesterone competes with GABA receptors — neurological fatigue is physiological, not motivational',
      'Core temperature rises 0.3–0.5°C — extended warm-up is medically indicated',
      'Neuromuscular power and reaction time both measurably reduced',
      'Perceived effort (RPE) runs high relative to actual output',
    ],
    protocol: 'Cap RPE at 7/10. Technique focus over max load. 10–15 min warm-up minimum. No PRs.',
    source: 'Janse de Jonge (2003), McNulty et al. (2020)',
  },
  {
    phase: 'Menstrual',
    color: '#C96B84',
    window: 'Days 1–5',
    headline: 'Active recovery is legitimate training',
    evidence: [
      'Prostaglandins drive inflammation and pain — heavy loading counterproductive',
      'Gentle movement reduces dysmenorrhea symptoms more effectively than rest',
      'Yoga, swimming, and walking shown to reduce cramp severity by up to 50%',
      'Cortisol sensitivity is elevated — high-intensity training can extend recovery debt',
    ],
    protocol: 'Gentle movement only: yoga, walk, swim, or stretching. No HIIT, no heavy compounds.',
    source: 'Matthewman et al. (2018), Daley (2008)',
  },
];

const IRONMIND_SCIENCE = [
  {
    title: 'What GritScore measures',
    body: 'IronMind\'s GritScore is a composite of HRV, sleep quality, subjective energy, and readiness. A score below the client\'s 7-day baseline by 8+ points indicates the nervous system is under load — regardless of what the client reports they feel capable of.',
  },
  {
    title: 'Why the cycle multiplies GritScore',
    body: 'Progesterone in the luteal phase independently suppresses GritScore by an average of 11 points. A client with a baseline of 68 at a luteal score of 55 is physiologically equivalent to a follicular score of 44 — a rest-day signal.',
  },
  {
    title: 'The 8-point rule',
    body: 'Research on subjective wellness tools shows that within-person variance of 8+ points predicts meaningful performance degradation and elevated injury risk. This is why every protocol has an IronMind threshold.',
  },
];

export default function SciencePage() {
  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: TRAIN }} />
        <span style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic' }}>HerSide</span>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', marginLeft: 2 }}>Trainer</span>
      </div>
      <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 24px 17px' }}>
        Science Library
      </p>

      {/* Phase science cards */}
      <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Phase × Training Evidence</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {PHASE_SCIENCE.map(({ phase, color, window: win, headline, evidence, protocol, source }) => (
          <div key={phase} style={{
            background: 'var(--s2)', border: `1px solid ${color}25`,
            borderRadius: 20, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 18px', background: `${color}08`, borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
                  <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>{phase} Phase</span>
                </div>
                <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>{win}</span>
              </div>
              <p style={{ color: color, fontSize: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: '0 0 0 11px', lineHeight: 1.4 }}>{headline}</p>
            </div>

            <div style={{ padding: '14px 18px' }}>
              {evidence.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5, opacity: 0.7 }} />
                  <span style={{ color: 'rgba(240,232,236,0.6)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{e}</span>
                </div>
              ))}

              <div style={{ marginTop: 12, padding: '10px 12px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 10 }}>
                <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>Protocol</p>
                <p style={{ color: 'rgba(240,232,236,0.65)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>{protocol}</p>
              </div>

              <p style={{ color: 'rgba(240,232,236,0.2)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', margin: '10px 0 0', fontStyle: 'italic' }}>{source}</p>
            </div>
          </div>
        ))}
      </div>

      {/* IronMind × Cycle section */}
      <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>IronMind × Cycle</p>

      <div style={{ background: 'var(--s2)', border: '1px solid rgba(200,148,58,0.25)', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 18px', background: 'rgba(200,148,58,0.06)', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: '#C8943A' }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Interpreting GritScore</span>
          </div>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {IRONMIND_SCIENCE.map(({ title, body }) => (
            <div key={title}>
              <p style={{ color: 'rgba(240,232,236,0.6)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: '0 0 5px' }}>{title}</p>
              <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GritScore threshold table */}
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: TRAIN }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Phase Thresholds</span>
          </div>
        </div>
        <div style={{ padding: '8px 0' }}>
          {[
            { phase: 'Ovulation', color: '#C8943A', threshold: '< 65', action: 'Reduce explosive work, pivot to skill refinement' },
            { phase: 'Follicular', color: '#6AA882', threshold: '< 60', action: 'Drop to 70% 1RM, add extra mobility' },
            { phase: 'Luteal', color: '#8B68C0', threshold: '< 55', action: 'Drop to 60% 1RM, consider mobility session' },
            { phase: 'Menstrual', color: '#C96B84', threshold: '< 40', action: 'Rest day recommended — do not push through' },
          ].map(({ phase, color, threshold, action }, i, arr) => (
            <div key={phase} style={{
              padding: '12px 18px', display: 'flex', alignItems: 'flex-start', gap: 12,
              borderBottom: i < arr.length - 1 ? '1px solid rgba(240,232,236,0.04)' : 'none',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ color: 'rgba(240,232,236,0.6)', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>{phase}</span>
                  <span style={{ padding: '1px 7px', borderRadius: 50, fontSize: 10, background: 'rgba(200,148,58,0.12)', border: '1px solid rgba(200,148,58,0.25)', color: '#D09040', fontFamily: 'DM Sans, sans-serif' }}>GS {threshold}</span>
                </div>
                <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>{action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
