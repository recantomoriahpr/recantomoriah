-- Adicionar coluna external_link na tabela gallery_images
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Comentário explicativo
COMMENT ON COLUMN gallery_images.external_link IS 'Link externo para redirecionamento (ex: Drive, YouTube, etc)';
