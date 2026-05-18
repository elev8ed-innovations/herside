const TRAIN = '#6AA882';

const SECTIONS = [
  {
    title: 'Notifications',
    items: [
      { label: 'Client phase transitions', sub: 'Alert when a client enters a new phase' },
      { label: 'Low GritScore alerts', sub: 'Alert when a client drops 8+ points below baseline' },
      { label: 'Session reminders', sub: '30 minutes before scheduled sessions' },
    ],
  },
  {
    title: 'Display',
    items: [
      { label: 'Show GritScore on roster', sub: 'Visible in the Today client list' },
      { label: 'Show phase color coding', sub: 'Color-code clients by current phase' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Trainer profile', sub: 'Name and credentials' },
      { label: 'Connected clients', sub: '4 clients · Manage access' },
      { label: 'Export session notes', sub: 'Download as CSV' },
    ],
  },
];

export default function TrainerSettingsPage() {
  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: TRAIN }} />
        <span style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic' }}>HerSide</span>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', marginLeft: 2 }}>Trainer</span>
      </div>
      <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 24px 17px' }}>
        Settings
      </p>

      {/* Trainer identity card */}
      <div style={{
        background: 'var(--s2)', border: `1px solid ${TRAIN}25`,
        borderRadius: 20, padding: '18px', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: `${TRAIN}20`, border: `1.5px solid ${TRAIN}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: TRAIN, fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>CJ</span>
          </div>
          <div>
            <p style={{ color: '#F0E8EC', fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: '0 0 3px' }}>Coach James</p>
            <p style={{ color: 'rgba(240,232,236,0.35)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>4 connected clients · Trainer Pro</p>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SECTIONS.map(({ title, items }) => (
          <div key={title} style={{ background: 'var(--s2)', border: '1px solid var(--dim)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(240,232,236,0.05)' }}>
              <span style={{ color: 'rgba(240,232,236,0.35)', fontSize: 10, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</span>
            </div>
            {items.map(({ label, sub }, i) => (
              <div key={label} style={{
                padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: i < items.length - 1 ? '1px solid rgba(240,232,236,0.04)' : 'none',
              }}>
                <div>
                  <p style={{ color: 'rgba(240,232,236,0.7)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>{sub}</p>
                </div>
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M1 1L5 5L1 9" stroke="rgba(240,232,236,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Privacy note */}
      <div style={{ margin: '16px 0', padding: '12px 14px', background: 'rgba(106,168,130,0.06)', border: '1px solid rgba(106,168,130,0.2)', borderRadius: 12 }}>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
          You only see what your clients have shared with you. They can revoke your access at any time — instantly and silently.
        </p>
      </div>

      {/* Sign out */}
      <button style={{
        width: '100%', padding: '13px', borderRadius: 14, marginBottom: 16,
        background: 'transparent', border: '1px solid rgba(240,232,236,0.08)', cursor: 'pointer',
        color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
      }}>
        Sign out
      </button>
    </div>
  );
}
