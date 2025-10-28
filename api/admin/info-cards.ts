// api/admin/info-cards.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('info_cards')
        .select('*')
        .is('deleted_at', null)
        .order('order', { ascending: true });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      
      // Determine order if not provided
      let orderValue = payload.order;
      if (orderValue === undefined) {
        const { data: maxRow } = await supabase
          .from('info_cards')
          .select('order')
          .is('deleted_at', null)
          .order('order', { ascending: false })
          .limit(1)
          .maybeSingle();
        orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
      }

      const insertPayload = {
        ...payload,
        order: orderValue,
        is_published: false,
      };

      const { data, error } = await supabase
        .from('info_cards')
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Internal Server Error' });
  }
}
