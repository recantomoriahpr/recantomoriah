// api/admin/site-settings.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/server/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'PUT') {
      const payload = req.body;
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .upsert(payload)
        .select('*')
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('[site-settings] error:', e);
    return res.status(500).json({ error: e?.message || 'Internal Server Error' });
  }
}
