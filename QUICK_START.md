# ⚡ Quick Start - Drizzle Migration

Guia rápido de 5 minutos para migrar o banco de dados.

## 🚀 Passos Rápidos

### 1. Instalar Dependências (30 segundos)

```bash
pnpm add drizzle-orm drizzle-kit pg
pnpm add -D @types/pg
```

### 2. Configurar .env (1 minuto)

```bash
# Copie o exemplo
cp .env.drizzle.example .env

# Edite e adicione sua DATABASE_URL
# Obtenha em: Supabase Dashboard → Settings → Database → Connection string
```

### 3. Aplicar Migração no Supabase (2 minutos)

1. Abra: https://app.supabase.com
2. SQL Editor → New Query
3. Cole o conteúdo de `drizzle/001_init.sql`
4. Execute (Run) ✅

### 4. Configurar Storage (30 segundos)

1. SQL Editor → New Query
2. Cole o conteúdo de `supabase_storage.sql`
3. Execute (Run) ✅

### 5. Testar (30 segundos)

```bash
npx tsx test-db.ts
```

Deve exibir: **✅ TODOS OS TESTES PASSARAM!**

---

## 📦 Scripts Úteis

```bash
# Testar conexão
npx tsx test-db.ts

# Interface visual do banco
npx drizzle-kit studio

# Gerar novas migrations (futuras alterações)
npx drizzle-kit generate

# Aplicar migrations
npx drizzle-kit push
```

---

## 🎯 Uso Básico no Código

```typescript
import { db } from './src/db';
import { heroSlides } from './src/db/schema';
import { eq, isNull } from 'drizzle-orm';

// Buscar slides publicados
const slides = await db
  .select()
  .from(heroSlides)
  .where(eq(heroSlides.is_published, true))
  .where(isNull(heroSlides.deleted_at))
  .orderBy(heroSlides.order);
```

---

## 📁 Arquivos Criados

```
📦 MORIAH/
├── 📄 drizzle.config.ts          ← Configuração do Drizzle
├── 📁 src/db/
│   ├── schema.ts                 ← Definições das tabelas
│   └── index.ts                  ← Conexão com DB
├── 📁 drizzle/
│   └── 001_init.sql              ← Migração inicial (SQL)
├── 📄 supabase_storage.sql       ← Configuração de storage
├── 📄 test-db.ts                 ← Script de teste
├── 📄 drizzle-examples.ts        ← Exemplos de uso
├── 📄 .env.drizzle.example       ← Template de .env
├── 📄 DRIZZLE_MIGRATION_README.md ← Documentação completa
└── 📄 QUICK_START.md             ← Este arquivo
```

---

## ✅ Checklist

- [ ] Dependências instaladas
- [ ] `.env` configurado com `DATABASE_URL`
- [ ] SQL `001_init.sql` executado no Supabase
- [ ] SQL `supabase_storage.sql` executado
- [ ] `test-db.ts` rodando com sucesso
- [ ] 11 tabelas criadas no Supabase
- [ ] Bucket `recanto-moriah` criado

---

## 🐛 Problemas Comuns

### ❌ "connection refused"
→ Verifique `DATABASE_URL` no `.env`

### ❌ "relation does not exist"
→ Execute o SQL `001_init.sql` no Supabase

### ❌ "password authentication failed"
→ Resete a senha no Dashboard → Settings → Database

---

## 📚 Mais Informações

- **Docs Completa:** `DRIZZLE_MIGRATION_README.md`
- **Exemplos:** `drizzle-examples.ts`
- **Drizzle Docs:** https://orm.drizzle.team
- **Supabase:** https://supabase.com/docs

---

**Pronto! Seu banco está configurado com Drizzle ORM! 🎉**
