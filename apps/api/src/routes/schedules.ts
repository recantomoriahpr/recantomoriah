import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  footer: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/schedules', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/schedules] error:', error);
      return res.status(500).json({ error: 'Failed to fetch schedules' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/schedules] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/schedules', async (req: Request, res: Response) => {
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
        .from('schedules')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/schedules] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert({
        title: body.title,
        description: body.description,
        footer: body.footer,
        order: orderValue,
        is_published: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/schedules] insert error:', error);
      return res.status(500).json({ error: 'Failed to create schedule' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/schedules] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.footer !== undefined) updateData.footer = body.footer;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/schedules/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update schedule' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/schedules/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('schedules')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/schedules/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete schedule' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/schedules/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/schedules/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('schedules')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/schedules/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish schedules' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/schedules/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
