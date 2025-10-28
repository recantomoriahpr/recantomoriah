# 🔧 Correção: Texto Truncado ("Fachada" aparece como "Fachad")

## 🔍 Diagnóstico

O problema de truncamento pode estar em **3 lugares**:

1. **Banco de dados** - Limite de caracteres na coluna
2. **CSS** - Classes que cortam o texto
3. **JavaScript** - Código que limita string

---

## 1️⃣ VERIFICAR BANCO DE DADOS

### Passo 1: Verificar tipos de colunas

Execute no **Supabase SQL Editor**:

```sql
-- Ver estrutura das tabelas principais
SELECT 
  table_name,
  column_name,
  data_type,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'gallery_albums',
    'gallery_images',
    'hero_slides',
    'benefit_cards',
    'testimonials',
    'info_cards'
  )
  AND column_name IN ('title', 'caption', 'alt', 'description', 'cta_text')
ORDER BY table_name, column_name;
```

### Passo 2: Aumentar limite se necessário

Se alguma coluna tiver limite pequeno (ex: VARCHAR(10)), aumente:

```sql
-- Exemplo: Aumentar limite da coluna 'title' na tabela 'gallery_albums'
ALTER TABLE gallery_albums 
ALTER COLUMN title TYPE VARCHAR(255);

-- Fazer para todas as colunas de texto:
ALTER TABLE gallery_albums ALTER COLUMN title TYPE TEXT;
ALTER TABLE gallery_albums ALTER COLUMN description TYPE TEXT;

ALTER TABLE gallery_images ALTER COLUMN caption TYPE TEXT;
ALTER TABLE gallery_images ALTER COLUMN alt TYPE TEXT;

ALTER TABLE hero_slides ALTER COLUMN title TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN subtitle TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN cta_text TYPE TEXT;

ALTER TABLE benefit_cards ALTER COLUMN title TYPE TEXT;
ALTER TABLE benefit_cards ALTER COLUMN description TYPE TEXT;

ALTER TABLE testimonials ALTER COLUMN author TYPE TEXT;
ALTER TABLE testimonials ALTER COLUMN role TYPE TEXT;
ALTER TABLE testimonials ALTER COLUMN content TYPE TEXT;

ALTER TABLE info_cards ALTER COLUMN title TYPE TEXT;
ALTER TABLE info_cards ALTER COLUMN description TYPE TEXT;
```

---

## 2️⃣ VERIFICAR CSS (Classes Tailwind)

### Procurar classes que truncam:

```bash
# No terminal, execute:
grep -r "truncate\|line-clamp\|overflow-hidden.*ellipsis" src/
```

### Classes problemáticas:

- ❌ `truncate` - Corta texto em 1 linha com "..."
- ❌ `line-clamp-1` - Limita a 1 linha
- ❌ `line-clamp-2` - Limita a 2 linhas
- ❌ `max-w-[Xch]` - Limita largura em caracteres

### Solução:

Se encontrar em botões, remova:

```tsx
// ANTES (RUIM):
<Button className="truncate">
  {album.title}
</Button>

// DEPOIS (BOM):
<Button className="whitespace-normal">
  {album.title}
</Button>
```

---

## 3️⃣ VERIFICAR JAVASCRIPT

### Procurar `.slice()`, `.substring()` ou `.substr()`:

```bash
grep -r "\.slice\|\.substring\|\.substr" src/components/
```

### Exemplo de código problemático:

```typescript
// RUIM:
const title = album.title.slice(0, 10); // Corta em 10 caracteres

// BOM:
const title = album.title; // Mantém completo
```

---

## 🔍 TESTE RÁPIDO

### 1. Verificar no banco:

```sql
-- Ver dados reais
SELECT title, LENGTH(title) as tamanho
FROM gallery_albums
WHERE deleted_at IS NULL;
```

**Se `tamanho` for 7 para "Fachada"** → Problema está no banco (coluna muito pequena)  
**Se `tamanho` for 7 para "Fachada"** → Problema está no frontend (CSS ou JS)

### 2. Verificar no Admin:

1. Acesse `/admin`
2. Vá em Galeria
3. Edite um álbum chamado "Fachada"
4. Veja se o campo mostra "Fachada" completo
5. Se sim → problema está na exibição pública
6. Se não → problema está no salvamento

---

## ✅ CORREÇÃO DEFINITIVA

Execute este SQL para garantir que todas as colunas de texto sejam `TEXT` sem limite:

```sql
-- MIGRATION: Remover limites de caracteres

-- Gallery
ALTER TABLE gallery_albums ALTER COLUMN title TYPE TEXT;
ALTER TABLE gallery_albums ALTER COLUMN description TYPE TEXT;
ALTER TABLE gallery_albums ALTER COLUMN slug TYPE TEXT;

ALTER TABLE gallery_images ALTER COLUMN url TYPE TEXT;
ALTER TABLE gallery_images ALTER COLUMN caption TYPE TEXT;
ALTER TABLE gallery_images ALTER COLUMN alt TYPE TEXT;
ALTER TABLE gallery_images ALTER COLUMN video_url TYPE TEXT;

-- Hero Slides
ALTER TABLE hero_slides ALTER COLUMN image_url TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN title TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN subtitle TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN cta_text TYPE TEXT;
ALTER TABLE hero_slides ALTER COLUMN cta_link TYPE TEXT;

-- Benefit Cards
ALTER TABLE benefit_cards ALTER COLUMN icon_key TYPE TEXT;
ALTER TABLE benefit_cards ALTER COLUMN title TYPE TEXT;
ALTER TABLE benefit_cards ALTER COLUMN description TYPE TEXT;

-- Testimonials
ALTER TABLE testimonials ALTER COLUMN author TYPE TEXT;
ALTER TABLE testimonials ALTER COLUMN role TYPE TEXT;
ALTER TABLE testimonials ALTER COLUMN content TYPE TEXT;
ALTER TABLE testimonials ALTER COLUMN image_url TYPE TEXT;

-- Info Cards
ALTER TABLE info_cards ALTER COLUMN icon_key TYPE TEXT;
ALTER TABLE info_cards ALTER COLUMN title TYPE TEXT;
ALTER TABLE info_cards ALTER COLUMN description TYPE TEXT;

-- Schedules
ALTER TABLE schedules ALTER COLUMN day_label TYPE TEXT;
ALTER TABLE schedules ALTER COLUMN time_label TYPE TEXT;

-- Footer Links
ALTER TABLE footer_links ALTER COLUMN label TYPE TEXT;
ALTER TABLE footer_links ALTER COLUMN url TYPE TEXT;

-- Contact Info
ALTER TABLE contact_info ALTER COLUMN phone TYPE TEXT;
ALTER TABLE contact_info ALTER COLUMN whatsapp TYPE TEXT;
ALTER TABLE contact_info ALTER COLUMN email TYPE TEXT;
ALTER TABLE contact_info ALTER COLUMN address TYPE TEXT;

-- Site Settings
ALTER TABLE site_settings ALTER COLUMN primary_color TYPE TEXT;
ALTER TABLE site_settings ALTER COLUMN secondary_color TYPE TEXT;
ALTER TABLE site_settings ALTER COLUMN accent_color TYPE TEXT;
ALTER TABLE site_settings ALTER COLUMN background_color TYPE TEXT;
ALTER TABLE site_settings ALTER COLUMN font_family TYPE TEXT;
ALTER TABLE site_settings ALTER COLUMN logo_url TYPE TEXT;
```

---

## 🧪 TESTE APÓS CORREÇÃO

1. Execute o SQL acima
2. Vá no Admin
3. Edite o álbum para "Fachada Completa"
4. Salve
5. Vá na página pública
6. Verifique se aparece completo

---

## 📋 Checklist de Verificação

- [ ] SQL executado no Supabase
- [ ] Teste no admin: escrever "Fachada Completa" e salvar
- [ ] Teste na home: verificar se aparece completo
- [ ] Teste em botões: verificar se não corta
- [ ] Teste em títulos: verificar se não trunca
- [ ] Cache limpo (Ctrl+Shift+R)

---

**Se ainda persistir, me avise qual campo específico está truncando!**
