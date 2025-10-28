// api/public/page.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnon = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnon);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // ajuste se quiser filtrar por álbum etc.
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, album_id, url, alt, caption, "order", is_published, created_at, updated_at, video_url, video_id, is_video, deleted_at, external_link')
      .is('deleted_at', null)
      .eq('is_published', true)
      .order('order', { ascending: true });

    if (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }

    // normalização mínima esperada pelo front
    const items = (data ?? []).map((row: any) => ({
      id: row.id,
      album_id: row.album_id,
      url: row.url,
      alt: row.alt,
      caption: row.caption,
      order: row.order ?? 0,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      video_url: row.video_url,
      video_id: row.video_id,
      is_video: row.is_video,
      external_link: row.external_link,
    }));

    // CORS + cache leve
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: true, items });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'unknown' });
  }
}
