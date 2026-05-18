import { notFound } from 'next/navigation';
import { MOCK_CLIENTS, SESSION_PLANS } from '../../../components/trainer/mockClients';
import { getPhaseForDay, getPhaseColor, phaseDescriptions } from '@herside/shared';
import type { Phase } from '@herside/shared';

const TRAIN = '#6AA882';

const PHASE_ORDER: Phase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

function GritBar({ score, baseline }: { score: number; baseline: number }) {
  const low = score < baseline - 8;
  const barColor = low ? '#D09040' : TRAIN;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>GritScore</span>
        <span style={{ color: low ? '#D09040' : '#F0E8EC', fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{score} / baseline {baseline}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(240,232,236,0.07)', borderRadius: 3, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${score}%`, background: barColor, borderRadius: 3, transition: 'width 600ms ease' }} />
        {/* Baseline marker */}
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${baseline}%`, width: 1.5, background: 'rgba(240,232,236,0.3)', borderRadius: 1 }} />
      </div>
      {low && (
        <p style={{ color: '#D09040', fontSize: 10, fontFamily: 'DM Sans, sans-serif', margin: '6px 0 0' }}>
          Below baseline — consider session modification
        </p>
      )}
    </div>
  );
}

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = MOCK_CLIENTS.find(c => c.id === id);
  if (!client) notFound();

  const plan = SESSION_PLANS[client.phase];
  const gritLow = client.gritScore !== null && client.gritScore < client.gritBaseline - 8;

  // Build 14-day forecast from today (cycleDay) forward
  const forecast = Array.from({ length: 14 }, (_, i) => {
    const day = ((client.cycleDay - 1 + i) % client.cycleLength) + 1;
    const phase = getPhaseForDay(day, client.cycleLength);
    const color = getPhaseColor(phase);
    return { day, phase, color, isToday: i === 0 };
  });

  // Phase history: show all 4 phases with approximate windows
  const phaseWindows = PHASE_ORDER.map(phase => {
    const desc = phaseDescriptions[phase];
    const color = getPhaseColor(phase);
    const isCurrent = phase === client.phase;
    return { phase, desc, color, isCurrent };
  });

  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Back + header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <a href="/trainer/clients" style={{ color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>← Clients</a>
      </div>

      {/* Client hero */}
      <div style={{
        background: `${client.phaseColor}06`, border: `1px solid ${client.phaseColor}30`,
        borderRadius: 20, padding: '20px', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `${client.phaseColor}20`, border: `2px solid ${client.phaseColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: client.phaseColor, fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{client.initials}</span>
          </div>
          <div>
            <p style={{ color: '#F0E8EC', fontSize: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: '0 0 4px' }}>{client.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: client.phaseColor }} />
              <span style={{ color: 'rgba(240,232,236,0.5)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>
                {client.phaseName} · Day {client.cycleDay} of {client.cycleLength}
              </span>
            </div>
          </div>
          <span style={{
            marginLeft: 'auto', padding: '4px 12px', borderRadius: 50, fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            background: `${client.intensityColor}15`, border: `1px solid ${client.intensityColor}35`, color: client.intensityColor, flexShrink: 0,
          }}>
            {client.intensityLabel}
          </span>
        </div>

        {/* GritScore bar */}
        {client.gritScore !== null && <GritBar score={client.gritScore} baseline={client.gritBaseline} />}
      </div>

      {/* Today's session plan */}
      <div style={{ background: 'var(--s2)', border: `1px solid ${client.phaseColor}25`, borderRadius: 20, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(240,232,236,0.05)', background: `${client.phaseColor}06` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: client.phaseColor }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>{plan.protocolName}</span>
          </div>
          <p style={{ color: 'rgba(240,232,236,0.3)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: '4px 0 0 11px' }}>Today's session design</p>
        </div>
        <div style={{ padding: '12px 18px' }}>
          {plan.bullets.map((bullet, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', borderBottom: i < plan.bullets.length - 1 ? '1px solid rgba(240,232,236,0.04)' : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: client.phaseColor, flexShrink: 0, marginTop: 5 }} />
              <span style={{ color: 'rgba(240,232,236,0.7)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{bullet}</span>
            </div>
          ))}
        </div>
        {gritLow && (
          <div style={{ margin: '0 18px 16px', padding: '10px 14px', background: 'rgba(200,148,58,0.08)', border: '1px solid rgba(200,148,58,0.25)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8943A' }} />
              <span style={{ color: '#C8943A', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>IronMind note</span>
            </div>
            <p style={{ color: 'rgba(240,232,236,0.5)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>{plan.ironmindNote}</p>
          </div>
        )}
      </div>

      {/* 14-day forecast */}
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: TRAIN }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>14-Day Forecast</span>
          </div>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16 }}>
          {forecast.map(({ day, phase, color, isToday }) => (
            <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `${color}${isToday ? '35' : '15'}`,
                border: isToday ? `2px solid ${color}` : `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: isToday ? color : `${color}90`, fontSize: 9, fontFamily: 'DM Sans, sans-serif', fontWeight: isToday ? 600 : 400 }}>{day}</span>
              </div>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, opacity: isToday ? 1 : 0.4 }} />
            </div>
          ))}
        </div>
        {/* Phase legend */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {phaseWindows.map(({ phase, desc, color, isCurrent }) => (
            <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: isCurrent ? 1 : 0.4 }} />
              <span style={{ color: isCurrent ? 'rgba(240,232,236,0.6)' : 'rgba(240,232,236,0.25)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}>
                {desc.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase history / all phases */}
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: TRAIN }} />
            <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Phase Windows</span>
          </div>
        </div>
        <div style={{ padding: '8px 0' }}>
          {phaseWindows.map(({ phase, desc, color, isCurrent }) => (
            <div key={phase} style={{
              padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
              background: isCurrent ? `${color}06` : 'transparent',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, opacity: isCurrent ? 1 : 0.4 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: isCurrent ? '#F0E8EC' : 'rgba(240,232,236,0.4)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: isCurrent ? 500 : 400, margin: '0 0 2px' }}>{desc.name}</p>
                <p style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                  {SESSION_PLANS[phase].protocolName}
                </p>
              </div>
              {isCurrent && (
                <span style={{ padding: '2px 8px', borderRadius: 50, fontSize: 9, fontFamily: 'DM Sans, sans-serif', background: `${color}20`, border: `1px solid ${color}40`, color, flexShrink: 0 }}>Now</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trainer notes */}
      <div style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: TRAIN }} />
          <span style={{ color: '#F0E8EC', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Trainer Notes</span>
        </div>
        <div style={{ background: 'rgba(240,232,236,0.03)', border: '1px solid rgba(240,232,236,0.07)', borderRadius: 10, padding: '10px 12px', minHeight: 60 }}>
          <p style={{ color: 'rgba(240,232,236,0.2)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', margin: 0, fontStyle: 'italic' }}>No notes yet</p>
        </div>
      </div>

      {/* Privacy reminder */}
      <div style={{ margin: '0 0 16px', padding: '10px 14px', background: 'rgba(106,168,130,0.06)', border: '1px solid rgba(106,168,130,0.2)', borderRadius: 12 }}>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
          You see phase, cycle day, and intensity only. Exact cycle dates, symptoms, and mood data are private to your client.
        </p>
      </div>
    </div>
  );
}
