'use server';

import { sbInsert, sbSelect, sbPatch } from '@/lib/supabase';

export type ConnectionType = 'partner' | 'trainer' | 'ironmind' | 'friend';

// Default permissions mirror the edge function — keep in sync
const DEFAULT_PERMISSIONS: Record<ConnectionType, Record<string, boolean>> = {
  partner: {
    phase_name: true,
    energy_mood: true,
    support_cues: true,
    forecast: true,
    cycle_dates: false,
    symptoms: false,
    health_data: false,
  },
  trainer: {
    phase_name: true,
    training_recs: true,
    sleep_hrv: true,
    cycle_dates: false,
    emotional_data: false,
    symptoms: false,
  },
  ironmind: {
    phase_name: true,
    gritscore_context: true,
    symptom_data: false,
  },
  friend: {
    phase_name: true,
    energy_mood: true,
    forecast: false,
  },
};

const ALWAYS_PRIVATE: Record<ConnectionType, string[]> = {
  partner: ['cycle_dates', 'symptoms', 'health_data'],
  trainer: ['cycle_dates', 'emotional_data', 'symptoms'],
  ironmind: [],
  friend: [],
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://herside.app';

export interface InviteResult {
  inviteUrl: string;
  token: string;
}

export async function createInvite(
  herUserId: string,
  connectionType: ConnectionType,
  customPermissions: Record<string, boolean> = {},
): Promise<InviteResult> {
  // Merge + enforce always-private locks
  const permissions = { ...DEFAULT_PERMISSIONS[connectionType], ...customPermissions };
  for (const key of ALWAYS_PRIVATE[connectionType]) {
    permissions[key] = false;
  }

  const connection = await sbInsert<{ id: string; invite_token: string }>(
    'circle_connections',
    {
      her_user_id: herUserId,
      connection_type: connectionType,
      status: 'pending',
      invite_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    },
  );

  // Bulk-insert all permission rows
  await sbInsert(
    'privacy_permissions',
    Object.entries(permissions).map(([key, enabled]) => ({
      connection_id: connection.id,
      permission_key: key,
      enabled,
    })),
  );

  return {
    inviteUrl: `${APP_URL}/invite/${connection.invite_token}`,
    token: connection.invite_token,
  };
}

export interface InviteDetails {
  id: string;
  connection_type: ConnectionType;
  status: string;
  invite_expires_at: string;
  her_user_id: string;
  permissions: Array<{ permission_key: string; enabled: boolean }>;
}

export async function getInviteByToken(token: string): Promise<InviteDetails | null> {
  const rows = await sbSelect<InviteDetails>(
    'circle_connections',
    `invite_token=eq.${encodeURIComponent(token)}&select=id,connection_type,status,invite_expires_at,her_user_id,privacy_permissions(permission_key,enabled)`,
  );
  if (!rows.length) return null;
  const row = rows[0] as InviteDetails & { privacy_permissions?: { permission_key: string; enabled: boolean }[] };
  return {
    ...row,
    permissions: row.privacy_permissions ?? [],
  };
}

export async function revokeConnection(connectionId: string): Promise<void> {
  await sbPatch('circle_connections', `id=eq.${connectionId}`, { status: 'revoked' });
}

export async function acceptInvite(
  token: string,
  acceptingUserId: string,
): Promise<void> {
  const rows = await sbSelect<{ id: string; status: string; invite_expires_at: string }>(
    'circle_connections',
    `invite_token=eq.${encodeURIComponent(token)}&select=id,status,invite_expires_at`,
  );

  const conn = rows[0];
  if (!conn) throw new Error('Invite not found');
  if (conn.status !== 'pending') throw new Error('Invite already used or revoked');
  if (new Date(conn.invite_expires_at) < new Date()) throw new Error('Invite expired');

  await sbPatch('circle_connections', `id=eq.${conn.id}`, {
    connected_user_id: acceptingUserId,
    status: 'active',
  });
}
