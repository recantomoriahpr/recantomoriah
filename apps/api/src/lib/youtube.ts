/**
 * Extrai o ID do vídeo do YouTube de uma URL ou string
 */
export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null;
  
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    // Tentar parsear como URL
    const url = new URL(trimmed);
    
    // youtu.be/{id}
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id || null;
    }
    
    // youtube.com/watch?v={id}
    if (url.searchParams.get('v')) {
      return url.searchParams.get('v');
    }
    
    // youtube.com/embed/{id} ou youtube.com/shorts/{id}
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'embed' || parts[0] === 'shorts') {
      return parts[1] || null;
    }
  } catch {
    // Não é URL válida, pode ser só o ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
  }
  
  return null;
}

/**
 * Gera URL de thumbnail do YouTube
 */
export function getYouTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
