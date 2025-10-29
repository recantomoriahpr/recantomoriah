# Correção Final API Serverless - Eliminação de 500

## Problema Identificado
Os endpoints estavam retornando 500 devido a problemas de resolução de módulos com imports relativos (`../../src/server/...`) na Vercel.

## Solução Implementada

### 1. **Clientes Supabase Inline**
Cada handler agora cria seu próprio cliente Supabase diretamente, sem depender de imports externos:

```typescript
const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};
```

### 2. **TypeScript Config Otimizado**
- **`tsconfig.json`**: Voltou para `module: "ESNext"` e `moduleResolution: "Bundler"` (compatível com Vercel)
- **`api/tsconfig.json`**: Criado com `module: "CommonJS"` específico para API routes

### 3. **Vercel.json Atualizado**
Adicionada configuração explícita do runtime:
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3.0.0"
    }
  }
}
```

## Arquivos Modificados

### Handlers da API (todos atualizados com cliente inline):
- ✅ `api/admin/contact-info.ts`
- ✅ `api/admin/[resource].ts`
- ✅ `api/admin/[resource]/[id].ts`
- ✅ `api/admin/publish.ts`
- ✅ `api/admin/site-settings.ts`
- ✅ `api/public/page.ts`
- ✅ `api/diag.ts`

### Configuração:
- ✅ `tsconfig.json` - Revertido para ESNext/Bundler
- ✅ `api/tsconfig.json` - Criado para API routes
- ✅ `vercel.json` - Adicionado runtime explícito
- ✅ `src/server/env.ts` - Simplificado
- ✅ `src/server/supabase.ts` - Simplificado

## Validações

### ✅ Não há imports problemáticos
```bash
# Nenhum import @/ em /api
grep -r "from \"@/" api/

# Nenhum import de ../src/server
grep -r "from.*src/server" api/
```

### ✅ Todos os handlers são auto-suficientes
Cada arquivo:
- Importa apenas `@vercel/node` e `@supabase/supabase-js`
- Cria cliente Supabase inline via `getSupabaseClient()`
- Acessa `process.env` diretamente

## Próximos Passos

### 1. Commit e Deploy
```bash
git add .
git commit -m "fix: usar clientes Supabase inline para compatibilidade Vercel"
git push
```

### 2. Testar Endpoints
Após o deploy, testar:
- ✅ `/api/diag` → Deve retornar 200 com flags de env
- ✅ `/api/admin/site-settings` → GET deve retornar 200
- ✅ `/api/admin/hero-slides` → GET deve retornar 200
- ✅ `/api/admin/benefit-cards` → GET deve retornar 200
- ✅ `/api/admin/testimonials` → GET deve retornar 200
- ✅ `/api/admin/info-cards` → GET deve retornar 200
- ✅ `/api/admin/gallery-albums` → GET deve retornar 200
- ✅ `/api/admin/footer-links` → GET deve retornar 200
- ✅ `/api/admin/contact-info` → GET e PUT devem retornar 200

## Por Que Isso Funciona

1. **Sem dependências de caminho**: Cada handler é independente
2. **Bundler compatível**: TypeScript config otimizado para Vercel
3. **Runtime explícito**: Vercel sabe exatamente como processar as functions
4. **Process.env direto**: Sem intermediários que possam causar problemas

## Rollback (se necessário)

Se algo der errado, os arquivos `src/server/env.ts` e `src/server/supabase.ts` ainda existem e podem ser usados localmente, mas não são mais necessários para as API routes da Vercel.
