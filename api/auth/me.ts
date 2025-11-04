// api/auth/me.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ACCESS_COOKIE = 'sb-access-token';

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
    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'GET');
      return res.status(204).end();
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const access = getCookie(req, ACCESS_COOKIE) || '';
    if (!access) {
      return res.status(401).json({ authenticated: false });
    }

    // Optionally we could validate JWT here. For now, presence indicates an active session.
    return res.status(200).json({ authenticated: true });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[api/auth/me] error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
