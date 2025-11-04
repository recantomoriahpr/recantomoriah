// api/auth/logout.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';

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

    res.setHeader('Set-Cookie', [
      clearCookieHeader(ACCESS_COOKIE),
      clearCookieHeader(REFRESH_COOKIE),
    ]);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[api/auth/logout] error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
