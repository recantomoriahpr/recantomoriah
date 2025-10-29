// api/admin/contact-info.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = getSupabaseClient();
    console.log(`[API] [admin/contact-info]: ${req.method} request`);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(`[API] [admin/contact-info]: GET error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'PUT') {
      const payload = await req.body;
      console.log(`[API] [admin/contact-info]: PUT payload:`, payload);
      
      const { data, error } = await supabase
        .from('contact_info')
        .upsert(payload)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/contact-info]: PUT error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/contact-info]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
