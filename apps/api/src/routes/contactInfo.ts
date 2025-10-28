import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const UpdateSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  address_complement: z.string().optional(),
  address_reference: z.string().optional(),
  gps_coordinates: z.string().optional(),
  weekday_hours: z.string().optional(),
  saturday_hours: z.string().optional(),
  sunday_hours: z.string().optional(),
  response_time: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  footer_brand_title: z.string().optional(),
  footer_brand_description: z.string().optional(),
  footer_copyright_text: z.string().optional(),
  footer_privacy_policy_text: z.string().optional(),
  footer_terms_of_use_text: z.string().optional(),
});

type UpdatePayload = z.infer<typeof UpdateSchema>;

// Get contact info (admin)
router.get('/contact-info', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[GET /admin/contact-info] error:', error);
      return res.status(500).json({ error: 'Failed to fetch contact info' });
    }

    // If no record exists, create one with defaults
    if (!data) {
      const { data: newData, error: createError } = await supabase
        .from('contact_info')
        .insert({
          phone: '(11) 99999-9999',
          whatsapp: '11999999999',
          email: 'contato@recantomoriah.com.br',
          address: 'Estrada Rural KM 15',
          address_complement: 'Zona Rural',
          address_reference: 'Próximo ao posto de gasolina central',
          gps_coordinates: 'https://maps.google.com/...',
          weekday_hours: '8h às 18h',
          saturday_hours: '8h às 16h',
          sunday_hours: '9h às 15h',
          response_time: 'Respondemos todas as mensagens em até 2 horas durante o horário comercial.',
          instagram: 'https://instagram.com/recantomoriah',
          facebook: 'https://facebook.com/recantomoriah',
          linkedin: '',
          twitter: '',
          footer_brand_title: 'Recanto Moriah',
          footer_brand_description: 'O lugar perfeito para seus momentos especiais. Natureza, conforto e estrutura completa para casamentos, retiros e eventos inesquecíveis.',
          footer_copyright_text: 'Recanto Moriah. Todos os direitos reservados.',
          footer_privacy_policy_text: 'Política de Privacidade',
          footer_terms_of_use_text: 'Termos de Uso',
          is_published: true,
        })
        .select('*')
        .single();

      if (createError) {
        console.error('[GET /admin/contact-info] create error:', createError);
        return res.status(500).json({ error: 'Failed to create default contact info' });
      }

      return res.json({ ok: true, data: newData });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/contact-info] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update contact info
router.put('/contact-info', async (req: Request, res: Response) => {
  try {
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<UpdatePayload>;
    const updateData: Record<string, unknown> = {};
    
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.address_complement !== undefined) updateData.address_complement = body.address_complement;
    if (body.address_reference !== undefined) updateData.address_reference = body.address_reference;
    if (body.gps_coordinates !== undefined) updateData.gps_coordinates = body.gps_coordinates;
    if (body.weekday_hours !== undefined) updateData.weekday_hours = body.weekday_hours;
    if (body.saturday_hours !== undefined) updateData.saturday_hours = body.saturday_hours;
    if (body.sunday_hours !== undefined) updateData.sunday_hours = body.sunday_hours;
    if (body.response_time !== undefined) updateData.response_time = body.response_time;
    if (body.instagram !== undefined) updateData.instagram = body.instagram;
    if (body.facebook !== undefined) updateData.facebook = body.facebook;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;
    if (body.twitter !== undefined) updateData.twitter = body.twitter;
    if (body.footer_brand_title !== undefined) updateData.footer_brand_title = body.footer_brand_title;
    if (body.footer_brand_description !== undefined) updateData.footer_brand_description = body.footer_brand_description;
    if (body.footer_copyright_text !== undefined) updateData.footer_copyright_text = body.footer_copyright_text;
    if (body.footer_privacy_policy_text !== undefined) updateData.footer_privacy_policy_text = body.footer_privacy_policy_text;
    if (body.footer_terms_of_use_text !== undefined) updateData.footer_terms_of_use_text = body.footer_terms_of_use_text;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    
    // Get existing record
    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('contact_info')
        .update(updateData)
        .eq('id', existing.id)
        .select('*')
        .single();

      if (error) {
        console.error('[PUT /admin/contact-info] update error:', error);
        return res.status(500).json({ error: 'Failed to update contact info' });
      }
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('contact_info')
        .insert({ ...updateData, is_published: true })
        .select('*')
        .single();

      if (error) {
        console.error('[PUT /admin/contact-info] insert error:', error);
        return res.status(500).json({ error: 'Failed to create contact info' });
      }
      result = data;
    }

    return res.json({ ok: true, data: result });
  } catch (err) {
    console.error('[PUT /admin/contact-info] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Publish contact info
router.post('/contact-info/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('contact_info')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/contact-info/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish contact info' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/contact-info/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
