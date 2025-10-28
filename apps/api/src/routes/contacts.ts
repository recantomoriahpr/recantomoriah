import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  phone: z.string().optional(),
  whatsapp_e164: z.string().optional(),
  email: z.string().email().optional(),
  endereco_principal: z.string().optional(),
  complemento: z.string().optional(),
  link_mapa: z.string().url().optional(),
  is_published: z.boolean().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/contacts', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /admin/contacts] error:', error);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/contacts] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const supabase = getSupabaseService();
    const body = parsed.data as CreatePayload;

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        phone: body.phone,
        whatsapp_e164: body.whatsapp_e164,
        email: body.email,
        endereco_principal: body.endereco_principal,
        complemento: body.complemento,
        link_mapa: body.link_mapa,
        is_published: body.is_published ?? false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/contacts] insert error:', error);
      return res.status(500).json({ error: 'Failed to create contact' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/contacts] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.whatsapp_e164 !== undefined) updateData.whatsapp_e164 = body.whatsapp_e164;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.endereco_principal !== undefined) updateData.endereco_principal = body.endereco_principal;
    if (body.complemento !== undefined) updateData.complemento = body.complemento;
    if (body.link_mapa !== undefined) updateData.link_mapa = body.link_mapa;
    if (body.is_published !== undefined) updateData.is_published = body.is_published;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/contacts/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update contact' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/contacts/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/contacts/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/contacts/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/contacts/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/contacts/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish contacts' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/contacts/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
