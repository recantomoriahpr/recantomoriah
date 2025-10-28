export function getYouTubeEmbedSrc(videoId: string) {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
    enablejsapi: '1',
    origin: window.location.origin,
  });
  return `${base}?${params.toString()}`;
}
