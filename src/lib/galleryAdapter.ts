import { parseYouTubeId } from './youtube';

/**
 * Tipo normalizado de item da galeria
 */
export interface GalleryItem {
  id: string;
  albumId: string;
  url: string;
  alt: string;
  caption: string;
  sortOrder: number;
  videoUrl: string | null;
  videoId: string | null;
  isVideo: boolean;
  hasVideoUrl: boolean;
  externalLink: string | null;
}

/**
 * Normaliza row do banco (snake_case) para objeto JS (camelCase)
 * Garante consistência entre video_url, video_id e is_video
 */
export function normalizeGalleryRow(row: any): GalleryItem {
  // Debug: Log entrada
  const hasVideoFields = Boolean(row.video_url || row.videoUrl || row.video_id || row.videoId || row.is_video || row.isVideo);
  if (hasVideoFields) {
    console.log('📦 [Adapter] Raw row:', {
      id: row.id,
      video_url: row.video_url,
      video_id: row.video_id,
      is_video: row.is_video,
      videoUrl: row.videoUrl,
      videoId: row.videoId,
      isVideo: row.isVideo,
    });
  }

  // Suporta tanto snake_case (do DB) quanto camelCase (já normalizado)
  const videoUrl = row.video_url ?? row.videoUrl ?? null;
  const videoId = row.video_id ?? row.videoId ?? parseYouTubeId(videoUrl);
  const isVideo = (row.is_video ?? row.isVideo ?? false) || Boolean(videoId);

  const externalLink = row.external_link ?? row.externalLink ?? null;

  const normalized = {
    id: row.id,
    albumId: row.album_id ?? row.albumId,
    url: row.url ?? '',
    alt: row.alt ?? '',
    caption: row.caption ?? '',
    sortOrder: row.sort_order ?? row.sortOrder ?? row.order ?? 0,
    videoUrl,
    videoId,
    isVideo,
    hasVideoUrl: Boolean(videoUrl),
    externalLink,
  };

  // Debug: Log saída
  if (hasVideoFields) {
    console.log('✨ [Adapter] Normalized:', {
      id: normalized.id,
      videoUrl: normalized.videoUrl,
      videoId: normalized.videoId,
      isVideo: normalized.isVideo,
      hasVideoUrl: normalized.hasVideoUrl,
    });
  }

  return normalized;
}

/**
 * Normaliza array de rows
 */
export function normalizeGalleryRows(rows: any[]): GalleryItem[] {
  return rows.map(normalizeGalleryRow);
}
