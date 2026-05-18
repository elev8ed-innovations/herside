'use client';

import { useState } from 'react';

type ConnectionType = 'partner' | 'trainer' | 'ironmind' | 'friend';

const CONNECTION_TYPES: Array<{
  type: ConnectionType;
  label: string;
  description: string;
  color: string;
}> = [
  { type: 'partner',  label: 'Partner',  description: 'Phase, energy, support cues, forecast', color: '#5085B0' },
  { type: 'trainer',  label: 'Trainer',  description: 'Phase, training intensity, sleep & HRV', color: '#6AA882' },
  { type: 'ironmind', label: 'IronMind', description: 'Phase, GritScore context', color: '#C8943A' },
  { type: 'friend',   label: 'Friend',   description: 'Phase, energy level', color: '#8B68C0' },
];

interface InviteGeneratorProps {
  herUserId: string;
  phaseColor: string;
}

type Step = 'select' | 'generating' | 'done' | 'error';

export function InviteGenerator({ herUserId, phaseColor }: InviteGeneratorProps) {
  const [selected, setSelected] = useState<ConnectionType | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selected) return;
    setStep('generating');
    setTimeout(() => {
      const token = Math.random().toString(36).slice(2, 10);
      const base = typeof window !== 'undefined' ? window.location.origin : 'https://herside.netlify.app';
      setInviteUrl(`${base}/invite/${token}`);
      setStep('done');
    }, 600);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'HerSide invite', url: inviteUrl });
    } else {
      handleCopy();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setStep('select');
    setInviteUrl('');
    setCopied(false);
  };

  if (step === 'done') {
    const conn = CONNECTION_TYPES.find(c => c.type === selected)!;
    return (
      <Card>
        <SectionLabel color={phaseColor}>Invite link ready</SectionLabel>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: 'rgba(240,232,236,0.04)',
            border: '1px solid rgba(240,232,236,0.09)',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}>
            <span style={{
              color: 'rgba(240,232,236,0.5)',
              fontSize: 11,
              fontFamily: 'DM Sans, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {inviteUrl}
            </span>
            <button
              onClick={handleCopy}
              style={{
                padding: '4px 12px',
                borderRadius: 50,
                border: `1px solid ${conn.color}40`,
                background: `${conn.color}14`,
                color: conn.color,
                fontSize: 11,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 200ms ease',
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 50,
              border: 'none',
              background: conn.color,
              color: '#fff',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            Share with {conn.label}
          </button>

          <p style={{
            color: 'rgba(240,232,236,0.22)',
            fontSize: 11,
            fontFamily: 'DM Sans, sans-serif',
            textAlign: 'center',
            margin: 0,
          }}>
            Expires in 48 hours · one-time use
          </p>

          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(240,232,236,0.25)',
              fontSize: 12,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              alignSelf: 'center',
            }}
          >
            Generate another
          </button>
        </div>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card>
        <p style={{ color: '#D05555', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: '0 0 12px' }}>
          Failed to create invite. Check your connection and try again.
        </p>
        <button onClick={handleReset} style={{
          background: 'none', border: 'none', color: phaseColor, fontSize: 13,
          fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', padding: 0,
        }}>
          Try again
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <SectionLabel color={phaseColor}>Invite someone to your circle</SectionLabel>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONNECTION_TYPES.map(conn => {
          const active = selected === conn.type;
          return (
            <button
              key={conn.type}
              onClick={() => setSelected(conn.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                borderRadius: 14,
                border: active ? `1px solid ${conn.color}50` : '1px solid rgba(240,232,236,0.07)',
                background: active ? `${conn.color}10` : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease',
              }}
            >
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: conn.color,
                flexShrink: 0,
                opacity: active ? 1 : 0.4,
              }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  color: active ? '#F0E8EC' : 'rgba(240,232,236,0.6)',
                  fontSize: 13,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: active ? 500 : 400,
                  margin: '0 0 2px',
                }}>
                  {conn.label}
                </p>
                <p style={{
                  color: 'rgba(240,232,236,0.28)',
                  fontSize: 11,
                  fontFamily: 'DM Sans, sans-serif',
                  margin: 0,
                }}>
                  {conn.description}
                </p>
              </div>
              {active && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: conn.color, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!selected || step === 'generating'}
        style={{
          marginTop: 16,
          width: '100%',
          padding: '13px 0',
          borderRadius: 50,
          border: 'none',
          background: selected
            ? (CONNECTION_TYPES.find(c => c.type === selected)?.color ?? phaseColor)
            : 'rgba(240,232,236,0.06)',
          color: selected ? '#fff' : 'rgba(240,232,236,0.25)',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.5px',
          cursor: selected ? 'pointer' : 'not-allowed',
          transition: 'all 300ms ease',
          opacity: step === 'generating' ? 0.7 : 1,
        }}
      >
        {step === 'generating' ? 'Generating…' : 'Generate invite link'}
      </button>

      <p style={{
        color: 'rgba(240,232,236,0.2)',
        fontSize: 11,
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 0,
        lineHeight: 1.6,
      }}>
        Link expires in 48 hours. You can revoke access anytime.
      </p>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--s2)',
      border: '1px solid var(--dim)',
      borderRadius: 20,
      padding: '20px',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
      <span style={{
        color: '#F0E8EC',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {children}
      </span>
    </div>
  );
}
