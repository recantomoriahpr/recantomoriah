// api/admin/info-cards/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    console.log(`[API] [admin/info-cards/${id}]: ${req.method} request`);

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ ok: false, error: 'ID is required' });
    }

    if (req.method === 'PUT') {
      const payload = req.body;
      console.log(`[API] [admin/info-cards/${id}]: PUT payload:`, payload);
      
      const { data, error } = await supabase
        .from('info_cards')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/info-cards/${id}]: PUT error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'DELETE') {
      const { data, error } = await supabase
        .from('info_cards')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/info-cards/${id}]: DELETE error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/info-cards/[id]]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
