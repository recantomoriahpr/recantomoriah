import { Router } from 'express';
import { getSupabaseService } from '../lib/supabase';

const router = Router();

router.get('/page', async (_req, res) => {
  const supabase = getSupabaseService();

  try {
    const [siteSettings, heroSlides, benefitCards, albums, images, testimonials, infoCards, contacts, schedules, footerLinks, contactInfo] = await Promise.all([
      supabase
        .from('site_settings')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(1),
      supabase
        .from('hero_slides')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('benefit_cards')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('gallery_albums')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      (async () => {
        // Tentar com colunas de vídeo primeiro
        console.log('[public/page] 🔍 Tentando SELECT com colunas de vídeo...');
        const withVideo = await supabase
          .from('gallery_images')
          .select('id, album_id, url, alt, caption, order, is_published, created_at, updated_at, deleted_at, video_url, video_id, is_video')
          .eq('is_published', true)
          .is('deleted_at', null)
          .order('order', { ascending: true });
        
        // Se der erro 42703 (coluna não existe), tentar sem colunas de vídeo
        if (withVideo.error) {
          if (withVideo.error.code === '42703') {
            console.warn('[public/page] ⚠️ Erro 42703: Colunas de vídeo não encontradas no schema do Supabase');
            console.warn('[public/page] 💡 SOLUÇÃO: Faça "Restart Project" no Supabase Dashboard e aguarde 2 minutos');
            console.warn('[public/page] 🔄 Usando fallback sem colunas de vídeo (site funcionará, mas sem vídeos)');
            
            const fallback = await supabase
              .from('gallery_images')
              .select('id, album_id, url, alt, caption, order, is_published, created_at, updated_at, deleted_at')
              .eq('is_published', true)
              .is('deleted_at', null)
              .order('order', { ascending: true });
            
            return fallback;
          }
          // Outro tipo de erro, retornar para ser tratado depois
          return withVideo;
        }
        
        console.log('[public/page] ✅ SELECT com colunas de vídeo funcionou!');
        return withVideo;
      })(),
      supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('info_cards')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('contacts')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('schedules')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('footer_links')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('order', { ascending: true }),
      supabase
        .from('contact_info')
        .select('*')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    // Check for query errors
    const errors = [siteSettings, heroSlides, benefitCards, albums, images, testimonials, infoCards, contacts, schedules, footerLinks, contactInfo]
      .map((r) => r.error)
      .filter(Boolean);
    if (errors.length) {
      console.error('[public/page] errors:', errors);
      return res.status(500).json({ error: 'Failed to load public content' });
    }

    // Build gallery albums with images
    const albumRows = albums.data ?? [];
    const imageRows = images.data ?? [];
    
    // Debug detalhado: Ver TODOS os campos retornados
    console.log('[public/page] 📸 Total images from DB:', imageRows.length);
    if (imageRows.length > 0) {
      console.log('[public/page] 🔍 Primeira imagem (sample):', JSON.stringify(imageRows[0], null, 2));
      console.log('[public/page] 🔑 Campos disponíveis:', Object.keys(imageRows[0]));
    }
    
    const videosFound = imageRows.filter((img: any) => img.video_url || img.is_video);
    if (videosFound.length > 0) {
      console.log('[public/page] 🎥 Vídeos encontrados:', videosFound.map((v: any) => ({
        id: v.id,
        video_url: v.video_url,
        video_id: v.video_id,
        is_video: v.is_video
      })));
    } else {
      console.log('[public/page] ⚠️ Nenhum vídeo encontrado. Campos verificados: video_url, video_id, is_video');
    }
    
    const gallery_albums = albumRows.map((a) => ({
      ...a,
      images: imageRows.filter((img: any) => img.album_id === a.id),
    }));

    // Prepare response
    const payload = {
      site_settings: siteSettings.data && siteSettings.data.length ? siteSettings.data[0] : null,
      hero_slides: heroSlides.data ?? [],
      benefit_cards: benefitCards.data ?? [],
      gallery_albums,
      gallery_images: imageRows,
      testimonials: testimonials.data ?? [],
      info_cards: infoCards.data ?? [],
      contacts: contacts.data ?? [],
      schedules: schedules.data ?? [],
      footer_links: footerLinks.data ?? [],
      contact_info: contactInfo.data && contactInfo.data.length ? contactInfo.data[0] : null,
    };

    return res.json(payload);
  } catch (err) {
    console.error('[public/page] unexpected error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
