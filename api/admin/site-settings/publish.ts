// api/admin/site-settings/publish.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/site-settings/publish]: ${req.method} request`);

    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ 
          is_published: true,
          published_at: new Date().toISOString()
        })
        .is('deleted_at', null)
        .select('*');

      if (error) {
        console.error(`[API] [admin/site-settings/publish]: POST error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      
      console.log(`[API] [admin/site-settings/publish]: Published ${data?.length || 0} site settings`);
      return res.status(200).json({ ok: true, data, count: data?.length || 0 });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/site-settings/publish]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
