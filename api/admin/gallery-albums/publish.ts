// api/admin/gallery-albums/publish.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/gallery-albums/publish]: ${req.method} request`);

    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('gallery_albums')
        .update({ 
          is_published: true,
          published_at: new Date().toISOString()
        })
        .is('deleted_at', null)
        .select('*');

      if (error) {
        console.error(`[API] [admin/gallery-albums/publish]: POST error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      
      console.log(`[API] [admin/gallery-albums/publish]: Published ${data?.length || 0} gallery albums`);
      return res.status(200).json({ ok: true, data, count: data?.length || 0 });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/gallery-albums/publish]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
