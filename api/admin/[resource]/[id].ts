// api/admin/[resource]/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

// Mapeamento de recursos para tabelas
const resourceMap: Record<string, string> = {
  'hero-slides': 'hero_slides',
  'benefit-cards': 'benefit_cards',
  'testimonials': 'testimonials',
  'info-cards': 'info_cards',
  'gallery-albums': 'gallery_albums',
  'gallery-images': 'gallery_images',
  'footer-links': 'footer_links'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = getSupabaseClient();
    const { resource, id } = req.query;
    console.log(`[API] [admin/${resource}/${id}]: ${req.method} request`);

    if (!resource || typeof resource !== 'string') {
      return res.status(400).json({ ok: false, error: 'Resource is required' });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ ok: false, error: 'ID is required' });
    }

    const tableName = resourceMap[resource];
    if (!tableName) {
      return res.status(404).json({ ok: false, error: 'Resource not found' });
    }

    if (req.method === 'PUT') {
      const payload = req.body;
      console.log(`[API] [admin/${resource}/${id}]: PUT payload:`, payload);
      
      const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/${resource}/${id}]: PUT error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'DELETE') {
      const { data, error } = await supabase
        .from(tableName)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/${resource}/${id}]: DELETE error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/[resource]/[id]]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
