-- =====================================================
-- MIGRATION: 001_init.sql
-- Descrição: Criação inicial de todas as tabelas do projeto Moriah
-- Banco: PostgreSQL (Supabase)
-- ORM: Drizzle
-- =====================================================

BEGIN;

-- =====================================================
-- EXTENSÕES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FUNÇÃO GENÉRICA PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABELA: site_settings
-- Configurações globais do site (singleton - apenas 1 registro)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Visual/Branding
  logo_url TEXT,
  primary_color VARCHAR(50),
  secondary_color VARCHAR(50),
  accent_color VARCHAR(50),
  background_color VARCHAR(50),
  font_family VARCHAR(100),
  
  -- Section titles
  benefits_title VARCHAR(255),
  benefits_subtitle TEXT,
  gallery_title VARCHAR(255),
  gallery_subtitle TEXT,
  testimonials_title VARCHAR(255),
  testimonials_subtitle TEXT,
  info_title VARCHAR(255),
  info_subtitle TEXT,
  
  -- Publishing control
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_site_settings_is_published 
  ON public.site_settings(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: hero_slides
-- Slides do carrossel/hero principal
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  cta_text VARCHAR(100),
  cta_link TEXT,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_order 
  ON public.hero_slides("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hero_slides_is_published 
  ON public.hero_slides(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: benefit_cards
-- Cards de benefícios/vantagens
-- =====================================================
CREATE TABLE IF NOT EXISTS public.benefit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  icon_key VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_benefit_cards_order 
  ON public.benefit_cards("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_benefit_cards_is_published 
  ON public.benefit_cards(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER benefit_cards_updated_at
  BEFORE UPDATE ON public.benefit_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: gallery_albums
-- Álbuns/categorias de fotos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_albums_slug_unique 
  ON public.gallery_albums(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_albums_order 
  ON public.gallery_albums("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_published 
  ON public.gallery_albums(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: gallery_images
-- Imagens das galerias
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  album_id UUID NOT NULL,
  
  -- Content
  url TEXT NOT NULL,
  alt VARCHAR(255) NOT NULL,
  caption TEXT,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Foreign Key
  CONSTRAINT fk_gallery_images_album 
    FOREIGN KEY (album_id) 
    REFERENCES public.gallery_albums(id) 
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id 
  ON public.gallery_images(album_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_images_order 
  ON public.gallery_images("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_published 
  ON public.gallery_images(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: testimonials
-- Depoimentos de clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_testimonials_order 
  ON public.testimonials("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_testimonials_is_published 
  ON public.testimonials(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: info_cards
-- Cards informativos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.info_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  icon_key VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_info_cards_order 
  ON public.info_cards("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_info_cards_is_published 
  ON public.info_cards(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER info_cards_updated_at
  BEFORE UPDATE ON public.info_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: contacts
-- Mensagens/formulários de contato recebidos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact data
  phone VARCHAR(50),
  whatsapp_e164 VARCHAR(50),
  email VARCHAR(255),
  endereco_principal TEXT,
  complemento VARCHAR(255),
  link_mapa TEXT,
  
  -- Publishing (moderação)
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_contacts_is_published 
  ON public.contacts(is_published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_created_at 
  ON public.contacts(created_at DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: schedules
-- Horários/agendamentos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(255),
  description TEXT,
  footer TEXT,
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_schedules_order 
  ON public.schedules("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_schedules_is_published 
  ON public.schedules(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: footer_links
-- Links do rodapé
-- =====================================================
CREATE TABLE IF NOT EXISTS public.footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  label VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(100),
  
  -- Ordering & Publishing
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_footer_links_category 
  ON public.footer_links(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_footer_links_order 
  ON public.footer_links("order") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_footer_links_is_published 
  ON public.footer_links(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER footer_links_updated_at
  BEFORE UPDATE ON public.footer_links
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TABELA: contact_info
-- Informações de contato globais (singleton)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Information
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  email VARCHAR(255),
  
  -- Address Information
  address TEXT,
  address_complement VARCHAR(255),
  address_reference TEXT,
  gps_coordinates TEXT,
  
  -- Business Hours
  weekday_hours VARCHAR(100),
  saturday_hours VARCHAR(100),
  sunday_hours VARCHAR(100),
  response_time TEXT,
  
  -- Social Media
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  twitter VARCHAR(255),
  
  -- Footer Brand Data
  footer_brand_title VARCHAR(255),
  footer_brand_description TEXT,
  footer_copyright_text VARCHAR(255),
  footer_privacy_policy_text VARCHAR(100),
  footer_terms_of_use_text VARCHAR(100),
  
  -- Publishing Control
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Validação de email
  CONSTRAINT contact_info_email_check 
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_contact_info_is_published 
  ON public.contact_info(is_published) WHERE deleted_at IS NULL;

CREATE TRIGGER contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas de conteúdo público
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: Leitura pública de conteúdo publicado
-- NOTA: Escritas ocorrerão via service_role (bypass RLS)
-- =====================================================

-- site_settings: Leitura pública do registro publicado
CREATE POLICY "public_read_site_settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- hero_slides: Leitura pública dos slides publicados
CREATE POLICY "public_read_hero_slides"
  ON public.hero_slides
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- benefit_cards: Leitura pública dos cards publicados
CREATE POLICY "public_read_benefit_cards"
  ON public.benefit_cards
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- gallery_albums: Leitura pública dos álbuns publicados
CREATE POLICY "public_read_gallery_albums"
  ON public.gallery_albums
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- gallery_images: Leitura pública das imagens publicadas
CREATE POLICY "public_read_gallery_images"
  ON public.gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- testimonials: Leitura pública dos depoimentos publicados
CREATE POLICY "public_read_testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- info_cards: Leitura pública dos cards publicados
CREATE POLICY "public_read_info_cards"
  ON public.info_cards
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- contacts: Leitura pública dos contatos publicados (moderados)
CREATE POLICY "public_read_contacts"
  ON public.contacts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- schedules: Leitura pública dos horários publicados
CREATE POLICY "public_read_schedules"
  ON public.schedules
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- footer_links: Leitura pública dos links publicados
CREATE POLICY "public_read_footer_links"
  ON public.footer_links
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- contact_info: Leitura pública das informações publicadas
CREATE POLICY "public_read_contact_info"
  ON public.contact_info
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE AND deleted_at IS NULL);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE public.site_settings IS 'Configurações globais do site (singleton)';
COMMENT ON TABLE public.hero_slides IS 'Slides do carrossel/hero principal';
COMMENT ON TABLE public.benefit_cards IS 'Cards de benefícios/vantagens';
COMMENT ON TABLE public.gallery_albums IS 'Álbuns/categorias de fotos';
COMMENT ON TABLE public.gallery_images IS 'Imagens das galerias';
COMMENT ON TABLE public.testimonials IS 'Depoimentos de clientes';
COMMENT ON TABLE public.info_cards IS 'Cards informativos';
COMMENT ON TABLE public.contacts IS 'Mensagens de contato recebidas';
COMMENT ON TABLE public.schedules IS 'Horários/agendamentos';
COMMENT ON TABLE public.footer_links IS 'Links do rodapé';
COMMENT ON TABLE public.contact_info IS 'Informações de contato globais (singleton)';

COMMIT;

-- =====================================================
-- CHECKLIST DE ENTIDADES DETECTADAS
-- =====================================================
-- ✅ site_settings (singleton, configurações globais)
-- ✅ hero_slides (carrossel principal)
-- ✅ benefit_cards (cards de benefícios)
-- ✅ gallery_albums (álbuns/categorias)
-- ✅ gallery_images (imagens, FK → gallery_albums)
-- ✅ testimonials (depoimentos)
-- ✅ info_cards (cards informativos)
-- ✅ contacts (mensagens recebidas)
-- ✅ schedules (horários/agendamentos)
-- ✅ footer_links (links do rodapé)
-- ✅ contact_info (singleton, contato global)
-- 
-- RELACIONAMENTOS:
-- - gallery_images.album_id → gallery_albums.id (CASCADE)
-- 
-- ÍNDICES CRIADOS:
-- - Todos os campos is_published, order, slug
-- - FKs: album_id
-- - Ordenação: created_at (contacts)
-- 
-- RLS HABILITADO:
-- - Todas as tabelas com policy de leitura pública (SELECT)
-- - Escritas via service_role (bypass RLS)
-- 
-- STORAGE:
-- - Bucket: recanto-moriah (ver supabase_storage.sql)
-- =====================================================
