// api/[...all].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(404).json({ ok: false, error: 'Not Found', path: req.url || '' });
}
