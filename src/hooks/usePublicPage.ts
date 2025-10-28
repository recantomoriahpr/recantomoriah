import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

export type PublicPage = {
  site_settings: {
    primary_color: string | null;
    secondary_color: string | null;
    accent_color: string | null;
    background_color: string | null;
    font_family: string | null;
    logo_url: string | null;
  } | null;
  hero_slides: Array<{
    id: string;
    image_url: string;
    title: string | null;
    subtitle: string | null;
    cta_text: string | null;
    cta_link: string | null;
    order: number;
  }>;
  // keep remaining keys untyped for now
  [key: string]: unknown;
};

export function usePublicPage() {
  return useQuery({
    queryKey: ['public-page'],
    queryFn: () => apiGet<PublicPage>('/public/page'),
    staleTime: 60_000,
  });
}
