import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  icon_key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/benefit-cards', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('benefit_cards')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/benefit-cards] error:', error);
      return res.status(500).json({ error: 'Failed to fetch benefit cards' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/benefit-cards] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/benefit-cards', async (req: Request, res: Response) => {
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
        .from('benefit_cards')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/benefit-cards] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const { data, error } = await supabase
      .from('benefit_cards')
      .insert({
        icon_key: body.icon_key,
        title: body.title,
        description: body.description,
        order: orderValue,
        is_published: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/benefit-cards] insert error:', error);
      return res.status(500).json({ error: 'Failed to create benefit card' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/benefit-cards] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/benefit-cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.icon_key !== undefined) updateData.icon_key = body.icon_key;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('benefit_cards')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/benefit-cards/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update benefit card' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/benefit-cards/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/benefit-cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('benefit_cards')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/benefit-cards/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete benefit card' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/benefit-cards/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/benefit-cards/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('benefit_cards')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/benefit-cards/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish benefit cards' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/benefit-cards/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
