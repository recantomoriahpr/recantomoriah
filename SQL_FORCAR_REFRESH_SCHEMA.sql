-- ============================================
-- FORÇAR REFRESH DO SCHEMA DO SUPABASE
-- Execute se as colunas existem mas a API dá erro 42703
-- ============================================

-- OPÇÃO 1: Notify do PostgREST (API do Supabase)
NOTIFY pgrst, 'reload schema';

-- Aguarde 30-60 segundos

-- ============================================

-- OPÇÃO 2: Recriar as colunas (força o schema a atualizar)
-- ⚠️ CUIDADO: Isso apaga os dados das colunas!

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_url CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_id CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS is_video CASCADE;

-- Esperar 5 segundos

ALTER TABLE public.gallery_images 
ADD COLUMN video_url TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN video_id TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN is_video BOOLEAN NOT NULL DEFAULT false;

-- Adicionar índices
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_video 
ON public.gallery_images(is_video) 
WHERE is_video = true;

-- Verificar
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND column_name IN ('video_url', 'video_id', 'is_video');

-- ============================================

-- OPÇÃO 3: Re-inserir vídeo de teste
INSERT INTO public.gallery_images (
  album_id,
  url,
  video_url,
  video_id,
  is_video,
  alt,
  caption,
  "order",
  is_published,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM public.gallery_albums WHERE deleted_at IS NULL ORDER BY created_at LIMIT 1),
  'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  true,
  'Vídeo de Teste',
  'Rick Astley - Never Gonna Give You Up',
  999,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 
-- DEPOIS DE EXECUTAR:
-- 
-- 1. Aguarde 1-2 minutos
-- 2. Reinicie o servidor: pnpm dev
-- 3. Teste a API: http://localhost:8080/api/public/page
-- 
-- ============================================
