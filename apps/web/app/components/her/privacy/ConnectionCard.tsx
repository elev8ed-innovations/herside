'use client';

import { useState, useTransition } from 'react';
import { updatePermission } from '../../../actions/privacy';
import { revokeConnection } from '../../../actions/invite';

export type ConnectionType = 'partner' | 'trainer' | 'ironmind' | 'friend';

export interface Permission {
  key: string;
  label: string;
  enabled: boolean;
  locked: boolean; // always-private — shown but not toggleable
}

export interface ConnectionCardData {
  id: string;
  name: string;
  connectionType: ConnectionType;
  initials: string;
  permissions: Permission[];
}

const TYPE_COLOR: Record<ConnectionType, string> = {
  partner:  '#5085B0',
  trainer:  '#6AA882',
  ironmind: '#C8943A',
  friend:   '#8B68C0',
};

const TYPE_LABEL: Record<ConnectionType, string> = {
  partner:  'Partner',
  trainer:  'Trainer',
  ironmind: 'IronMind',
  friend:   'Friend',
};

export function ConnectionCard({ connection }: { connection: ConnectionCardData }) {
  const color = TYPE_COLOR[connection.connectionType];
  const [permissions, setPermissions] = useState(connection.permissions);
  const [revokeStage, setRevokeStage] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [, startTransition] = useTransition();

  const handleToggle = (key: string, newVal: boolean) => {
    // Optimistic update
    setPermissions(prev =>
      prev.map(p => p.key === key ? { ...p, enabled: newVal } : p),
    );
    startTransition(async () => {
      try {
        await updatePermission(connection.id, key, newVal);
      } catch {
        // Revert on error
        setPermissions(prev =>
          prev.map(p => p.key === key ? { ...p, enabled: !newVal } : p),
        );
      }
    });
  };

  const handleRevoke = async () => {
    if (revokeStage === 'idle') { setRevokeStage('confirm'); return; }
    startTransition(async () => {
      await revokeConnection(connection.id);
      setRevokeStage('done');
    });
  };

  if (revokeStage === 'done') {
    return (
      <div style={{
        background: 'var(--s2)',
        border: '1px solid var(--dim)',
        borderRadius: 20,
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: 0.5,
      }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: 'rgba(240,232,236,0.15)' }} />
        <span style={{ color: 'rgba(240,232,236,0.3)', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
          {connection.name} removed
        </span>
      </div>
    );
  }

  const toggleable = permissions.filter(p => !p.locked);
  const locked = permissions.filter(p => p.locked);

  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(240,232,236,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: `${color}18`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color, fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {connection.initials}
            </span>
          </div>
          <div>
            <p style={{ color: '#F0E8EC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, margin: '0 0 2px' }}>
              {connection.name}
            </p>
            <span style={{
              color: color,
              fontSize: 10,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {TYPE_LABEL[connection.connectionType]}
            </span>
          </div>
        </div>

        {/* Revoke */}
        {revokeStage === 'idle' ? (
          <button
            onClick={handleRevoke}
            style={{
              padding: '5px 12px',
              borderRadius: 50,
              border: '1px solid rgba(208,85,85,0.25)',
              background: 'rgba(208,85,85,0.08)',
              color: '#D05555',
              fontSize: 11,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            Revoke
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setRevokeStage('idle')}
              style={{
                padding: '5px 12px',
                borderRadius: 50,
                border: '1px solid rgba(240,232,236,0.09)',
                background: 'transparent',
                color: 'rgba(240,232,236,0.4)',
                fontSize: 11,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleRevoke}
              style={{
                padding: '5px 12px',
                borderRadius: 50,
                border: 'none',
                background: '#D05555',
                color: '#fff',
                fontSize: 11,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>

      {/* Toggleable permissions */}
      <div style={{ padding: '12px 20px' }}>
        {toggleable.map((perm, i) => (
          <div key={perm.key}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              <span style={{
                color: perm.enabled ? 'rgba(240,232,236,0.75)' : 'rgba(240,232,236,0.35)',
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 200ms ease',
              }}>
                {perm.label}
              </span>
              <Toggle enabled={perm.enabled} color={color} onChange={v => handleToggle(perm.key, v)} />
            </div>
            {i < toggleable.length - 1 && (
              <div style={{ height: 1, background: 'rgba(240,232,236,0.04)' }} />
            )}
          </div>
        ))}

        {/* Locked / always-private */}
        {locked.length > 0 && (
          <>
            <div style={{ height: 1, background: 'rgba(240,232,236,0.06)', margin: '4px 0' }} />
            <p style={{
              color: 'rgba(240,232,236,0.2)',
              fontSize: 9,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
              margin: '10px 0 4px',
            }}>
              Always private
            </p>
            {locked.map(perm => (
              <div key={perm.key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
              }}>
                <span style={{ color: 'rgba(240,232,236,0.2)', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                  {perm.label}
                </span>
                <span style={{
                  color: 'rgba(240,232,236,0.18)',
                  fontSize: 10,
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(240,232,236,0.1)',
                  borderRadius: 50,
                  padding: '2px 8px',
                }}>
                  Private
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({
  enabled,
  color,
  onChange,
}: {
  enabled: boolean;
  color: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      style={{
        width: 38,
        height: 22,
        borderRadius: 50,
        background: enabled ? color : 'rgba(240,232,236,0.1)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 200ms ease',
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3,
        left: enabled ? 19 : 3,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}
