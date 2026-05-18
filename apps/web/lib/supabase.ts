// Server-only Supabase REST client. Never import from Client Components.
// Uses service role key — bypasses RLS for server actions.
// Switch to per-user JWT once auth layer is wired (Prompt auth step).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const serviceHeaders = {
  'Content-Type': 'application/json',
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  Prefer: 'return=representation',
};

export async function sbSelect<T>(table: string, query: string): Promise<T[]> {
  if (!SUPABASE_URL || !SERVICE_KEY) return [];
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: serviceHeaders,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Supabase select ${table}: ${res.status}`);
  return res.json() as Promise<T[]>;
}

export async function sbInsert<T>(
  table: string,
  data: Record<string, unknown> | Record<string, unknown>[],
): Promise<T> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Supabase not configured');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase insert ${table}: ${res.status} ${body}`);
  }
  const rows = await res.json();
  return (Array.isArray(rows) ? rows[0] : rows) as T;
}

export async function sbPatch(
  table: string,
  filter: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Supabase not configured');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: serviceHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase patch ${table}: ${res.status} ${body}`);
  }
}
