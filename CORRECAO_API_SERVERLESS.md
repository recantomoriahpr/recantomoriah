# Correção de API Serverless - Eliminação de 500 nos Endpoints

## Resumo das Alterações

### 1. Estrutura de Servidor Centralizada
Criados arquivos para gerenciar configuração de ambiente e clientes Supabase:

- **`src/server/env.ts`**: Helper para validar e acessar variáveis de ambiente de forma segura
- **`src/server/supabase.ts`**: Clientes Supabase centralizados (`supabaseAdmin` e `supabaseAnon`)

### 2. Configuração TypeScript Atualizada
**`tsconfig.json`** foi atualizado para suportar Node/Serverless Functions:
- `module`: "NodeNext"
- `moduleResolution`: "NodeNext"
- `types`: ["node"] (removido "vite/client" para evitar conflitos)
- `strict`: true

### 3. Endpoints Atualizados
Todos os handlers em `/api` foram padronizados:

#### Endpoints Admin (usam `supabaseAdmin`):
- `/api/admin/contact-info.ts` ✅
- `/api/admin/[resource].ts` ✅
- `/api/admin/[resource]/[id].ts` ✅
- `/api/admin/publish.ts` ✅
- `/api/admin/site-settings.ts` ✅
- `/api/admin/upload.ts` ✅
- `/api/admin/upload-multiple.ts` ✅

#### Endpoints Públicos (usam `supabaseAnon`):
- `/api/public/page.ts` ✅

#### Endpoint de Diagnóstico:
- `/api/diag.ts` ✅ (novo)

### 4. Padrão de Handler
Todos os handlers seguem o padrão:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/server/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // ... lógica
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('[API ERROR]', req.url, e?.message, e?.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

### 5. Validações Realizadas
✅ Nenhum import `@/` em `/api` (grep retornou 0 resultados)
✅ Nenhuma referência a `vite/client` em `/api`
✅ Nenhum acesso direto a `process.env` em `/api` (todos usam `src/server/env.ts`)
✅ `@types/node` e `@vercel/node` já instalados

## Próximos Passos

1. **Commit e Deploy**:
   ```bash
   git add .
   git commit -m "fix: padronizar API serverless e eliminar 500s"
   git push
   ```

2. **Testar na Vercel**:
   - GET `/api/diag` → deve retornar 200 com flags de env
   - GET `/api/admin/contact-info` → deve retornar 200
   - GET `/api/admin/hero-slides` → deve retornar 200
   - GET `/api/admin/benefit-cards` → deve retornar 200
   - GET `/api/admin/testimonials` → deve retornar 200
   - GET `/api/admin/info-cards` → deve retornar 200
   - GET `/api/admin/gallery-albums` → deve retornar 200
   - GET `/api/admin/footer-links` → deve retornar 200

3. **Verificar Variáveis de Ambiente na Vercel**:
   Certifique-se de que as seguintes variáveis estão configuradas:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (para rotas admin)

## Critérios de Aceitação
- [x] Nenhum import `@/` em `/api`
- [x] Nenhuma referência a `vite/client` em `/api`
- [x] Clientes Supabase centralizados
- [x] Env helper criado e utilizado
- [x] Todos os handlers padronizados
- [x] Endpoint de diagnóstico criado
- [ ] Todos os endpoints retornam 200 (testar após deploy)

## Observações Importantes

1. **Não usar alias `@/` em `/api`**: Causa 500 em runtime na Vercel
2. **Não importar `vite/client` em APIs**: É específico do frontend
3. **Usar caminhos relativos**: Sempre usar `../../src/server/...` em vez de aliases
4. **Não referenciar colunas inexistentes**: Verificar schema antes de fazer queries
5. **Sempre usar try/catch**: Com logging adequado para debug
