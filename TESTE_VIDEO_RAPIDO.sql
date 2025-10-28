-- TESTE RÁPIDO: Verificar se o vídeo foi salvo e publicar

-- 1. Ver todos os itens da galeria (últimos 10)
SELECT 
  id,
  album_id,
  url,
  video_url,
  is_video,
  alt,
  is_published,
  created_at
FROM gallery_images
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- 2. Se você ver um vídeo com is_published = false, PUBLIQUE:
-- (Substitua 'SEU_ID_AQUI' pelo ID do vídeo da query acima)
UPDATE gallery_images
SET is_published = true
WHERE video_url IS NOT NULL
  AND is_video = true
  AND deleted_at IS NULL;

-- 3. Verificar novamente
SELECT 
  id,
  url,
  video_url,
  is_video,
  is_published
FROM gallery_images
WHERE video_url IS NOT NULL
  AND deleted_at IS NULL;
