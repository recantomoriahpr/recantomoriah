-- ============================================
-- FORÇAR CRIAÇÃO DAS COLUNAS DE VÍDEO
-- Execute TODO este SQL no Supabase SQL Editor
-- ============================================

-- 1. Verificar se colunas existem
SELECT 
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND column_name IN ('video_url', 'video_id', 'is_video')
ORDER BY column_name;

-- 2. Remover colunas se existirem (para forçar recriação)
ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_url CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_id CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS is_video CASCADE;

-- 3. Criar colunas novamente
ALTER TABLE public.gallery_images 
ADD COLUMN video_url TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN video_id TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN is_video BOOLEAN NOT NULL DEFAULT false;

-- 4. Verificar se foram criadas
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND column_name IN ('video_url', 'video_id', 'is_video')
ORDER BY column_name;

-- 5. Inserir vídeo de teste
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
  '36e41aef-a775-48d6-b2cb-a2a96bd5df54',  -- Usando album_id do seu log
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
);

-- 6. Verificar se vídeo foi inserido
SELECT 
  id,
  video_url,
  video_id,
  is_video,
  alt
FROM public.gallery_images
WHERE video_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 1;

-- 7. Forçar refresh do schema
NOTIFY pgrst, 'reload schema';

-- ============================================
-- RESULTADO ESPERADO:
-- 
-- Query 4: Deve retornar 3 linhas (video_url, video_id, is_video)
-- Query 6: Deve retornar 1 vídeo de teste
-- 
-- Depois execute:
-- 1. Aguarde 30 segundos
-- 2. Reinicie servidor: pnpm dev
-- 3. Terminal deve mostrar: "✅ SELECT com colunas de vídeo funcionou!"
-- ============================================
