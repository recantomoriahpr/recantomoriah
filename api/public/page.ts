// api/public/page.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id,album_id,url,alt,caption,"order",is_published,created_at,updated_at,deleted_at,video_url,video_id,is_video,external_link')
      .is('deleted_at', null)
      .eq('is_published', true)
      .order('order', { ascending: true });

    if (error) return res.status(500).json({ ok: false, error: error.message });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).json({ ok: true, items: data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
}
