import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE } = process.env;

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment');
}
if (!SUPABASE_ANON_KEY) {
  console.warn('[WARN] Missing SUPABASE_ANON_KEY in environment');
}
if (!SUPABASE_SERVICE_ROLE) {
  console.warn('[WARN] Missing SUPABASE_SERVICE_ROLE in environment');
}

export function getSupabaseAnon(): SupabaseClient {
  if (!SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY not set');
  const url = SUPABASE_URL as string;
  const key = SUPABASE_ANON_KEY as string;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function getSupabaseService(): SupabaseClient {
  if (!SUPABASE_SERVICE_ROLE) throw new Error('SUPABASE_SERVICE_ROLE not set');
  const url = SUPABASE_URL as string;
  const key = SUPABASE_SERVICE_ROLE as string;
  return createClient(url, key, { auth: { persistSession: false } });
}
