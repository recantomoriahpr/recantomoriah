// api/diag.ts
// Endpoint de diagnóstico para verificar configuração de ambiente
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const NODE_ENV = process.env.NODE_ENV || 'production';
    
    return res.status(200).json({
      ok: true,
      nodeEnv: NODE_ENV,
      nodeVersion: process.version,
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasAnonKey: Boolean(SUPABASE_ANON_KEY),
      hasServiceRole: Boolean(SUPABASE_SERVICE_ROLE),
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
