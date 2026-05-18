import Link from 'next/link';
import { MOCK_CLIENTS } from '../../components/trainer/mockClients';

const TRAIN = '#6AA882';

export default function ClientsPage() {
  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: TRAIN }} />
        <span style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic' }}>HerSide</span>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', marginLeft: 2 }}>Trainer</span>
      </div>
      <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 24px 17px' }}>
        Client Roster
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_CLIENTS.map(c => (
          <Link key={c.id} href={`/trainer/clients/${c.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--s2)', border: `1px solid ${c.phaseColor}25`,
              borderRadius: 16, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color 150ms ease',
            }}>
              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: `${c.phaseColor}20`, border: `1.5px solid ${c.phaseColor}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: c.phaseColor, fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{c.initials}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#F0E8EC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: '0 0 5px' }}>{c.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.phaseColor, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>
                    {c.phaseName} · Day {c.cycleDay} of {c.cycleLength}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 50, fontSize: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                  background: `${c.intensityColor}15`, border: `1px solid ${c.intensityColor}35`, color: c.intensityColor,
                }}>
                  {c.intensityLabel}
                </span>
                {c.gritScore !== null && (
                  <span style={{
                    color: c.gritScore < c.gritBaseline - 8 ? '#D09040' : 'rgba(240,232,236,0.3)',
                    fontSize: 10, fontFamily: 'DM Sans, sans-serif',
                  }}>
                    GS {c.gritScore}
                  </span>
                )}
              </div>

              {/* Chevron */}
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0, marginLeft: 4 }}>
                <path d="M1 1L5 5L1 9" stroke="rgba(240,232,236,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 24, background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 16, padding: '14px 18px' }}>
        <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>Intensity guide</p>
        {[
          { label: 'Push Hard', color: '#C8943A', desc: 'Peak window — max effort, PRs on the table' },
          { label: 'Moderate', color: '#6AA882', desc: 'Strength build — progressive overload focus' },
          { label: 'Gentle Only', color: '#8B68C0', desc: 'Recovery — technique, mobility, breathwork' },
        ].map(({ label, color, desc }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{
              padding: '2px 8px', borderRadius: 50, fontSize: 10, fontFamily: 'DM Sans, sans-serif',
              background: `${color}15`, border: `1px solid ${color}35`, color, flexShrink: 0,
            }}>{label}</span>
            <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
