import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  image_url: z.string().url(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/hero-slides', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/hero-slides] error:', error);
      return res.status(500).json({ error: 'Failed to fetch hero slides' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/hero-slides] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/hero-slides', async (req: Request, res: Response) => {
  try {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const supabase = getSupabaseService();
    const body = parsed.data as CreatePayload;

    // Determine order if not provided
    let orderValue = body.order;
    if (orderValue === undefined) {
      const { data: maxRow, error: maxErr } = await supabase
        .from('hero_slides')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/hero-slides] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const insertPayload = {
      image_url: body.image_url,
      title: body.title,
      subtitle: body.subtitle,
      cta_text: body.cta_text,
      cta_link: body.cta_link,
      order: orderValue,
      is_published: false,
    } as const;

    const { data, error } = await supabase
      .from('hero_slides')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/hero-slides] insert error:', error);
      return res.status(500).json({ error: 'Failed to create hero slide' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/hero-slides] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/hero-slides/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;

    const updateData: Record<string, unknown> = {};
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.cta_text !== undefined) updateData.cta_text = body.cta_text;
    if (body.cta_link !== undefined) updateData.cta_link = body.cta_link;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('hero_slides')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/hero-slides/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update hero slide' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/hero-slides/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/hero-slides/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('hero_slides')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/hero-slides/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete hero slide' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/hero-slides/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/hero-slides/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('hero_slides')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/hero-slides/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish hero slides' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/hero-slides/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
