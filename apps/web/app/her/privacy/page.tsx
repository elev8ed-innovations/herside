import { ConnectionCard, type ConnectionCardData } from '../../components/her/privacy/ConnectionCard';
import { InviteGenerator } from '../../components/her/InviteGenerator';

// Permission key → human-readable label
const PERMISSION_LABELS: Record<string, string> = {
  phase_name:        'Current cycle phase',
  energy_mood:       'Energy level and mood',
  support_cues:      'How to support you today',
  forecast:          '30-day phase forecast',
  training_recs:     'Training intensity recommendations',
  sleep_hrv:         'Sleep quality and HRV data',
  gritscore_context: 'GritScore and readiness context',
  symptom_data:      'Symptom data',
};

// Which keys are always locked (never shared) by connection type
const ALWAYS_PRIVATE: Record<string, string[]> = {
  partner:  ['cycle_dates', 'symptoms', 'health_data'],
  trainer:  ['cycle_dates', 'emotional_data', 'symptoms'],
  ironmind: [],
  friend:   [],
};

const ALWAYS_PRIVATE_LABELS: Record<string, string> = {
  cycle_dates:    'Exact cycle dates',
  symptoms:       'Symptom details',
  health_data:    'Lab results and health data',
  emotional_data: 'Emotional and mood data',
};

// Mock connections — replaced with real DB data once auth is wired
const MOCK_HER_USER_ID = 'demo-user-id';

const MOCK_CONNECTIONS: ConnectionCardData[] = [
  {
    id: 'conn-marcus',
    name: 'Marcus',
    connectionType: 'partner',
    initials: 'M',
    permissions: [
      { key: 'phase_name',  label: 'Current cycle phase',        enabled: true,  locked: false },
      { key: 'energy_mood', label: 'Energy level and mood',      enabled: true,  locked: false },
      { key: 'support_cues',label: 'How to support you today',   enabled: true,  locked: false },
      { key: 'forecast',    label: '30-day phase forecast',      enabled: true,  locked: false },
      { key: 'cycle_dates', label: 'Exact cycle dates',          enabled: false, locked: true  },
      { key: 'symptoms',    label: 'Symptom details',            enabled: false, locked: true  },
      { key: 'health_data', label: 'Lab results and health data',enabled: false, locked: true  },
    ],
  },
  {
    id: 'conn-coach-james',
    name: 'Coach James',
    connectionType: 'trainer',
    initials: 'CJ',
    permissions: [
      { key: 'phase_name',    label: 'Current cycle phase',                   enabled: true,  locked: false },
      { key: 'training_recs', label: 'Training intensity recommendations',     enabled: true,  locked: false },
      { key: 'sleep_hrv',     label: 'Sleep quality and HRV data',            enabled: false, locked: false },
      { key: 'cycle_dates',   label: 'Exact cycle dates',                     enabled: false, locked: true  },
      { key: 'emotional_data',label: 'Emotional and mood data',               enabled: false, locked: true  },
      { key: 'symptoms',      label: 'Symptom details',                       enabled: false, locked: true  },
    ],
  },
  {
    id: 'conn-ironmind',
    name: 'IronMind',
    connectionType: 'ironmind',
    initials: 'IM',
    permissions: [
      { key: 'phase_name',        label: 'Current cycle phase',         enabled: true,  locked: false },
      { key: 'gritscore_context', label: 'GritScore and readiness context', enabled: true,  locked: false },
      { key: 'symptom_data',      label: 'Symptom data',                enabled: false, locked: false },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      {/* Header */}
      <div style={{ paddingTop: 24, paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#C96B84' }} />
          <span style={{ color: '#F0E8EC', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Your Circle
          </span>
        </div>
        <p style={{
          color: 'rgba(240,232,236,0.35)',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          margin: '0 0 0 11px',
          lineHeight: 1.5,
        }}>
          Control exactly what each person sees. Changes take effect immediately.
        </p>
      </div>

      {/* Privacy guarantee strip */}
      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: 'rgba(91,170,120,0.08)',
        border: '1px solid rgba(91,170,120,0.2)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5BAA78', flexShrink: 0 }} />
        <p style={{
          color: 'rgba(240,232,236,0.45)',
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Her data is never sold, never used for ads, never shared with third parties.
          You can revoke access anytime, instantly.
        </p>
      </div>

      {/* Active connections */}
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_CONNECTIONS.length === 0 ? (
          <EmptyCircle />
        ) : (
          MOCK_CONNECTIONS.map(conn => (
            <ConnectionCard key={conn.id} connection={conn} />
          ))
        )}
      </div>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '24px 0 20px',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(240,232,236,0.06)' }} />
        <span style={{
          color: 'rgba(240,232,236,0.2)',
          fontSize: 10,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Add someone
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(240,232,236,0.06)' }} />
      </div>

      {/* Invite generator */}
      <InviteGenerator herUserId={MOCK_HER_USER_ID} phaseColor="#C96B84" />

      {/* Privacy note */}
      <p style={{
        color: 'rgba(240,232,236,0.15)',
        fontSize: 11,
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
        margin: '20px 0 0',
        lineHeight: 1.6,
      }}>
        Revoking access is instant and silent.
        The person is not notified.
      </p>
    </div>
  );
}

function EmptyCircle() {
  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '32px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(240,232,236,0.15)' }} />
      <p style={{
        color: 'rgba(240,232,236,0.35)',
        fontSize: 14,
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        margin: 0,
      }}>
        Your circle is empty
      </p>
      <p style={{
        color: 'rgba(240,232,236,0.2)',
        fontSize: 12,
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
        margin: 0,
      }}>
        Invite someone below to start sharing.
      </p>
    </div>
  );
}
