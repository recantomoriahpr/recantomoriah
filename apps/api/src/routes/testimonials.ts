import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  text: z.string(),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/testimonials', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/testimonials] error:', error);
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/testimonials] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/testimonials', async (req: Request, res: Response) => {
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
        .from('testimonials')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/testimonials] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: body.name,
        role: body.role,
        text: body.text,
        rating: body.rating,
        order: orderValue,
        is_published: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/testimonials] insert error:', error);
      return res.status(500).json({ error: 'Failed to create testimonial' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/testimonials] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.text !== undefined) updateData.text = body.text;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/testimonials/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update testimonial' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/testimonials/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('testimonials')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/testimonials/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete testimonial' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/testimonials/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/testimonials/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/testimonials/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish testimonials' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/testimonials/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
