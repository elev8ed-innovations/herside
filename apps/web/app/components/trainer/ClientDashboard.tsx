'use client';

import { useState } from 'react';
import { MOCK_CLIENTS, SESSION_PLANS, type MockClient } from './mockClients';

const TRAIN = '#6AA882';

export function ClientDashboard() {
  const [selected, setSelected] = useState<string>(MOCK_CLIENTS[0].id);
  const client = MOCK_CLIENTS.find(c => c.id === selected)!;
  const plan = SESSION_PLANS[client.phase];
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleBullet = (key: string) =>
    setChecked(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const gritLow = client.gritScore !== null && client.gritScore < client.gritBaseline - 8;

  return (
    <>
      {/* Client list */}
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: TRAIN }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Client Roster</span>
          </div>
          <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>
            {MOCK_CLIENTS.length} clients today
          </span>
        </div>

        <div style={{ padding: '8px 0' }}>
          {MOCK_CLIENTS.map((c, i) => {
            const isSelected = selected === c.id;
            const gritDiff = c.gritScore !== null ? c.gritScore - c.gritBaseline : null;
            return (
              <button key={c.id} onClick={() => { setSelected(c.id); setChecked(new Set()); }} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', width: '100%',
                background: isSelected ? `${c.phaseColor}08` : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderBottom: i < MOCK_CLIENTS.length - 1 ? '1px solid rgba(240,232,236,0.04)' : 'none',
                transition: 'background 150ms ease',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: `${c.phaseColor}20`, border: isSelected ? `1.5px solid ${c.phaseColor}` : `1px solid ${c.phaseColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: c.phaseColor, fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{c.initials}</span>
                </div>

                {/* Name + phase */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#F0E8EC', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: isSelected ? 500 : 400, margin: '0 0 3px' }}>{c.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.phaseColor, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>
                      {c.phaseName} · Day {c.cycleDay}
                    </span>
                  </div>
                </div>

                {/* Intensity pill + GritScore */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 50, fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                    background: `${c.intensityColor}15`, border: `1px solid ${c.intensityColor}35`, color: c.intensityColor,
                  }}>
                    {c.intensityLabel}
                  </span>
                  {c.gritScore !== null && (
                    <span style={{ color: gritDiff !== null && gritDiff < -8 ? '#D09040' : 'rgba(240,232,236,0.3)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
                      GS {c.gritScore}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session plan */}
      <div style={{ marginTop: 12, background: 'var(--s2)', border: `1px solid ${client.phaseColor}30`, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(240,232,236,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${client.phaseColor}06` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, borderRadius: 2, background: client.phaseColor }} />
              <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>{plan.protocolName}</span>
            </div>
            <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '4px 0 0 11px' }}>
              {client.name} · {client.phaseName} Day {client.cycleDay}
            </p>
          </div>
          <span style={{
            padding: '4px 12px', borderRadius: 50, fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            background: `${client.intensityColor}15`, border: `1px solid ${client.intensityColor}35`, color: client.intensityColor,
          }}>
            {client.intensityLabel}
          </span>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {plan.bullets.map((bullet, i) => {
            const key = `${client.id}-${i}`;
            const isDone = checked.has(key);
            return (
              <button key={key} onClick={() => toggleBullet(key)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: isDone ? `1.5px solid ${client.phaseColor}` : '1.5px solid rgba(240,232,236,0.15)',
                  background: isDone ? `${client.phaseColor}20` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}>
                  {isDone && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke={client.phaseColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  color: isDone ? 'rgba(240,232,236,0.3)' : 'rgba(240,232,236,0.7)',
                  fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5,
                  textDecoration: isDone ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(240,232,236,0.2)', transition: 'color 200ms ease',
                }}>
                  {bullet}
                </span>
              </button>
            );
          })}
        </div>

        {/* IronMind context note */}
        {(gritLow || client.gritScore === null) && (
          <div style={{
            margin: '0 20px 16px', padding: '10px 14px',
            background: 'rgba(200,148,58,0.08)', border: '1px solid rgba(200,148,58,0.25)', borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8943A' }} />
              <span style={{ color: '#C8943A', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
                IronMind note
              </span>
            </div>
            <p style={{ color: 'rgba(240,232,236,0.5)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
              {plan.ironmindNote}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
