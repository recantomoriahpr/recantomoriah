// api/admin/publish.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

type Resource =
  | 'benefit_cards'
  | 'contact_info'
  | 'footer_links'
  | 'gallery_albums'
  | 'gallery_images'
  | 'hero_slides'
  | 'info_cards'
  | 'site_settings'
  | 'testimonials'
  | 'schedules';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = getSupabaseClient();
    console.log(`[API] [admin/publish]: ${req.method} request`);

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { resource, id, action } = req.body as { 
      resource: Resource; 
      id?: string | number; 
      action: 'publish' | 'unpublish' 
    };

    if (!resource || !action) {
      return res.status(400).json({ ok: false, error: 'Missing resource or action' });
    }

    console.log(`[API] [admin/publish]: ${action} ${resource}${id ? ` (id: ${id})` : ''}`);

    const isPublished = action === 'publish';
    let query = supabase.from(resource).update({ is_published: isPublished });

    // Se ID foi fornecido, atualizar apenas esse item
    if (id) {
      query = query.eq('id', id);
    } else {
      // Se não, atualizar todos os itens não deletados
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query.select('id');

    if (error) {
      console.error(`[API] [admin/publish]: Error ${action}ing ${resource}:`, error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    const count = data?.length || 0;
    console.log(`[API] [admin/publish]: ${action === 'publish' ? 'Published' : 'Unpublished'} ${count} items in ${resource}`);

    return res.status(200).json({ 
      ok: true, 
      count,
      resource,
      action,
      id: id || null
    });

  } catch (err: any) {
    console.error(`[API] [admin/publish]: Unexpected error:`, err);
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
  }
}
