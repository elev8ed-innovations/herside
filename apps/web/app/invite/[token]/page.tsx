import { notFound } from 'next/navigation';
import { getInviteByToken, type ConnectionType } from '../../actions/invite';
import { AcceptInvite } from './AcceptInvite';

export function generateStaticParams() { return []; }
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ token: string }>;
}

// Human-readable labels for each permission key
const PERMISSION_LABELS: Record<string, string> = {
  phase_name:        'Your current cycle phase',
  energy_mood:       'Energy level and mood',
  support_cues:      'How to support you today',
  forecast:          '30-day phase forecast',
  training_recs:     'Training intensity recommendations',
  sleep_hrv:         'Sleep quality and HRV data',
  gritscore_context: 'GritScore and readiness context',
  symptom_data:      'Symptom data (optional)',
};

const ALWAYS_PRIVATE_LABELS: Record<ConnectionType, string[]> = {
  partner:  ['Exact cycle dates', 'Symptom details', 'Lab results'],
  trainer:  ['Exact cycle dates', 'Emotional or mood data', 'Symptom details'],
  ironmind: ['Cycle dates', 'Mood and emotional data', 'Lab results'],
  friend:   ['Cycle dates', 'Symptom details', 'Health data'],
};

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  partner:  '#5085B0',
  trainer:  '#6AA882',
  ironmind: '#C8943A',
  friend:   '#8B68C0',
};

const CONNECTION_DESCRIPTIONS: Record<ConnectionType, string> = {
  partner:  'invited you to connect as her partner',
  trainer:  'added you as her trainer',
  ironmind: 'connected her IronMind account',
  friend:   'invited you to connect',
};

export default async function AcceptInvitePage({ params }: PageProps) {
  const { token } = await params;

  const invite = await getInviteByToken(token).catch(() => null);

  // Show a graceful expired/invalid screen instead of a hard 404
  if (!invite || invite.status === 'revoked') {
    return <InvalidInvite reason={!invite ? 'not_found' : 'revoked'} />;
  }

  const expired = new Date(invite.invite_expires_at) < new Date();
  if (expired) {
    return <InvalidInvite reason="expired" />;
  }

  const type = invite.connection_type;
  const phaseColor = CONNECTION_COLORS[type] ?? '#C96B84';
  const canSee = invite.permissions.filter(p => p.enabled).map(p => PERMISSION_LABELS[p.permission_key] ?? p.permission_key);
  const neverSee = ALWAYS_PRIVATE_LABELS[type] ?? [];

  const expiresIn = Math.ceil(
    (new Date(invite.invite_expires_at).getTime() - Date.now()) / (1000 * 60 * 60),
  );

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#080509',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: '#F0E8EC',
          }}>
            HerSide
          </span>
        </div>

        {/* Invite header */}
        <div style={{
          background: '#181320',
          border: '1px solid rgba(240,232,236,0.09)',
          borderTop: `3px solid ${phaseColor}`,
          borderRadius: 20,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: `${phaseColor}18`,
            border: `1px solid ${phaseColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: phaseColor }} />
          </div>
          <div>
            <p style={{
              color: '#F0E8EC',
              fontSize: 18,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              margin: '0 0 6px',
            }}>
              You've been invited
            </p>
            <p style={{
              color: 'rgba(240,232,236,0.4)',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              margin: 0,
            }}>
              Someone {CONNECTION_DESCRIPTIONS[type]}
            </p>
          </div>

          <div style={{
            padding: '6px 14px',
            borderRadius: 50,
            background: `${phaseColor}18`,
            border: `1px solid ${phaseColor}30`,
          }}>
            <span style={{
              color: phaseColor,
              fontSize: 11,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {type}
            </span>
          </div>
        </div>

        {/* What they share */}
        {canSee.length > 0 && (
          <PermissionBlock
            title="What she's sharing with you"
            items={canSee}
            itemColor="#5BAA78"
            checkIcon="+"
          />
        )}

        {/* What is NEVER shared */}
        <PermissionBlock
          title="What she will NEVER share"
          subtitle="These are locked. She controls all access."
          items={neverSee}
          itemColor="rgba(240,232,236,0.25)"
          checkIcon="—"
        />

        {/* Accept */}
        <AcceptInvite token={token} connectionType={type} phaseColor={phaseColor} />

        {/* Expiry */}
        <p style={{
          color: 'rgba(240,232,236,0.2)',
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          textAlign: 'center',
          margin: 0,
        }}>
          This invite expires in {expiresIn} {expiresIn === 1 ? 'hour' : 'hours'}
        </p>
      </div>
    </div>
  );
}

function PermissionBlock({
  title,
  subtitle,
  items,
  itemColor,
  checkIcon,
}: {
  title: string;
  subtitle?: string;
  items: string[];
  itemColor: string;
  checkIcon: string;
}) {
  return (
    <div style={{
      background: '#181320',
      border: '1px solid rgba(240,232,236,0.09)',
      borderRadius: 20,
      padding: '16px 20px',
    }}>
      <p style={{
        color: 'rgba(240,232,236,0.45)',
        fontSize: 10,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif',
        margin: '0 0 12px',
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{
          color: 'rgba(240,232,236,0.25)',
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          margin: '-8px 0 12px',
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              color: itemColor,
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              flexShrink: 0,
              width: 14,
              textAlign: 'center',
            }}>
              {checkIcon}
            </span>
            <span style={{
              color: itemColor === 'rgba(240,232,236,0.25)'
                ? 'rgba(240,232,236,0.3)'
                : 'rgba(240,232,236,0.7)',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.4,
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvalidInvite({ reason }: { reason: 'not_found' | 'expired' | 'revoked' }) {
  const messages = {
    not_found: ['Invite not found', 'This link doesn\'t exist or has already been used.'],
    expired:   ['Invite expired',   'This invite link is older than 48 hours. Ask her to send a new one.'],
    revoked:   ['Access removed',   'This invite is no longer active.'],
  };
  const [title, body] = messages[reason];

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#080509',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: 12,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(240,232,236,0.2)' }} />
      <p style={{ color: '#F0E8EC', fontSize: 18, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
        {title}
      </p>
      <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textAlign: 'center', maxWidth: 280, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}
