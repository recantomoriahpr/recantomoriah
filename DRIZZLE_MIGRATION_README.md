# 🚀 Migração Drizzle ORM - Projeto Moriah

Este documento contém todas as instruções para migrar o banco de dados do projeto Moriah para um novo Supabase usando Drizzle ORM.

## 📋 Tabelas Incluídas

O projeto possui **11 tabelas** mapeadas:

### Conteúdo/Landing
- ✅ `site_settings` - Configurações globais (singleton)
- ✅ `hero_slides` - Carrossel principal
- ✅ `benefit_cards` - Cards de benefícios
- ✅ `gallery_albums` - Álbuns de fotos
- ✅ `gallery_images` - Imagens (FK → gallery_albums)
- ✅ `testimonials` - Depoimentos
- ✅ `info_cards` - Cards informativos
- ✅ `schedules` - Horários

### Sistema
- ✅ `contacts` - Mensagens recebidas
- ✅ `footer_links` - Links do rodapé
- ✅ `contact_info` - Contato global (singleton)

### Storage
- ✅ Bucket `recanto-moriah` - Imagens públicas

---

## 📦 1. Instalar Dependências

```bash
# Usando pnpm (recomendado)
pnpm add drizzle-orm drizzle-kit pg
pnpm add -D @types/pg

# OU usando npm
npm install drizzle-orm drizzle-kit pg
npm install --save-dev @types/pg
```

---

## 🔧 2. Configurar Variáveis de Ambiente

Crie/atualize o arquivo `.env` na raiz do projeto:

```env
# PostgreSQL Connection String (Supabase)
DATABASE_URL="postgresql://postgres.{project-ref}:{password}@aws-0-{region}.pooler.supabase.com:5432/postgres?sslmode=require"

# Alternativa: Connection Pooler (recomendado para produção)
# DATABASE_URL="postgresql://postgres.{project-ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Como obter a DATABASE_URL:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Na seção **Connection string**, copie a **URI** (não o Connection Pooler URI inicialmente)
5. Substitua `[YOUR-PASSWORD]` pela senha do banco

---

## 🗄️ 3. Aplicar Migração SQL no Supabase

### Opção A: Via SQL Editor (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo completo do arquivo `drizzle/001_init.sql`
5. Execute (Run)
6. ✅ Deve retornar sucesso sem erros

### Opção B: Via Drizzle Push (Experimental)

```bash
# ATENÇÃO: Este comando sincroniza direto sem migration files
npx drizzle-kit push
```

⚠️ **IMPORTANTE:** O comando `push` aplica mudanças diretamente no banco. Para produção, sempre revise o SQL gerado manualmente.

---

## 🪣 4. Configurar Storage (Opcional)

Se você usa uploads de imagens:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute o arquivo `supabase_storage.sql`
3. Isso criará o bucket `recanto-moriah` com políticas de acesso

---

## ✅ 5. Verificar a Instalação

### Testar Conexão:

Crie um arquivo de teste `test-db.ts`:

```typescript
import { testConnection } from './src/db';

testConnection()
  .then(() => {
    console.log('✅ Tudo funcionando!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
```

Execute:

```bash
npx tsx test-db.ts
```

### Verificar Tabelas no Supabase:

1. Vá em **Table Editor**
2. Você deve ver todas as 11 tabelas listadas
3. Clique em cada uma para verificar colunas e constraints

---

## 🎨 6. Drizzle Studio (Interface Visual)

Para visualizar e manipular dados graficamente:

```bash
npx drizzle-kit studio
```

Abrirá em: `https://local.drizzle.studio`

---

## 🔄 7. Comandos Úteis

### Gerar Migrations (futuras alterações)
```bash
npx drizzle-kit generate
```

### Aplicar Migrations Pendentes
```bash
npx drizzle-kit migrate
```

### Dropar Banco (⚠️ CUIDADO!)
```bash
npx drizzle-kit drop
```

### Verificar Status
```bash
npx drizzle-kit check
```

---

## 📚 8. Como Usar no Código

### Exemplo: Listar Hero Slides Publicados

```typescript
import { db } from './src/db';
import { heroSlides } from './src/db/schema';
import { eq, isNull, desc } from 'drizzle-orm';

// Buscar slides publicados e ativos
const slides = await db
  .select()
  .from(heroSlides)
  .where(eq(heroSlides.is_published, true))
  .where(isNull(heroSlides.deleted_at))
  .orderBy(heroSlides.order);

console.log(slides);
```

### Exemplo: Inserir Novo Benefício

```typescript
import { db } from './src/db';
import { benefitCards } from './src/db/schema';

const newCard = await db
  .insert(benefitCards)
  .values({
    icon_key: 'Leaf',
    title: 'Área Verde',
    description: 'Amplo espaço com natureza',
    order: 0,
    is_published: false,
  })
  .returning();

console.log('Card criado:', newCard);
```

### Exemplo: Buscar Galeria com Imagens

```typescript
import { db } from './src/db';
import { galleryAlbums, galleryImages } from './src/db/schema';
import { eq, isNull } from 'drizzle-orm';

const albums = await db
  .select()
  .from(galleryAlbums)
  .where(eq(galleryAlbums.is_published, true))
  .where(isNull(galleryAlbums.deleted_at))
  .orderBy(galleryAlbums.order);

// Para cada álbum, buscar imagens
for (const album of albums) {
  const images = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.album_id, album.id))
    .where(eq(galleryImages.is_published, true))
    .where(isNull(galleryImages.deleted_at))
    .orderBy(galleryImages.order);
  
  console.log(`${album.title}:`, images.length, 'fotos');
}
```

---

## 🔐 9. RLS (Row Level Security)

### Configuração Atual:

- ✅ RLS **ativado** em todas as tabelas
- ✅ Policies de **leitura pública** para conteúdo `is_published = TRUE`
- ⚠️ **Escritas** devem usar `service_role` key (bypass RLS)

### Para Admin/Escritas:

Na API, use a key `service_role`:

```typescript
// apps/api/src/lib/supabase.ts
export function getSupabaseService() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
}
```

---

## 📊 10. Padrões de Dados

### Campos Padrão em Todas as Tabelas:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
is_published BOOLEAN NOT NULL DEFAULT FALSE
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
deleted_at TIMESTAMPTZ  -- Soft delete
```

### Tabelas com Ordenação:

Incluem campo `order INTEGER NOT NULL DEFAULT 0`:
- hero_slides
- benefit_cards
- gallery_albums
- gallery_images
- testimonials
- info_cards
- schedules
- footer_links

### Singletons:

Apenas **1 registro publicado** deve existir:
- `site_settings`
- `contact_info`

---

## 🐛 11. Troubleshooting

### Erro: "relation does not exist"
- Execute novamente o `001_init.sql` no SQL Editor

### Erro: "connection refused"
- Verifique se `DATABASE_URL` está correto
- Confirme que o IP da sua máquina está permitido no Supabase

### Erro: "password authentication failed"
- Resetar senha do banco no Dashboard → Settings → Database

### Triggers não funcionando
- Certifique-se de que a função `set_updated_at()` foi criada

---

## 📝 12. Próximos Passos

1. ✅ Aplicar SQL inicial (`001_init.sql`)
2. ✅ Configurar storage (`supabase_storage.sql`)
3. ✅ Testar conexão
4. 🔄 Migrar API de `@supabase/supabase-js` para Drizzle
5. 🔄 Atualizar queries no frontend
6. ✅ Deploy

---

## 🆘 Suporte

- Documentação Drizzle: https://orm.drizzle.team
- Supabase Docs: https://supabase.com/docs
- Drizzle Discord: https://discord.gg/drizzle

---

**Criado por:** Engenheiro Full-Stack Sênior  
**Data:** 2025-01-22  
**Versão:** 1.0.0
