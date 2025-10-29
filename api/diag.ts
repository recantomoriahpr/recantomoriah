// api/diag.ts
// Endpoint de diagnóstico para verificar configuração de ambiente
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { env } from '../src/server/env';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({
      ok: true,
      nodeEnv: env.NODE_ENV,
      hasSupabaseUrl: Boolean(env.SUPABASE_URL),
      hasAnonKey: Boolean(env.SUPABASE_ANON_KEY),
      hasServiceRole: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
      ts: new Date().toISOString()
    });
  } catch (e: any) {
    console.error('[API] [diag]: Error:', e);
    return res.status(500).json({
      ok: false,
      error: e?.message || 'Internal Server Error',
      ts: new Date().toISOString()
    });
  }
}
