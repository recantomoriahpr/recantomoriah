# 🎯 COMANDOS COMPLETOS - Copy & Paste Ready

Todos os comandos necessários para migração, em ordem sequencial.

---

## 📦 PASSO 1: Instalar Dependências

```bash
# Instalar Drizzle ORM e dependências
pnpm add drizzle-orm drizzle-kit pg

# Instalar types
pnpm add -D @types/pg tsx
```

---

## 🔧 PASSO 2: Configurar .env

Crie o arquivo `.env` na raiz do projeto com:

```env
# DATABASE_URL - Obtenha no Supabase Dashboard → Settings → Database → Connection string
DATABASE_URL="postgresql://postgres.{project-ref}:{password}@aws-0-{region}.pooler.supabase.com:5432/postgres?sslmode=require"

# Exemplo real (substitua os valores):
# DATABASE_URL="postgresql://postgres.abcdefghijklmnop:SuaSenhaAqui123@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

**Como obter a DATABASE_URL:**
1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: **Settings** → **Database**
4. Na seção **Connection string**, copie a **URI**
5. Substitua `[YOUR-PASSWORD]` pela sua senha

---

## 🗄️ PASSO 3: Aplicar Migração no Supabase

### 3.1 - Executar SQL Principal

1. Acesse: https://app.supabase.com
2. Clique em **SQL Editor**
3. Clique em **New Query**
4. Abra o arquivo: `drizzle/001_init.sql`
5. Copie TODO o conteúdo
6. Cole no SQL Editor
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. ✅ Deve aparecer "Success. No rows returned"

### 3.2 - Executar SQL do Storage

1. No **SQL Editor**, clique em **New Query**
2. Abra o arquivo: `supabase_storage.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **Run**
6. ✅ Deve aparecer "Success"

---

## ✅ PASSO 4: Testar Conexão

```bash
# Executar script de teste
pnpm db:test

# OU diretamente
npx tsx test-db.ts
```

**Resultado esperado:**
```
🔍 Testando conexão com banco de dados...

📡 Teste 1: Verificando conexão...
✅ Database connection successful
📊 Teste 2: Executando query de teste...
   ⏰ Hora do servidor: 2025-01-22T...
   🐘 PostgreSQL versão: PostgreSQL 15.x

📋 Teste 3: Verificando tabelas criadas...
   ✅ 11 tabelas encontradas:
      - benefit_cards
      - contact_info
      - contacts
      - footer_links
      - gallery_albums
      - gallery_images
      - hero_slides
      - info_cards
      - schedules
      - site_settings
      - testimonials

🔐 Teste 4: Verificando Row Level Security...
   ✅ RLS ativado em 11 tabelas

✅ TODOS OS TESTES PASSARAM!
```

---

## 🎨 PASSO 5: Abrir Interface Visual (Opcional)

```bash
# Abrir Drizzle Studio (interface gráfica para visualizar/editar dados)
pnpm db:studio

# OU
npx drizzle-kit studio
```

Acesse: **https://local.drizzle.studio**

---

## 📊 COMANDOS ÚTEIS DO DIA A DIA

```bash
# Testar conexão com banco
pnpm db:test

# Abrir interface visual
pnpm db:studio

# Gerar nova migration (após alterar schema.ts)
pnpm db:generate

# Aplicar mudanças direto no banco (CUIDADO!)
pnpm db:push

# Ver status das migrations
npx drizzle-kit check

# Visualizar SQL que seria aplicado
npx drizzle-kit push --dry-run
```

---

## 🔍 VERIFICAÇÃO MANUAL NO SUPABASE

### Verificar Tabelas
1. Acesse: Supabase Dashboard
2. Vá em: **Table Editor**
3. ✅ Deve listar **11 tabelas**:
   - benefit_cards
   - contact_info
   - contacts
   - footer_links
   - gallery_albums
   - gallery_images
   - hero_slides
   - info_cards
   - schedules
   - site_settings
   - testimonials

### Verificar Storage
1. Vá em: **Storage**
2. ✅ Deve existir o bucket: **recanto-moriah** (público)

### Verificar RLS
1. Vá em: **Authentication** → **Policies**
2. Selecione qualquer tabela
3. ✅ Deve ter policy: `public_read_{table_name}`

---

## 💻 EXEMPLO DE USO NO CÓDIGO

Crie um arquivo de teste `test-query.ts`:

```typescript
import { db } from './src/db';
import { heroSlides, benefitCards } from './src/db/schema';
import { eq, isNull } from 'drizzle-orm';

async function testQueries() {
  // 1. Buscar slides publicados
  const slides = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.is_published, true))
    .where(isNull(heroSlides.deleted_at))
    .orderBy(heroSlides.order);
  
  console.log('Slides:', slides);

  // 2. Inserir novo benefit card
  const [newCard] = await db
    .insert(benefitCards)
    .values({
      icon_key: 'Leaf',
      title: 'Área Verde',
      description: 'Ampla área verde com natureza',
      order: 0,
      is_published: false,
    })
    .returning();
  
  console.log('Novo card:', newCard);

  // 3. Buscar todos os cards
  const cards = await db
    .select()
    .from(benefitCards)
    .where(isNull(benefitCards.deleted_at))
    .orderBy(benefitCards.order);
  
  console.log('Total de cards:', cards.length);
}

testQueries()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Execute:
```bash
npx tsx test-query.ts
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### ❌ Erro: "connection refused"
```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Se estiver vazio, configure o .env
cp .env.drizzle.example .env
# Edite o .env e adicione sua DATABASE_URL
```

### ❌ Erro: "relation does not exist"
```bash
# Executar SQL de migração no Supabase
# Abra: drizzle/001_init.sql
# Cole no SQL Editor e execute
```

### ❌ Erro: "password authentication failed"
```bash
# Resetar senha do banco
# 1. Supabase Dashboard → Settings → Database
# 2. Clique em "Reset database password"
# 3. Copie a nova senha
# 4. Atualize DATABASE_URL no .env
```

### ❌ Erro: "Cannot find module 'drizzle-orm'"
```bash
# Instalar dependências novamente
pnpm install

# OU forçar reinstalação
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ Erro: "ECONNREFUSED ::1:5432"
```bash
# DATABASE_URL está apontando para localhost
# Corrija para usar o host do Supabase
# Formato correto:
# DATABASE_URL="postgresql://postgres.{ref}:{pass}@aws-0-{region}.pooler.supabase.com:5432/postgres"
```

---

## 📋 CHECKLIST FINAL

```
✅ INSTALAÇÃO
[ ] pnpm add drizzle-orm drizzle-kit pg
[ ] pnpm add -D @types/pg tsx

✅ CONFIGURAÇÃO
[ ] .env criado com DATABASE_URL
[ ] DATABASE_URL validado (copia do Supabase)

✅ MIGRAÇÃO
[ ] 001_init.sql executado no Supabase
[ ] supabase_storage.sql executado no Supabase

✅ VALIDAÇÃO
[ ] pnpm db:test passou todos os testes
[ ] 11 tabelas visíveis no Table Editor
[ ] Bucket recanto-moriah criado
[ ] RLS habilitado em todas as tabelas

✅ DESENVOLVIMENTO
[ ] pnpm db:studio abre interface visual
[ ] Queries de exemplo funcionando
[ ] API conectando ao banco via Drizzle
```

---

## 🎉 PRONTO!

Seu banco de dados está migrado e funcionando com Drizzle ORM!

### Próximos passos:
1. ✅ Começar a desenvolver com Drizzle
2. ✅ Migrar código existente do Supabase-JS para Drizzle
3. ✅ Adicionar novas features
4. ✅ Deploy para produção

### Documentação adicional:
- **Guia completo:** `DRIZZLE_MIGRATION_README.md`
- **Início rápido:** `QUICK_START.md`
- **Exemplos:** `drizzle-examples.ts`
- **Resumo:** `MIGRATION_SUMMARY.md`

---

**✨ Boa sorte com o projeto Moriah! ✨**
