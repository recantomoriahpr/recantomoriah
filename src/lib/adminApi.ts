import { apiFetch, API_BASE } from '@/lib/api';

export type HeroSlideApi = {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  order: number;
  is_published?: boolean;
  deleted_at?: string | null;
};

export type HeroSlidePayload = Partial<{
  image_url: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  order: number;
}>;

async function handleJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || '';
  if (!ct.toLowerCase().startsWith('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Unexpected response content-type: ${ct}`);
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to parse JSON response');
  }
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data as T;
}

export async function listHeroSlides(): Promise<{ ok?: boolean; data: HeroSlideApi[] } | any> {
  const res = await apiFetch(`/admin/hero-slides`, { method: 'GET' });
  return handleJson(res);
}

export async function createHeroSlide(payload: HeroSlidePayload): Promise<{ ok?: boolean; data: HeroSlideApi } | any> {
  const res = await apiFetch(`/admin/hero-slides`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function updateHeroSlide(id: string, payload: HeroSlidePayload): Promise<{ ok?: boolean; data: HeroSlideApi } | any> {
  const res = await apiFetch(`/admin/hero-slides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function deleteHeroSlide(id: string): Promise<{ ok?: boolean; data: HeroSlideApi } | any> {
  const res = await apiFetch(`/admin/hero-slides/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishHeroSlides(): Promise<{ ok?: boolean; data: HeroSlideApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'hero_slides', action: 'publish' })
  });
  return handleJson(res);
}

// Site Settings (Brand/Theme)
export type SiteSettingsApi = {
  id: string;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  background_color: string | null;
  font_family: string | null;
  logo_url: string | null;
  benefits_title: string | null;
  benefits_subtitle: string | null;
  gallery_title: string | null;
  gallery_subtitle: string | null;
  testimonials_title: string | null;
  testimonials_subtitle: string | null;
  info_title: string | null;
  info_subtitle: string | null;
  is_published?: boolean;
  published_at?: string | null;
};

export type SiteSettingsPayload = Partial<{
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  background_color: string | null;
  font_family: string | null;
  logo_url: string | null;
  benefits_title: string | null;
  benefits_subtitle: string | null;
  gallery_title: string | null;
  gallery_subtitle: string | null;
  testimonials_title: string | null;
  testimonials_subtitle: string | null;
  info_title: string | null;
  info_subtitle: string | null;
}>;

export async function getSiteSettings(): Promise<{ ok?: boolean; data: SiteSettingsApi } | any> {
  const res = await apiFetch(`/admin/site-settings`, { method: 'GET' });
  return handleJson(res);
}

export async function updateSiteSettings(payload: SiteSettingsPayload): Promise<{ ok?: boolean; data: SiteSettingsApi } | any> {
  const res = await apiFetch(`/admin/site-settings`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function publishSiteSettings(): Promise<{ ok?: boolean; data: SiteSettingsApi } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'site_settings', action: 'publish' })
  });
  return handleJson(res);
}

// Publish all sections at once
export async function publishAll(): Promise<{ ok?: boolean } | any> {
  const resources = [
    'site_settings', 'hero_slides', 'benefit_cards', 'testimonials', 
    'info_cards', 'gallery_albums', 'gallery_images', 'footer_links', 
    'contact_info', 'schedules'
  ];
  
  const promises = resources.map(resource => 
    apiFetch(`/admin/publish`, { 
      method: 'POST',
      body: JSON.stringify({ resource, action: 'publish' })
    })
  );
  
  const results = await Promise.allSettled(promises);
  const responses = await Promise.all(
    results.map(async (result, index) => {
      if (result.status === 'fulfilled') {
        const json = await result.value.json();
        return { resource: resources[index], ...json };
      } else {
        return { resource: resources[index], ok: false, error: result.reason };
      }
    })
  );
  
  return { ok: true, results: responses };
}

// Benefit Cards
export type BenefitCardApi = {
  id: string;
  icon: string | null;
  title: string | null;
  description: string | null;
  order: number;
  is_published?: boolean;
};

export async function listBenefitCards(): Promise<{ ok?: boolean; data: BenefitCardApi[] } | any> {
  const res = await apiFetch(`/admin/benefit-cards`, { method: 'GET' });
  return handleJson(res);
}

export async function createBenefitCard(payload: any): Promise<{ ok?: boolean; data: BenefitCardApi } | any> {
  const res = await apiFetch(`/admin/benefit-cards`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateBenefitCard(id: string, payload: any): Promise<{ ok?: boolean; data: BenefitCardApi } | any> {
  const res = await apiFetch(`/admin/benefit-cards/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteBenefitCard(id: string): Promise<{ ok?: boolean; data: BenefitCardApi } | any> {
  const res = await apiFetch(`/admin/benefit-cards/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishBenefitCards(): Promise<{ ok?: boolean; data: BenefitCardApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'benefit_cards', action: 'publish' })
  });
  return handleJson(res);
}

// Testimonials
export type TestimonialApi = {
  id: string;
  name: string | null;
  role: string | null;
  text: string | null;
  rating: number | null;
  order: number;
  is_published?: boolean;
};

export async function listTestimonials(): Promise<{ ok?: boolean; data: TestimonialApi[] } | any> {
  const res = await apiFetch(`/admin/testimonials`, { method: 'GET' });
  return handleJson(res);
}

export async function createTestimonial(payload: any): Promise<{ ok?: boolean; data: TestimonialApi } | any> {
  const res = await apiFetch(`/admin/testimonials`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateTestimonial(id: string, payload: any): Promise<{ ok?: boolean; data: TestimonialApi } | any> {
  const res = await apiFetch(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteTestimonial(id: string): Promise<{ ok?: boolean; data: TestimonialApi } | any> {
  const res = await apiFetch(`/admin/testimonials/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishTestimonials(): Promise<{ ok?: boolean; data: TestimonialApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'testimonials', action: 'publish' })
  });
  return handleJson(res);
}

// Info Cards (Practical Info)
export type InfoCardApi = {
  id: string;
  icon_key: string | null;
  title: string | null;
  description: string | null;
  order: number;
  is_published?: boolean;
};

export async function listInfoCards(): Promise<{ ok?: boolean; data: InfoCardApi[] } | any> {
  const res = await apiFetch(`/admin/info-cards`, { method: 'GET' });
  return handleJson(res);
}

export async function createInfoCard(payload: any): Promise<{ ok?: boolean; data: InfoCardApi } | any> {
  const res = await apiFetch(`/admin/info-cards`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateInfoCard(id: string, payload: any): Promise<{ ok?: boolean; data: InfoCardApi } | any> {
  const res = await apiFetch(`/admin/info-cards/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteInfoCard(id: string): Promise<{ ok?: boolean; data: InfoCardApi } | any> {
  const res = await apiFetch(`/admin/info-cards/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishInfoCards(): Promise<{ ok?: boolean; data: InfoCardApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'info_cards', action: 'publish' })
  });
  return handleJson(res);
}

// Gallery Albums
export type GalleryAlbumApi = {
  id: string;
  title: string | null;
  description: string | null;
  order: number;
  is_published?: boolean;
};

export async function listGalleryAlbums(): Promise<{ ok?: boolean; data: GalleryAlbumApi[] } | any> {
  const res = await apiFetch(`/admin/gallery-albums`, { method: 'GET' });
  return handleJson(res);
}

export async function createGalleryAlbum(payload: any): Promise<{ ok?: boolean; data: GalleryAlbumApi } | any> {
  const res = await apiFetch(`/admin/gallery-albums`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateGalleryAlbum(id: string, payload: any): Promise<{ ok?: boolean; data: GalleryAlbumApi } | any> {
  const res = await apiFetch(`/admin/gallery-albums/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteGalleryAlbum(id: string): Promise<{ ok?: boolean; data: GalleryAlbumApi } | any> {
  const res = await apiFetch(`/admin/gallery-albums/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishGalleryAlbums(): Promise<{ ok?: boolean; data: GalleryAlbumApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'gallery_albums', action: 'publish' })
  });
  return handleJson(res);
}

// Gallery Images
export type GalleryImageApi = {
  id: string;
  album_id: string | null;
  url: string | null;
  alt: string | null;
  caption: string | null;
  order: number;
  external_link?: string | null;
  is_published?: boolean;
};

export async function listGalleryImages(albumId?: string): Promise<{ ok?: boolean; data: GalleryImageApi[] } | any> {
  const url = albumId ? `/admin/gallery-images?album_id=${albumId}` : `/admin/gallery-images`;
  const res = await apiFetch(url, { method: 'GET' });
  return handleJson(res);
}

export async function createGalleryImage(payload: any): Promise<{ ok?: boolean; data: GalleryImageApi } | any> {
  const res = await apiFetch(`/admin/gallery-images`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateGalleryImage(id: string, payload: any): Promise<{ ok?: boolean; data: GalleryImageApi } | any> {
  const res = await apiFetch(`/admin/gallery-images/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteGalleryImage(id: string): Promise<{ ok?: boolean; data: GalleryImageApi } | any> {
  const res = await apiFetch(`/admin/gallery-images/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishGalleryImages(): Promise<{ ok?: boolean; data: GalleryImageApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'gallery_images', action: 'publish' })
  });
  return handleJson(res);
}

// Footer Links
export type FooterLinkApi = {
  id: string;
  label: string | null;
  url: string | null;
  order: number;
  is_published?: boolean;
};

export async function listFooterLinks(): Promise<{ ok?: boolean; data: FooterLinkApi[] } | any> {
  const res = await apiFetch(`/admin/footer-links`, { method: 'GET' });
  return handleJson(res);
}

export async function createFooterLink(payload: any): Promise<{ ok?: boolean; data: FooterLinkApi } | any> {
  const res = await apiFetch(`/admin/footer-links`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateFooterLink(id: string, payload: any): Promise<{ ok?: boolean; data: FooterLinkApi } | any> {
  const res = await apiFetch(`/admin/footer-links/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteFooterLink(id: string): Promise<{ ok?: boolean; data: FooterLinkApi } | any> {
  const res = await apiFetch(`/admin/footer-links/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishFooterLinks(): Promise<{ ok?: boolean; data: FooterLinkApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'footer_links', action: 'publish' })
  });
  return handleJson(res);
}

// Schedules
export type ScheduleApi = {
  id: string;
  day_label: string | null;
  hours: string | null;
  order: number;
  is_published?: boolean;
};

export async function listSchedules(): Promise<{ ok?: boolean; data: ScheduleApi[] } | any> {
  const res = await apiFetch(`/admin/schedules`, { method: 'GET' });
  return handleJson(res);
}

export async function createSchedule(payload: any): Promise<{ ok?: boolean; data: ScheduleApi } | any> {
  const res = await apiFetch(`/admin/schedules`, { method: 'POST', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function updateSchedule(id: string, payload: any): Promise<{ ok?: boolean; data: ScheduleApi } | any> {
  const res = await apiFetch(`/admin/schedules/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleJson(res);
}

export async function deleteSchedule(id: string): Promise<{ ok?: boolean; data: ScheduleApi } | any> {
  const res = await apiFetch(`/admin/schedules/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

export async function publishSchedules(): Promise<{ ok?: boolean; data: ScheduleApi[] } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'schedules', action: 'publish' })
  });
  return handleJson(res);
}

// Contacts (form submissions - read only for admin)
export type ContactApi = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  created_at: string;
};

export async function listContacts(): Promise<{ ok?: boolean; data: ContactApi[] } | any> {
  const res = await apiFetch(`/admin/contacts`, { method: 'GET' });
  return handleJson(res);
}

export async function deleteContact(id: string): Promise<{ ok?: boolean } | any> {
  const res = await apiFetch(`/admin/contacts/${id}`, { method: 'DELETE' });
  return handleJson(res);
}

// Contact Info (company information)
export type ContactInfoApi = {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  address_complement: string | null;
  address_reference: string | null;
  gps_coordinates: string | null;
  weekday_hours: string | null;
  saturday_hours: string | null;
  sunday_hours: string | null;
  response_time: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  twitter: string | null;
  footer_brand_title: string | null;
  footer_brand_description: string | null;
  footer_copyright_text: string | null;
  footer_privacy_policy_text: string | null;
  footer_terms_of_use_text: string | null;
  is_published?: boolean;
};

export async function getContactInfo(): Promise<{ ok?: boolean; data: ContactInfoApi } | any> {
  const res = await apiFetch(`/admin/contact-info`, { method: 'GET' });
  return handleJson(res);
}

export async function updateContactInfo(payload: Partial<ContactInfoApi>): Promise<{ ok?: boolean; data: ContactInfoApi } | any> {
  const res = await apiFetch(`/admin/contact-info`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function publishContactInfo(): Promise<{ ok?: boolean; data: ContactInfoApi } | any> {
  const res = await apiFetch(`/admin/publish`, { 
    method: 'POST',
    body: JSON.stringify({ resource: 'contact_info', action: 'publish' })
  });
  return handleJson(res);
}
