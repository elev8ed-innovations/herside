'use client';

import { useState } from 'react';
import { PLANS } from '@herside/shared';

const TRAIN = '#6AA882';

type Cadence = 'monthly' | 'annual';

const TRAINER_PLANS = [PLANS.trainer_pro, PLANS.gym_license, PLANS.corporate] as const;

export default function TrainerUpgradePage() {
  const [cadence, setCadence] = useState<Cadence>('monthly');

  return (
    <div style={{ padding: '24px 20px 0', minHeight: '100dvh' }}>
      {/* Back */}
      <a href="/trainer" style={{ color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', display: 'block', marginBottom: 24 }}>← Back</a>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: TRAIN }} />
          <span style={{ color: TRAIN, fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>HerSide Trainer</span>
        </div>
        <p style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 24, fontStyle: 'italic', margin: '0 0 8px' }}>
          Train smarter. With the cycle, not against it.
        </p>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Per trainer seat. Cancel anytime.
        </p>
      </div>

      {/* Cadence toggle */}
      <div style={{ display: 'flex', background: 'rgba(240,232,236,0.05)', borderRadius: 12, padding: 4, marginBottom: 20, maxWidth: 240, margin: '0 auto 20px' }}>
        {(['monthly', 'annual'] as Cadence[]).map(c => (
          <button key={c} onClick={() => setCadence(c)} style={{
            flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: cadence === c ? TRAIN : 'transparent',
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
        {TRAINER_PLANS.map((plan, i) => {
          const isCorporate = plan.id === 'corporate';
          const highlighted = plan.id === 'trainer_pro';
          const price = cadence === 'annual' ? plan.price_annual : plan.price_monthly;

          return (
            <div key={plan.id} style={{
              background: highlighted ? `${TRAIN}08` : 'var(--s2)',
              border: `1.5px solid ${highlighted ? TRAIN : 'rgba(240,232,236,0.1)'}`,
              borderRadius: 20, padding: '20px', position: 'relative',
            }}>
              {highlighted && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  padding: '5px 14px', background: TRAIN,
                  borderRadius: '0 18px 0 12px',
                  color: '#fff', fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                }}>
                  Most popular
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <p style={{ color: highlighted ? TRAIN : 'rgba(240,232,236,0.5)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  {plan.label}
                </p>
                {plan.description && (
                  <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '0 0 6px' }}>{plan.description}</p>
                )}
                {isCorporate ? (
                  <p style={{ color: '#F0E8EC', fontSize: 22, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, margin: 0 }}>Custom</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: '#F0E8EC', fontSize: 28, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>${price}</span>
                    <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
                      /{cadence === 'annual' ? 'yr' : 'mo'}
                    </span>
                  </div>
                )}
                {!isCorporate && cadence === 'annual' && plan.annual_label && (
                  <p style={{ color: TRAIN, fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '2px 0 0' }}>{plan.annual_label}</p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                {plan.features.map((f, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M1 5L4 8.5L11 1" stroke={highlighted ? TRAIN : 'rgba(240,232,236,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: 'rgba(240,232,236,0.6)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button style={{
                width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
                background: highlighted ? TRAIN : 'transparent',
                border: highlighted ? 'none' : '1px solid rgba(240,232,236,0.12)',
                color: highlighted ? '#fff' : 'rgba(240,232,236,0.4)',
                fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: highlighted ? 600 : 400,
              }}>
                {isCorporate ? 'Contact us' : `Get ${plan.label}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* What trainers say */}
      <div style={{ margin: '20px 0 0', background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '18px' }}>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px' }}>Why trainers use HerSide</p>
        {[
          { stat: '3×', label: 'fewer cancelled sessions when programming is phase-aligned' },
          { stat: '28%', label: 'of women train with coaches who don\'t know their cycle phase' },
          { stat: '40%', label: 'reduction in overtraining symptoms with phase-aware protocols' },
        ].map(({ stat, label }) => (
          <div key={stat} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <span style={{ color: TRAIN, fontSize: 22, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, flexShrink: 0, lineHeight: 1 }}>{stat}</span>
            <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
