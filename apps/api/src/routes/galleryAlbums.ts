import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  title: z.string(),
  slug: z.string(),
  order: z.number().int().nonnegative().optional(),
});

const UpdateSchema = CreateSchema.partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/gallery-albums', async (req: Request, res: Response) => {
  try {
    const includeImages = req.query.images === 'true';
    const supabase = getSupabaseService();
    
    const { data: albums, error } = await supabase
      .from('gallery_albums')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (error) {
      console.error('[GET /admin/gallery-albums] error:', error);
      return res.status(500).json({ error: 'Failed to fetch gallery albums' });
    }

    if (!includeImages) {
      return res.json({ ok: true, data: albums });
    }

    // Include images for each album
    const albumsWithImages = await Promise.all(
      albums.map(async (album) => {
        const { data: images, error: imgError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('album_id', album.id)
          .is('deleted_at', null)
          .order('order', { ascending: true });

        if (imgError) {
          console.error(`[GET /admin/gallery-albums] images error for album ${album.id}:`, imgError);
          return { ...album, images: [] };
        }

        return { ...album, images: images || [] };
      })
    );

    return res.json({ ok: true, data: albumsWithImages });
  } catch (err) {
    console.error('[GET /admin/gallery-albums] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/gallery-albums', async (req: Request, res: Response) => {
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
        .from('gallery_albums')
        .select('order')
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/gallery-albums] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    const { data, error } = await supabase
      .from('gallery_albums')
      .insert({
        title: body.title,
        slug: body.slug,
        order: orderValue,
        is_published: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/gallery-albums] insert error:', error);
      return res.status(500).json({ error: 'Failed to create gallery album' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/gallery-albums] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/gallery-albums/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data as Partial<CreatePayload>;
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.order !== undefined) updateData.order = body.order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('gallery_albums')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/gallery-albums/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update gallery album' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/gallery-albums/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/gallery-albums/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('gallery_albums')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/gallery-albums/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete gallery album' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/gallery-albums/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/gallery-albums/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('gallery_albums')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/gallery-albums/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish gallery albums' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/gallery-albums/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
