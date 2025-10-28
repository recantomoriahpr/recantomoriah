-- Migration: Adicionar suporte a vídeos do YouTube na galeria
-- Execute este SQL no Supabase SQL Editor

-- Adicionar colunas para suporte a vídeos
ALTER TABLE gallery_images
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false;

-- Comentários nas colunas
COMMENT ON COLUMN gallery_images.video_url IS 'URL do vídeo do YouTube (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)';
COMMENT ON COLUMN gallery_images.is_video IS 'Se true, este item é um vídeo; se false, é uma imagem';

-- Atualizar registros existentes para garantir que is_video = false
UPDATE gallery_images
SET is_video = false
WHERE is_video IS NULL;
