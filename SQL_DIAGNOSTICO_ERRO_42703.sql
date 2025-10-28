-- ============================================
-- DIAGNÓSTICO ERRO 42703: column does not exist
-- Execute cada query e veja o resultado
-- ============================================

-- 1️⃣ VERIFICAR SE COLUNAS EXISTEM NA TABELA
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

-- ✅ Se retornar 3 linhas: Colunas existem na tabela
-- ❌ Se retornar 0 linhas: Execute SQL_FINAL_VIDEO_COMPLETO.sql

-- ============================================

-- 2️⃣ VERIFICAR SE HÁ VIEWS USANDO gallery_images
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND definition ILIKE '%gallery_images%';

-- Se houver views listadas:
-- ⚠️ Essas views precisam ser recriadas incluindo os novos campos

-- ============================================

-- 3️⃣ TESTAR SELECT DIRETO (como faria a API)
SELECT 
  id, 
  album_id, 
  url, 
  alt, 
  caption, 
  "order", 
  is_published, 
  created_at, 
  updated_at, 
  deleted_at, 
  video_url, 
  video_id, 
  is_video
FROM public.gallery_images
WHERE is_published = true
  AND deleted_at IS NULL
ORDER BY "order"
LIMIT 5;

-- ✅ Se funcionar: O problema é cache do Supabase client
-- ❌ Se der erro: Problema nas permissões ou schema

-- ============================================

-- 4️⃣ VERIFICAR POLÍTICAS RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'gallery_images';

-- Se houver políticas que bloqueiam acesso a essas colunas, 
-- elas precisam ser atualizadas

-- ============================================

-- 5️⃣ VERIFICAR PERMISSÕES DA ROLE (service_role ou anon)
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND grantee IN ('postgres', 'anon', 'authenticated', 'service_role');

-- ============================================

-- 6️⃣ FORÇAR REFRESH DO SCHEMA (última tentativa)
-- ⚠️ CUIDADO: Isso pode interromper queries em execução

NOTIFY pgrst, 'reload schema';

-- Aguarde 30 segundos após executar isso
-- Depois teste a API novamente

-- ============================================
-- 
-- PRÓXIMOS PASSOS:
--
-- 1. Execute queries 1-3 acima
-- 2. Se query 1 retornar 3 linhas E query 3 funcionar:
--    → Problema é cache do Supabase
--    → Solução: Restart Project no dashboard
--
-- 3. Se query 1 retornar 0 linhas:
--    → Colunas não existem
--    → Execute: SQL_FINAL_VIDEO_COMPLETO.sql
--
-- 4. Se query 2 listar views:
--    → Execute: SQL_CORRIGIR_VIEWS.sql (será criado)
--
-- ============================================
