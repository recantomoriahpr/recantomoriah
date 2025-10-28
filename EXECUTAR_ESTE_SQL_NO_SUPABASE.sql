-- ⚠️ IMPORTANTE: Execute este SQL no Supabase Dashboard AGORA
-- Acesse: Supabase Dashboard → SQL Editor → Cole este código → Execute

-- Este SQL cria a tabela contact_info que está faltando no banco
-- Sem esta tabela, o sistema não funciona e você verá o erro:
-- "Could not find the table 'public.contact_info' in the schema cache"

CREATE TABLE IF NOT EXISTS contact_info (
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
  is_published BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT contact_info_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_info_is_published ON contact_info(is_published) WHERE deleted_at IS NULL;

-- Insert default values
INSERT INTO contact_info (
  phone,
  whatsapp,
  email,
  address,
  address_complement,
  address_reference,
  gps_coordinates,
  weekday_hours,
  saturday_hours,
  sunday_hours,
  response_time,
  instagram,
  facebook,
  linkedin,
  twitter,
  footer_brand_title,
  footer_brand_description,
  footer_copyright_text,
  footer_privacy_policy_text,
  footer_terms_of_use_text,
  is_published
) VALUES (
  '(11) 99999-9999',
  '11999999999',
  'contato@recantomoriah.com.br',
  'Estrada Rural KM 15',
  'Zona Rural',
  'Próximo ao posto de gasolina central',
  'https://maps.google.com/...',
  'Segunda a Sexta: 8h às 18h',
  'Sábados: 8h às 16h',
  'Domingos: 9h às 15h',
  'Respondemos todas as mensagens em até 2 horas durante o horário comercial.',
  'https://instagram.com/recantomoriah',
  'https://facebook.com/recantomoriah',
  '',
  '',
  'Recanto Moriah',
  'O lugar perfeito para seus momentos especiais. Natureza, conforto e estrutura completa para casamentos, retiros e eventos inesquecíveis.',
  'Recanto Moriah. Todos os direitos reservados.',
  'Política de Privacidade',
  'Termos de Uso',
  true
) ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published contact info
CREATE POLICY "Anyone can view published contact info"
  ON contact_info
  FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);

-- Policy: Authenticated users can manage contact info
CREATE POLICY "Authenticated users can manage contact info"
  ON contact_info
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ✅ APÓS EXECUTAR, REINICIE A API E O FRONTEND
-- cd apps/api && pnpm dev
-- pnpm dev:web
