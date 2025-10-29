// api/public/page.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = getSupabaseClient();
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
        // Tentar com colunas de vídeo e external_link primeiro
        const withVideo = await supabase
          .from('gallery_images')
          .select('id, album_id, url, alt, caption, "order", is_published, created_at, updated_at, deleted_at, video_url, video_id, is_video, external_link')
          .eq('is_published', true)
          .is('deleted_at', null)
          .order('order', { ascending: true });
        
        // Se der erro 42703 (coluna não existe), tentar sem colunas de vídeo
        if (withVideo.error && withVideo.error.code === '42703') {
          const fallback = await supabase
            .from('gallery_images')
            .select('id, album_id, url, alt, caption, "order", is_published, created_at, updated_at, deleted_at')
            .eq('is_published', true)
            .is('deleted_at', null)
            .order('order', { ascending: true });
          return fallback;
        }
        
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

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).json(payload);
  } catch (e: any) {
    console.error('[public/page] unexpected error', e);
    return res.status(500).json({ error: e?.message || 'Internal Server Error' });
  }
}
