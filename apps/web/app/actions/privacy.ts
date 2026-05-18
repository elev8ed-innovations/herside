'use server';

import { sbPatch, sbSelect } from '@/lib/supabase';

export async function updatePermission(
  connectionId: string,
  permissionKey: string,
  enabled: boolean,
): Promise<void> {
  await sbPatch(
    'privacy_permissions',
    `connection_id=eq.${connectionId}&permission_key=eq.${permissionKey}`,
    { enabled },
  );
}

export interface Connection {
  id: string;
  connection_type: 'partner' | 'trainer' | 'ironmind' | 'friend';
  status: string;
  connected_user: { name: string | null; email: string } | null;
  permissions: Array<{ permission_key: string; enabled: boolean }>;
}

export async function getConnections(herUserId: string): Promise<Connection[]> {
  const rows = await sbSelect<Connection>(
    'circle_connections',
    `her_user_id=eq.${herUserId}&status=eq.active&select=id,connection_type,status,connected_user:users!connected_user_id(name,email),privacy_permissions(permission_key,enabled)`,
  );
  return rows.map(r => ({
    ...r,
    permissions: (r as unknown as { privacy_permissions: { permission_key: string; enabled: boolean }[] }).privacy_permissions ?? [],
  }));
}
