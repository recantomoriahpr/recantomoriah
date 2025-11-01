// api/admin/[resource].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
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
  'footer-links': 'footer_links',
  'site-settings': 'site_settings',
  'contact-info': 'contact_info'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = getSupabaseClient();
    const { resource } = req.query;
    console.log(`[API] [admin/${resource}]: ${req.method} request`);

    if (!resource || typeof resource !== 'string') {
      return res.status(400).json({ ok: false, error: 'Resource is required' });
    }

    const tableName = resourceMap[resource];
    if (!tableName) {
      return res.status(404).json({ ok: false, error: 'Resource not found' });
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(204).end();
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .is('deleted_at', null)
        .order('order', { ascending: true });

      if (error) {
        console.error(`[API] [admin/${resource}]: GET error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      
      // Determine order if not provided
      let orderValue = payload.order;
      if (orderValue === undefined) {
        const { data: maxRow } = await supabase
          .from(tableName)
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
        .from(tableName)
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) {
        console.error(`[API] [admin/${resource}]: POST error:`, error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      return res.status(200).json({ ok: true, data });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/[resource]]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
