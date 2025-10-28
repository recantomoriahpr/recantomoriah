-- ============================================
-- SQL DEFINITIVO: Criar colunas video_url e is_video
-- Execute TODO este arquivo no Supabase SQL Editor
-- ============================================

-- 1. Verificar schema atual
SELECT 
  table_schema,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'gallery_images'
ORDER BY ordinal_position;

-- 2. Remover colunas se existirem (limpar antes)
ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_url CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS is_video CASCADE;

-- 3. Criar colunas (FORÇANDO no schema public)
ALTER TABLE public.gallery_images 
ADD COLUMN video_url TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN is_video BOOLEAN NOT NULL DEFAULT false;

-- 4. Adicionar comentários
COMMENT ON COLUMN public.gallery_images.video_url IS 'URL completa do vídeo do YouTube';
COMMENT ON COLUMN public.gallery_images.is_video IS 'True se for vídeo do YouTube, false se for imagem';

-- 5. Verificar se foi criado
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND column_name IN ('video_url', 'is_video');

-- 6. Inserir vídeo de teste
INSERT INTO public.gallery_images (
  album_id,
  url,
  video_url,
  is_video,
  alt,
  caption,
  "order",
  is_published,
  created_at
) VALUES (
  (SELECT id FROM public.gallery_albums WHERE deleted_at IS NULL ORDER BY created_at LIMIT 1),
  'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  true,
  'Vídeo de Teste - Rick Astley',
  'Never Gonna Give You Up',
  999,
  true,
  NOW()
);

-- 7. Verificar se foi inserido
SELECT 
  id,
  url,
  video_url,
  is_video,
  alt,
  is_published
FROM public.gallery_images
WHERE video_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- SUCESSO!
-- Se você ver o vídeo na query acima, está pronto!
-- Reinicie o servidor: pnpm dev
-- ============================================
