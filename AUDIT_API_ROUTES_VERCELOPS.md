# Auditoria REST Serverless (Vercel) - Mapeamento Front vs Serverless

## Resumo Executivo

Esta auditoria mapeou todas as chamadas REST do frontend contra as serverless functions disponíveis na Vercel. Foram identificadas **discrepâncias críticas** que explicam os erros 500/404 em produção:

1. **PUT /api/admin/contact-info → 500**: Function existe mas pode ter problemas de schema/body parsing
2. **PUT /api/admin/testimonials/:id → 404**: Falta arquivo `api/admin/testimonials/[id].ts` para rotas dinâmicas
3. **Rotas de upload e publish faltantes**: Múltiplas chamadas sem serverless functions correspondentes

## Front Calls vs Serverless Functions

| Front Route | Method | Serverless File | Status | Observações |
|-------------|--------|-----------------|--------|-------------|
| `/public/page` | GET | `api/public/page.ts` | ✅ OK | Endpoint público funcionando |
| `/admin/hero-slides` | GET | `api/admin/hero-slides.ts` | ✅ OK | Lista slides |
| `/admin/hero-slides` | POST | `api/admin/hero-slides.ts` | ✅ OK | Cria slide |
| `/admin/hero-slides/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/hero-slides/[id].ts` |
| `/admin/hero-slides/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/hero-slides/[id].ts` |
| `/admin/hero-slides/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/hero-slides/publish.ts` |
| `/admin/site-settings` | GET | `api/admin/site-settings.ts` | ✅ OK | Busca configurações |
| `/admin/site-settings` | PUT | `api/admin/site-settings.ts` | ✅ OK | Atualiza configurações |
| `/admin/site-settings/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/site-settings/publish.ts` |
| `/admin/benefit-cards` | GET | `api/admin/benefit-cards.ts` | ✅ OK | Lista cards |
| `/admin/benefit-cards` | POST | `api/admin/benefit-cards.ts` | ✅ OK | Cria card |
| `/admin/benefit-cards/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/benefit-cards/[id].ts` |
| `/admin/benefit-cards/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/benefit-cards/[id].ts` |
| `/admin/benefit-cards/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/benefit-cards/publish.ts` |
| `/admin/testimonials` | GET | `api/admin/testimonials.ts` | ✅ OK | Lista depoimentos |
| `/admin/testimonials` | POST | `api/admin/testimonials.ts` | ✅ OK | Cria depoimento |
| `/admin/testimonials/:id` | PUT | ❌ Missing | 🔴 Missing | **ERRO 404** - Precisa `api/admin/testimonials/[id].ts` |
| `/admin/testimonials/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/testimonials/[id].ts` |
| `/admin/testimonials/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/testimonials/publish.ts` |
| `/admin/info-cards` | GET | `api/admin/info-cards.ts` | ✅ OK | Lista info cards |
| `/admin/info-cards` | POST | `api/admin/info-cards.ts` | ✅ OK | Cria info card |
| `/admin/info-cards/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/info-cards/[id].ts` |
| `/admin/info-cards/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/info-cards/[id].ts` |
| `/admin/info-cards/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/info-cards/publish.ts` |
| `/admin/gallery-albums` | GET | `api/admin/gallery-albums.ts` | ✅ OK | Lista álbuns |
| `/admin/gallery-albums` | POST | `api/admin/gallery-albums.ts` | ✅ OK | Cria álbum |
| `/admin/gallery-albums/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-albums/[id].ts` |
| `/admin/gallery-albums/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-albums/[id].ts` |
| `/admin/gallery-albums/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-albums/publish.ts` |
| `/admin/gallery-images` | GET | `api/admin/gallery-images.ts` | ✅ OK | Lista imagens |
| `/admin/gallery-images` | POST | `api/admin/gallery-images.ts` | ✅ OK | Cria imagem |
| `/admin/gallery-images/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-images/[id].ts` |
| `/admin/gallery-images/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-images/[id].ts` |
| `/admin/gallery-images/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/gallery-images/publish.ts` |
| `/admin/footer-links` | GET | `api/admin/footer-links.ts` | ✅ OK | Lista links rodapé |
| `/admin/footer-links` | POST | `api/admin/footer-links.ts` | ✅ OK | Cria link rodapé |
| `/admin/footer-links/:id` | PUT | ❌ Missing | 🔴 Missing | Precisa `api/admin/footer-links/[id].ts` |
| `/admin/footer-links/:id` | DELETE | ❌ Missing | 🔴 Missing | Precisa `api/admin/footer-links/[id].ts` |
| `/admin/footer-links/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/footer-links/publish.ts` |
| `/admin/contact-info` | GET | `api/admin/contact-info.ts` | ✅ OK | Busca contato |
| `/admin/contact-info` | PUT | `api/admin/contact-info.ts` | ⚠️ Issues | **ERRO 500** - Function existe, verificar schema |
| `/admin/contact-info/publish` | POST | ❌ Missing | 🔴 Missing | Precisa `api/admin/contact-info/publish.ts` |
| `/admin/upload` | POST | ❌ Missing | 🔴 Missing | Upload de arquivos único |
| `/admin/upload-multiple` | POST | ❌ Missing | 🔴 Missing | Upload de múltiplos arquivos |
| `/admin/publish-all` | POST | ❌ Missing | 🔴 Missing | Publicar todas as seções |
| `/health` | GET | ❌ Missing | 🔴 Missing | Health check (dev only) |

## Erros Reproduzidos & Causa Provável

### 🔴 PUT /api/admin/contact-info → 500 (Internal Server Error)

**Causa Provável:**
- Function `api/admin/contact-info.ts` existe e trata PUT
- Possível problema de schema/validação de body
- Pode estar faltando campos obrigatórios ou nomes de colunas incorretos
- Usando `SUPABASE_ANON_KEY` pode não ter permissão para UPDATE

**Localização no código:**
- `src/lib/adminApi.ts:421` - `updateContactInfo()`
- `src/components/admin/sections/AdminContactsManager.tsx` - uso da função

### 🔴 PUT /api/admin/testimonials/:id → 404 (Not Found)

**Causa Provável:**
- Falta arquivo `api/admin/testimonials/[id].ts` para rotas dinâmicas
- Function `api/admin/testimonials.ts` só trata GET/POST (sem ID)
- Vercel não consegue resolver rota dinâmica `/testimonials/123`

**Localização no código:**
- `src/lib/adminApi.ts:180` - `updateTestimonial(id, payload)`
- `src/components/admin/AdminTestimonialsEditor.tsx` - uso da função

## Checklist de Variáveis de Ambiente por Rota

### Rotas Públicas (ANON_KEY suficiente)
- ✅ `/api/public/page` - `SUPABASE_ANON_KEY`

### Rotas Admin (podem precisar SERVICE_ROLE)
- ⚠️ Todas as rotas `/api/admin/*` atualmente usam `SUPABASE_ANON_KEY`
- 🔴 Para operações de escrita (PUT/POST/DELETE), pode ser necessário `SUPABASE_SERVICE_ROLE_KEY`
- 🔴 Upload de arquivos provavelmente precisa de SERVICE_ROLE para storage

### Variáveis Necessárias
- ✅ `SUPABASE_URL` - Configurada
- ✅ `SUPABASE_ANON_KEY` - Configurada  
- ❓ `SUPABASE_SERVICE_ROLE_KEY` - Não verificada (pode ser necessária)

## Recomendações Mínimas

### 🚨 Crítico (Corrige erros 404/500)

1. **Criar arquivos para rotas dinâmicas:**
   ```
   api/admin/hero-slides/[id].ts
   api/admin/testimonials/[id].ts
   api/admin/benefit-cards/[id].ts
   api/admin/info-cards/[id].ts
   api/admin/gallery-albums/[id].ts
   api/admin/gallery-images/[id].ts
   api/admin/footer-links/[id].ts
   ```

2. **Investigar erro 500 em contact-info:**
   - Verificar schema de validação
   - Confirmar nomes de colunas na tabela `contact_info`
   - Testar body parsing com dados reais

3. **Criar endpoints de upload:**
   ```
   api/admin/upload.ts
   api/admin/upload-multiple.ts
   ```

### 📋 Importante (Funcionalidades faltantes)

4. **Criar endpoints de publish:**
   ```
   api/admin/hero-slides/publish.ts
   api/admin/site-settings/publish.ts
   api/admin/benefit-cards/publish.ts
   api/admin/testimonials/publish.ts
   api/admin/info-cards/publish.ts
   api/admin/gallery-albums/publish.ts
   api/admin/gallery-images/publish.ts
   api/admin/footer-links/publish.ts
   api/admin/contact-info/publish.ts
   api/admin/publish-all.ts
   ```

### 🔧 Melhorias (Não bloqueantes)

5. **Avaliar uso de SERVICE_ROLE_KEY para admin**
6. **Adicionar validação Zod nos endpoints**
7. **Implementar CORS headers se necessário**
8. **Health check endpoint para monitoramento**

## Infraestrutura Vercel

### ✅ Configuração Atual (OK)
- `vercel.json` configurado corretamente para Vite SPA
- Rewrites não capturam `/api/*` (correto)
- `buildCommand`, `outputDirectory`, `framework` adequados
- Não há conflitos de `vercel.json`

### ⚠️ Pontos de Atenção
- `pnpm-lock.yaml` deve estar comitado (verificar)
- Variáveis de ambiente podem estar incompletas

## Apêndice: Rotas Encontradas no Código

### Frontend API Calls (src/lib/adminApi.ts)
```
Linha 31:  /admin/hero-slides [GET]
Linha 36:  /admin/hero-slides [POST]  
Linha 44:  /admin/hero-slides/${id} [PUT]
Linha 52:  /admin/hero-slides/${id} [DELETE]
Linha 57:  /admin/hero-slides/publish [POST]
Linha 100: /admin/site-settings [GET]
Linha 105: /admin/site-settings [PUT]
Linha 113: /admin/site-settings/publish [POST]
Linha 119: /admin/publish-all [POST]
Linha 134: /admin/benefit-cards [GET]
Linha 139: /admin/benefit-cards [POST]
Linha 144: /admin/benefit-cards/${id} [PUT]
Linha 149: /admin/benefit-cards/${id} [DELETE]
Linha 154: /admin/benefit-cards/publish [POST]
Linha 170: /admin/testimonials [GET]
Linha 175: /admin/testimonials [POST]
Linha 180: /admin/testimonials/${id} [PUT] ← ERRO 404
Linha 185: /admin/testimonials/${id} [DELETE]
Linha 190: /admin/testimonials/publish [POST]
Linha 205: /admin/info-cards [GET]
Linha 210: /admin/info-cards [POST]
Linha 215: /admin/info-cards/${id} [PUT]
Linha 220: /admin/info-cards/${id} [DELETE]
Linha 225: /admin/info-cards/publish [POST]
Linha 239: /admin/gallery-albums [GET]
Linha 244: /admin/gallery-albums [POST]
Linha 249: /admin/gallery-albums/${id} [PUT]
Linha 254: /admin/gallery-albums/${id} [DELETE]
Linha 259: /admin/gallery-albums/publish [POST]
Linha 276: /admin/gallery-images [GET]
Linha 282: /admin/gallery-images [POST]
Linha 287: /admin/gallery-images/${id} [PUT]
Linha 292: /admin/gallery-images/${id} [DELETE]
Linha 297: /admin/gallery-images/publish [POST]
Linha 311: /admin/footer-links [GET]
Linha 316: /admin/footer-links [POST]
Linha 321: /admin/footer-links/${id} [PUT]
Linha 326: /admin/footer-links/${id} [DELETE]
Linha 331: /admin/footer-links/publish [POST]
Linha 416: /admin/contact-info [GET]
Linha 421: /admin/contact-info [PUT] ← ERRO 500
Linha 429: /admin/contact-info/publish [POST]
```

### Upload Calls
```
AdminHeroEditor.tsx:125   - /admin/upload [POST]
AdminGalleryEditor.tsx:163 - /admin/upload-multiple [POST]  
AdminBrandEditor.tsx:113   - /admin/upload [POST]
```

### Public Calls (src/hooks/usePublicPage.ts)
```
Linha 29: /public/page [GET]
```

### Dev Calls (src/pages/__dev/DevHealth.tsx)
```
Linha 14: /health [GET]
```

---

**Total de rotas identificadas:** 47  
**Serverless functions existentes:** 9  
**Cobertura atual:** 19% (9/47)  
**Rotas críticas faltantes:** 38
