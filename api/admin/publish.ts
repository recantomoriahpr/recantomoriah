// api/admin/publish.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
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
    res.setHeader('Content-Type', 'application/json');
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

    const isPublishAction = action === 'publish';

    // Tratamento especial para site_settings (modelo DB Only)
    if (resource === 'site_settings') {
      if (isPublishAction) {
        // Determinar o alvo da publicação
        let targetId = id as string | undefined;
        if (!targetId) {
          const { data: latest, error: latestErr } = await supabase
            .from('site_settings')
            .select('id')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (latestErr) {
            console.error('[admin/publish] site_settings latest error:', latestErr);
            return res.status(500).json({ ok: false, error: latestErr.message });
          }
          if (!latest?.id) {
            return res.status(400).json({ ok: false, error: 'No site_settings record to publish' });
          }
          targetId = latest.id as string;
        }

        // Publicar o alvo
        const { error: pubErr } = await supabase
          .from('site_settings')
          .update({ is_published: true, published_at: new Date().toISOString() })
          .eq('id', targetId);
        if (pubErr) {
          console.error('[admin/publish] site_settings publish error:', pubErr);
          return res.status(500).json({ ok: false, error: pubErr.message });
        }

        // Despublicar os demais
        const { error: unpubOthersErr } = await supabase
          .from('site_settings')
          .update({ is_published: false })
          .neq('id', targetId)
          .is('deleted_at', null);
        if (unpubOthersErr) {
          console.error('[admin/publish] site_settings unpublish others error:', unpubOthersErr);
          return res.status(500).json({ ok: false, error: unpubOthersErr.message });
        }

        console.log('[admin/publish] site_settings published → fonte pública atualizada em database (site_settings where is_published=true)');

        return res.status(200).json({
          ok: true,
          resource,
          action,
          published: true,
          id: targetId,
        });
      } else {
        // Unpublish
        let q = supabase.from('site_settings').update({ is_published: false, published_at: null });
        if (id) q = q.eq('id', id);
        const { error: upErr } = await q;
        if (upErr) {
          console.error('[admin/publish] site_settings unpublish error:', upErr);
          return res.status(500).json({ ok: false, error: upErr.message });
        }
        console.log('[admin/publish] site_settings unpublished');
        return res.status(200).json({ ok: true, resource, action, published: false, id: id || null });
      }
    }

    // Demais recursos: manter comportamento atual (toggle is_published)
    const isPublished = isPublishAction;
    let query = supabase.from(resource).update({ is_published: isPublished });
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.select('id');
    if (error) {
      console.error(`[API] [admin/publish]: Error ${action}ing ${resource}:`, error);
      return res.status(500).json({ ok: false, error: error.message });
    }
    const count = data?.length || 0;
    console.log(`[API] [admin/publish]: ${isPublishAction ? 'Published' : 'Unpublished'} ${count} items in ${resource}`);
    return res.status(200).json({ ok: true, count, resource, action, id: id || null });

  } catch (err: any) {
    console.error(`[API] [admin/publish]: Unexpected error:`, err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
  }
}
