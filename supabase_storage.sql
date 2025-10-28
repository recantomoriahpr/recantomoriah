-- =====================================================
-- SUPABASE STORAGE CONFIGURATION
-- Criação e configuração de buckets para armazenamento
-- =====================================================

BEGIN;

-- =====================================================
-- BUCKET: recanto-moriah
-- Bucket público para imagens do site
-- =====================================================

-- Verificar se o bucket já existe e criar se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'recanto-moriah'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'recanto-moriah',
      'recanto-moriah',
      TRUE, -- Bucket público
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- =====================================================
-- POLÍTICAS DE ACESSO AO STORAGE
-- =====================================================

-- Policy: Todos podem ler (bucket público)
CREATE POLICY IF NOT EXISTS "public_read_recanto_moriah"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'recanto-moriah');

-- Policy: Apenas authenticated podem fazer upload
CREATE POLICY IF NOT EXISTS "authenticated_upload_recanto_moriah"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recanto-moriah');

-- Policy: Apenas authenticated podem atualizar seus próprios arquivos
CREATE POLICY IF NOT EXISTS "authenticated_update_recanto_moriah"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recanto-moriah');

-- Policy: Apenas authenticated podem deletar
CREATE POLICY IF NOT EXISTS "authenticated_delete_recanto_moriah"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'recanto-moriah');

COMMIT;

-- =====================================================
-- MAPEAMENTO DE BUCKETS ↔ COLUNAS
-- =====================================================
-- 
-- BUCKET: recanto-moriah
-- Usado nas seguintes colunas:
-- 
-- 1. site_settings.logo_url
--    - Logo/marca do site
-- 
-- 2. hero_slides.image_url
--    - Imagens dos slides do carrossel principal
-- 
-- 3. gallery_images.url
--    - Fotos das galerias/álbuns
-- 
-- OBSERVAÇÕES:
-- - Todas as imagens são públicas (bucket público)
-- - Upload feito via rota /api/upload (apps/api/src/routes/upload.ts)
-- - Formato do path: YYYY-MM-DDTHH-MM-SS-{UUID}-{filename}
-- - Tipos aceitos: JPEG, PNG, WebP, GIF
-- - Tamanho máximo: 10MB por arquivo
-- 
-- =====================================================
