-- ============================================
-- SQL FINAL: Setup completo para vídeos do YouTube
-- Execute TODO este arquivo no Supabase SQL Editor
-- ============================================

-- PASSO 1: Remover colunas antigas (se existirem)
ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_url CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS video_id CASCADE;

ALTER TABLE public.gallery_images 
DROP COLUMN IF EXISTS is_video CASCADE;

-- PASSO 2: Criar colunas novas
ALTER TABLE public.gallery_images 
ADD COLUMN video_url TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN video_id TEXT;

ALTER TABLE public.gallery_images 
ADD COLUMN is_video BOOLEAN NOT NULL DEFAULT false;

-- PASSO 3: Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_video 
ON public.gallery_images(is_video) 
WHERE is_video = true;

CREATE INDEX IF NOT EXISTS idx_gallery_images_video_id 
ON public.gallery_images(video_id) 
WHERE video_id IS NOT NULL;

-- PASSO 4: Comentários
COMMENT ON COLUMN public.gallery_images.video_url IS 'URL completa do vídeo do YouTube';
COMMENT ON COLUMN public.gallery_images.video_id IS 'ID extraído do vídeo do YouTube (11 caracteres)';
COMMENT ON COLUMN public.gallery_images.is_video IS 'True se for vídeo do YouTube, false se for imagem';

-- PASSO 5: Verificar estrutura
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

-- PASSO 6: Inserir vídeo de teste
-- Primeiro, pegar um album_id válido
DO $$
DECLARE
  v_album_id UUID;
BEGIN
  -- Pegar primeiro álbum disponível
  SELECT id INTO v_album_id
  FROM public.gallery_albums 
  WHERE deleted_at IS NULL 
  ORDER BY created_at 
  LIMIT 1;
  
  -- Se encontrou álbum, inserir vídeo de teste
  IF v_album_id IS NOT NULL THEN
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
      v_album_id,
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      true,
      'Vídeo de Teste - Never Gonna Give You Up',
      'Rick Astley - Never Gonna Give You Up (Official Video)',
      999,
      true,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Vídeo de teste inserido com sucesso!';
  ELSE
    RAISE NOTICE '⚠️ Nenhum álbum encontrado. Crie um álbum primeiro.';
  END IF;
END $$;

-- PASSO 7: Verificar vídeo inserido
SELECT 
  id,
  album_id,
  url,
  video_url,
  video_id,
  is_video,
  alt,
  caption,
  is_published,
  created_at
FROM public.gallery_images
WHERE is_video = true
ORDER BY created_at DESC
LIMIT 5;

-- PASSO 8: Verificar contagem
SELECT 
  is_video,
  COUNT(*) as total
FROM public.gallery_images
WHERE deleted_at IS NULL
GROUP BY is_video;

-- ============================================
-- ✅ SUCESSO!
-- 
-- Você deve ver:
-- - 3 linhas na consulta do PASSO 5 (video_url, video_id, is_video)
-- - 1 vídeo na consulta do PASSO 7
-- - Contagem no PASSO 8 mostrando is_video=true
--
-- Próximos passos:
-- 1. Reinicie o servidor: pnpm dev
-- 2. Acesse http://localhost:5173
-- 3. Veja o console para logs de debug
-- ============================================
