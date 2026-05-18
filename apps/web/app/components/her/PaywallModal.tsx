'use client';

import { useState } from 'react';
import { PLANS } from '@herside/shared';

const HER = '#C96B84';

interface PaywallModalProps {
  feature: string;
  onClose: () => void;
}

export function PaywallModal({ feature, onClose }: PaywallModalProps) {
  const plan = PLANS.her_pro;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(8,5,9,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 env(safe-area-inset-bottom)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#181320', border: '1px solid rgba(201,107,132,0.2)',
        borderRadius: '24px 24px 0 0', padding: '28px 24px 32px',
      }} onClick={e => e.stopPropagation()}>
        {/* Pull handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(240,232,236,0.1)', margin: '0 auto 24px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: HER }} />
          <span style={{ color: HER, fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Her Pro</span>
        </div>
        <p style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 22, fontStyle: 'italic', margin: '0 0 6px' }}>
          {feature} is a Pro feature
        </p>
        <p style={{ color: 'rgba(240,232,236,0.45)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 24px', lineHeight: 1.5 }}>
          Unlock everything HerSide knows about your body.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {plan.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M1 6L5 10L13 1" stroke={HER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: 'rgba(240,232,236,0.6)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 14,
            background: `${HER}10`, border: `1.5px solid ${HER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{ color: '#F0E8EC', fontSize: 20, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>${plan.price_monthly}</span>
            <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>/month</span>
          </div>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 14,
            background: 'rgba(240,232,236,0.03)', border: '1px solid rgba(240,232,236,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{ color: '#F0E8EC', fontSize: 20, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>${plan.price_annual}</span>
            <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>/{plan.annual_label}</span>
          </div>
        </div>

        {/* CTA */}
        <a href="/her/upgrade" style={{
          display: 'block', width: '100%', padding: '15px',
          background: HER, borderRadius: 14, textAlign: 'center',
          color: '#fff', fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
          textDecoration: 'none', marginBottom: 12,
        }}>
          Start Her Pro
        </a>
        <button onClick={onClose} style={{
          display: 'block', width: '100%', padding: '12px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
        }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
