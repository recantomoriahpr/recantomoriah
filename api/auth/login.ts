// api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';

function getSupabaseAnon() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function cookieOpts(maxAgeSeconds?: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    'Path=/',
    'HttpOnly',
    isProd ? 'Secure' : '',
    'SameSite=Strict',
  ].filter(Boolean);
  if (typeof maxAgeSeconds === 'number') {
    parts.push(`Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
  }
  return parts.join('; ');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'POST');
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { access_token, refresh_token, expires_in } = data.session; // expires_in is in seconds

    res.setHeader('Set-Cookie', [
      `${ACCESS_COOKIE}=${access_token}; ${cookieOpts(expires_in)}`,
      `${REFRESH_COOKIE}=${refresh_token}; ${cookieOpts(60 * 60 * 24 * 7 * 4 * 3)}`,
    ]);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[api/auth/login] error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
