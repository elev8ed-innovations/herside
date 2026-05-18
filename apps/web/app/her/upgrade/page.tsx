'use client';

import { useState } from 'react';
import { PLANS } from '@herside/shared';

const HER = '#C96B84';

type Cadence = 'monthly' | 'annual';

const HER_PLANS = [PLANS.free, PLANS.her_pro, PLANS.peri_pro, PLANS.together] as const;

function PlanCard({
  plan,
  cadence,
  highlighted,
}: {
  plan: typeof HER_PLANS[number];
  cadence: Cadence;
  highlighted: boolean;
}) {
  const price = cadence === 'annual' ? plan.price_annual : plan.price_monthly;
  const isFree = plan.price_monthly === 0;
  const color = highlighted ? HER : 'rgba(240,232,236,0.08)';
  const borderColor = highlighted ? HER : 'rgba(240,232,236,0.1)';

  return (
    <div style={{
      background: highlighted ? `${HER}08` : 'var(--s2)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 20, padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {highlighted && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          padding: '5px 14px', background: HER,
          borderRadius: '0 18px 0 12px',
          color: '#fff', fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '0.5px',
        }}>
          Most popular
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <p style={{ color: highlighted ? HER : 'rgba(240,232,236,0.5)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
          {plan.label}
        </p>
        {plan.description && (
          <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '0 0 6px' }}>{plan.description}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ color: '#F0E8EC', fontSize: 28, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
            {isFree ? 'Free' : `$${price}`}
          </span>
          {!isFree && (
            <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
              /{cadence === 'annual' ? 'yr' : 'mo'}
            </span>
          )}
        </div>
        {!isFree && cadence === 'annual' && plan.annual_label && (
          <p style={{ color: HER, fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '2px 0 0' }}>{plan.annual_label}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M1 5L4 8.5L11 1" stroke={highlighted ? HER : 'rgba(240,232,236,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: 'rgba(240,232,236,0.6)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{
        width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
        background: highlighted ? HER : 'transparent',
        border: highlighted ? 'none' : '1px solid rgba(240,232,236,0.12)',
        color: highlighted ? '#fff' : 'rgba(240,232,236,0.4)',
        fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: highlighted ? 600 : 400,
      }}>
        {isFree ? 'Current plan' : `Get ${plan.label}`}
      </button>
    </div>
  );
}

export default function HerUpgradePage() {
  const [cadence, setCadence] = useState<Cadence>('monthly');

  return (
    <div style={{ padding: '24px 20px 0', minHeight: '100dvh' }}>
      {/* Back */}
      <a href="/her" style={{ color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', display: 'block', marginBottom: 24 }}>← Back</a>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: HER }} />
          <span style={{ color: HER, fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>HerSide</span>
        </div>
        <p style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 26, fontStyle: 'italic', margin: '0 0 8px' }}>
          Know your body. Own your season.
        </p>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Upgrade anytime. Cancel anytime.
        </p>
      </div>

      {/* Cadence toggle */}
      <div style={{ display: 'flex', background: 'rgba(240,232,236,0.05)', borderRadius: 12, padding: 4, marginBottom: 20, maxWidth: 240, margin: '0 auto 20px' }}>
        {(['monthly', 'annual'] as Cadence[]).map(c => (
          <button key={c} onClick={() => setCadence(c)} style={{
            flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: cadence === c ? HER : 'transparent',
            color: cadence === c ? '#fff' : 'rgba(240,232,236,0.35)',
            fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: cadence === c ? 600 : 400,
            transition: 'all 200ms ease',
          }}>
            {c === 'monthly' ? 'Monthly' : 'Annual'}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {HER_PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cadence={cadence}
            highlighted={plan.id === 'her_pro'}
          />
        ))}
      </div>

      {/* Trust strip */}
      <div style={{ margin: '20px 0', padding: '14px 16px', background: 'rgba(106,168,130,0.06)', border: '1px solid rgba(106,168,130,0.15)', borderRadius: 14 }}>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
          Your data is never sold, never used for ads, never shared with third parties. You can delete everything, anytime.
        </p>
      </div>
    </div>
  );
}
