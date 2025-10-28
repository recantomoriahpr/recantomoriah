/**
 * Extrai o ID do vídeo do YouTube de uma URL ou string
 * Suporta: watch?v=, youtu.be/, shorts/, embed/, IDs diretos
 */
export function parseYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    // ID direto (11 chars comuns)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    const u = new URL(trimmed);
    
    // youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v');
    }
    
    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return u.pathname.split('/')[1] || null;
    }
    
    // youtube.com/shorts/ID
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      const parts = u.pathname.split('/');
      return parts[2] ? parts[2] : parts[1];
    }
    
    // youtube.com/embed/ID
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return u.pathname.split('/')[2] || null;
    }

    return null;
  } catch { 
    return null; 
  }
}

/**
 * Gera URL de embed do YouTube (privacy-enhanced)
 */
export function getYouTubeEmbedSrc(videoId: string, useApi = false): string {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(useApi ? { enablejsapi: '1', origin: window.location.origin } : {})
  });
  return `${base}?${params.toString()}`;
}

/**
 * Gera URL de embed do YouTube (compatibilidade)
 */
export function toYouTubeEmbedUrl(id: string): string {
  return getYouTubeEmbedSrc(id);
}

/**
 * Gera URL de thumbnail do YouTube
 */
export function getYouTubeThumbnail(id: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  
  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
}
