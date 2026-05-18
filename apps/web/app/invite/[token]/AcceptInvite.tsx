'use client';

import { useState } from 'react';

interface AcceptInviteProps {
  token: string;
  connectionType: string;
  phaseColor: string;
}

export function AcceptInvite({ token, connectionType, phaseColor }: AcceptInviteProps) {
  const [state, setState] = useState<'idle' | 'accepting' | 'done' | 'error'>('idle');

  const handleAccept = async () => {
    setState('accepting');
    try {
      // In production: create/login user account, then call acceptInvite server action
      // For now: redirect to sign-up with token preserved
      window.location.href = `/onboarding/accept/${token}`;
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5BAA78' }} />
        <p style={{ color: '#5BAA78', fontSize: 15, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Connected
        </p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <p style={{ color: '#D05555', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
        Something went wrong. Please try the invite link again.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <button
        onClick={handleAccept}
        disabled={state === 'accepting'}
        style={{
          width: '100%',
          padding: '15px 0',
          borderRadius: 50,
          border: 'none',
          background: phaseColor,
          color: '#fff',
          fontSize: 14,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          opacity: state === 'accepting' ? 0.7 : 1,
          transition: 'opacity 200ms ease',
        }}
      >
        {state === 'accepting' ? 'Setting up…' : `Accept as ${capitalize(connectionType)}`}
      </button>
      <p style={{
        color: 'rgba(240,232,236,0.25)',
        fontSize: 11,
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.6,
      }}>
        You'll create a free HerSide account to accept.
        She can revoke access anytime, instantly.
      </p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
