import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

const CreateSchema = z.object({
  album_id: z.string().uuid(),
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
  video_url: z.string().url().optional(),
  video_id: z.string().optional(),
  is_video: z.boolean().optional(),
  external_link: z.string().optional(),
});

const UpdateSchema = CreateSchema.omit({ album_id: true }).partial();

type CreatePayload = z.infer<typeof CreateSchema>;

router.get('/gallery-images', async (req: Request, res: Response) => {
  try {
    const { album_id } = req.query;
    const supabase = getSupabaseService();
    
    let query = supabase
      .from('gallery_images')
      .select('*')
      .is('deleted_at', null)
      .order('order', { ascending: true });

    if (album_id) {
      query = query.eq('album_id', album_id as string);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /admin/gallery-images] error:', error);
      return res.status(500).json({ error: 'Failed to fetch gallery images' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[GET /admin/gallery-images] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/gallery-images', async (req: Request, res: Response) => {
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
        .from('gallery_images')
        .select('order')
        .eq('album_id', body.album_id)
        .is('deleted_at', null)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (maxErr) {
        console.error('[POST /admin/gallery-images] max order error:', maxErr);
        return res.status(500).json({ error: 'Failed to compute order' });
      }
      orderValue = maxRow?.order != null ? (maxRow.order as number) + 1 : 0;
    }

    // Processar vídeo do YouTube se fornecido
    const videoUrl = body.video_url || null;
    const videoId = videoUrl ? require('../lib/youtube').parseYouTubeId(videoUrl) : null;
    const isVideo = Boolean(videoId);

    console.log('[POST /admin/gallery-images] 🎥 Video data:', { 
      receivedVideoUrl: body.video_url,
      processedVideoUrl: videoUrl, 
      extractedVideoId: videoId, 
      isVideo,
      fullBody: body 
    });

    const insertData: any = {
      album_id: body.album_id,
      url: body.url,
      alt: body.alt,
      caption: body.caption,
      order: orderValue,
      is_published: false,
      video_url: videoUrl,
      video_id: videoId,
      is_video: isVideo,
      external_link: body.external_link,
    };

    const { data, error } = await supabase
      .from('gallery_images')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('[POST /admin/gallery-images] insert error:', error);
      return res.status(500).json({ error: 'Failed to create gallery image' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/gallery-images] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/gallery-images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const body = parsed.data;
    
    // Processar vídeo do YouTube se fornecido
    const videoUrl = body.video_url !== undefined ? body.video_url : undefined;
    const videoId = videoUrl ? require('../lib/youtube').parseYouTubeId(videoUrl) : undefined;
    const isVideo = videoId !== undefined ? Boolean(videoId) : undefined;

    console.log('[PUT /admin/gallery-images/:id] 🎥 Video update:', { 
      receivedVideoUrl: body.video_url,
      processedVideoUrl: videoUrl, 
      extractedVideoId: videoId, 
      isVideo,
      fullBody: body 
    });

    const updateData: Record<string, unknown> = {};
    if (body.url !== undefined) updateData.url = body.url;
    if (body.alt !== undefined) updateData.alt = body.alt;
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.order !== undefined) updateData.order = body.order;
    if (videoUrl !== undefined) updateData.video_url = videoUrl;
    if (videoId !== undefined) updateData.video_id = videoId;
    if (isVideo !== undefined) updateData.is_video = isVideo;
    if (body.external_link !== undefined) updateData.external_link = body.external_link;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[PUT /admin/gallery-images/:id] update error:', error);
      return res.status(500).json({ error: 'Failed to update gallery image' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[PUT /admin/gallery-images/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/gallery-images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseService();

    const { data, error } = await supabase
      .from('gallery_images')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[DELETE /admin/gallery-images/:id] soft delete error:', error);
      return res.status(500).json({ error: 'Failed to delete gallery image' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[DELETE /admin/gallery-images/:id] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/gallery-images/publish', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('gallery_images')
      .update({ is_published: true })
      .is('deleted_at', null)
      .select('*');

    if (error) {
      console.error('[POST /admin/gallery-images/publish] publish error:', error);
      return res.status(500).json({ error: 'Failed to publish gallery images' });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[POST /admin/gallery-images/publish] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
