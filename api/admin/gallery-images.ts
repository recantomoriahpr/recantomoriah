// api/admin/gallery-images.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { album_id } = req.query;
      
      let query = supabase
        .from('gallery_images')
        .select('*')
        .is('deleted_at', null);
      
      if (album_id) {
        query = query.eq('album_id', album_id);
      }
      
      query = query.order('order', { ascending: true });
      
      const { data, error } = await query;

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      
      // Determine order if not provided
      let orderValue = payload.order;
      if (orderValue === undefined) {
        const { data: maxRow } = await supabase
          .from('gallery_images')
          .select('order')
          .eq('album_id', payload.album_id)
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
        .from('gallery_images')
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
