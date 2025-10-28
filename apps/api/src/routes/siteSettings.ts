import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const SiteSettingsSchema = z.object({
  logo_url: z.string().url().nullable().optional(),
  primary_color: z.string().nullable().optional(),
  secondary_color: z.string().nullable().optional(),
  accent_color: z.string().nullable().optional(),
  background_color: z.string().nullable().optional(),
  font_family: z.string().nullable().optional(),
  // Section titles
  benefits_title: z.string().nullable().optional(),
  benefits_subtitle: z.string().nullable().optional(),
  gallery_title: z.string().nullable().optional(),
  gallery_subtitle: z.string().nullable().optional(),
  testimonials_title: z.string().nullable().optional(),
  testimonials_subtitle: z.string().nullable().optional(),
  info_title: z.string().nullable().optional(),
  info_subtitle: z.string().nullable().optional(),
});

type SiteSettingsPayload = z.infer<typeof SiteSettingsSchema>;

async function getOrCreateSettings() {
  const supabase = getSupabaseService();
  // Try to get the first record
  const existing = await supabase
    .from('site_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing.error) {
    return { data: null, error: existing.error } as const;
  }
  if (existing.data) {
    return { data: existing.data, error: null } as const;
  }

  // Create a default draft if none exists
  const created = await supabase
    .from('site_settings')
    .insert({ is_published: false })
    .select('*')
    .single();

  if (created.error) {
    return { data: null, error: created.error } as const;
  }
  return { data: created.data, error: null } as const;
}

router.get('/site-settings', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getOrCreateSettings();
    if (error) {
      console.error('[GET /admin/site-settings] error:', error);
      return res.status(500).json({ error: 'Failed to load site settings' });
    }
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/site-settings] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/site-settings', async (req: Request, res: Response) => {
  try {
    const parsed = SiteSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { data: settings, error } = await getOrCreateSettings();
    if (error || !settings) {
      console.error('[PUT /admin/site-settings] load/create error:', error);
      return res.status(500).json({ error: 'Failed to prepare site settings' });
    }

    const payload = parsed.data as SiteSettingsPayload;
    // Build update object only with provided fields
    const updateData = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    );

    const supabase = getSupabaseService();
    const updated = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', settings.id)
      .select('*')
      .single();

    if (updated.error) {
      console.error('[PUT /admin/site-settings] update error:', updated.error);
      return res.status(500).json({ error: 'Failed to update site settings' });
    }

    return res.json({ ok: true, data: updated.data });
  } catch (err) {
    console.error('[PUT /admin/site-settings] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/site-settings/publish', async (_req: Request, res: Response) => {
  try {
    const { data: settings, error } = await getOrCreateSettings();
    if (error || !settings) {
      console.error('[POST /admin/site-settings/publish] load/create error:', error);
      return res.status(500).json({ error: 'Failed to prepare site settings' });
    }

    const supabase = getSupabaseService();
    const updated = await supabase
      .from('site_settings')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .eq('id', settings.id)
      .select('*')
      .single();

    if (updated.error) {
      console.error('[POST /admin/site-settings/publish] update error:', updated.error);
      return res.status(500).json({ error: 'Failed to publish site settings' });
    }

    return res.json({ ok: true, data: updated.data });
  } catch (err) {
    console.error('[POST /admin/site-settings/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
