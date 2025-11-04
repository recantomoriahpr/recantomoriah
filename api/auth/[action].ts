// api/auth/[action].ts
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

function clearCookieHeader(name: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${name}=`,
    'Path=/',
    'HttpOnly',
    isProd ? 'Secure' : '',
    'SameSite=Strict',
    'Max-Age=0',
  ].filter(Boolean);
  return parts.join('; ');
}

function getCookie(req: VercelRequest, name: string): string | undefined {
  const raw = req.headers['cookie'];
  if (!raw || Array.isArray(raw)) return undefined;
  const parts = raw.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const action = (req.query?.action as string) || '';

    if (req.method === 'OPTIONS') {
      if (action === 'login') res.setHeader('Allow', 'POST');
      else if (action === 'logout') res.setHeader('Allow', 'POST');
      else if (action === 'me') res.setHeader('Allow', 'GET');
      else res.setHeader('Allow', 'GET, POST');
      return res.status(204).end();
    }

    if (action === 'login') {
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
      const { access_token, refresh_token, expires_in } = data.session; // seconds
      res.setHeader('Set-Cookie', [
        `${ACCESS_COOKIE}=${access_token}; ${cookieOpts(expires_in)}`,
        `${REFRESH_COOKIE}=${refresh_token}; ${cookieOpts(60 * 60 * 24 * 7 * 4 * 3)}`,
      ]);
      return res.status(200).json({ success: true });
    }

    if (action === 'logout') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
      res.setHeader('Set-Cookie', [
        clearCookieHeader(ACCESS_COOKIE),
        clearCookieHeader(REFRESH_COOKIE),
      ]);
      return res.status(200).json({ success: true });
    }

    if (action === 'me') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
      const access = getCookie(req, ACCESS_COOKIE) || '';
      if (!access) {
        return res.status(401).json({ authenticated: false });
      }
      return res.status(200).json({ authenticated: true });
    }

    return res.status(404).json({ error: 'Not Found' });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[api/auth/[action]] error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
