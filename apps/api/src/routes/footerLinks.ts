import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  category: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/footer-links', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('footer_links')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/footer-links] error:', error);
      return res.status(500).json({ error: 'Failed to fetch footer links' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/footer-links] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/footer-links', async (req: Request, res: Response) => {
  try {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const supabase = getSupabaseService();
    const body = parsed.data as CreatePayload;

    let orderValue = body.order;
    if (orderValue === undefined) {
      const { data: maxRow, error: maxErr } = await supabase
        .from('footer_links')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/footer-links] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const { data, error } = await supabase
      .from('footer_links')
      .insert({
        label: body.label,
        url: body.url,
        category: body.category,
        order: orderValue,
        is_published: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/footer-links] insert error:', error);
      return res.status(500).json({ error: 'Failed to create footer link' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/footer-links] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/footer-links/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.label !== undefined) updateData.label = body.label;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('footer_links')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/footer-links/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update footer link' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/footer-links/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/footer-links/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('footer_links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/footer-links/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete footer link' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/footer-links/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/footer-links/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('footer_links')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/footer-links/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish footer links' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/footer-links/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
