// api/health.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [health]: ${req.method} request`);

    if (req.method === 'GET') {
      return res.status(200).json({ 
        status: 'ok',
        ts: new Date().toISOString()
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [health]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
