# ✅ Upload Real Implementado - Supabase Storage

## 📋 Resumo das Alterações

Este documento descreve as mudanças implementadas para **remover mocks** e **implementar upload real** no Supabase Storage usando **Serverless Functions na Vercel**.

---

## 🎯 Arquivos Alterados

### 1. Variáveis de Ambiente

#### `.env.example` (raiz)
- ✅ Adicionadas variáveis do Supabase:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE`
  - `SUPABASE_BUCKET=recanto-moriah`

#### `apps/api/.env.example`
- ✅ Adicionado `SUPABASE_BUCKET=recanto-moriah`

#### `src/lib/env.ts`
- ✅ Suporte para `SUPABASE_SERVICE_ROLE` com fallback para `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Adicionado `SUPABASE_BUCKET` com fallback para `'recanto-moriah'`

#### `src/server/supabase.ts`
- ✅ Atualizado para ler `SUPABASE_SERVICE_ROLE` com fallback para `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. Serverless Functions (Upload Real)

#### `api/admin/upload.ts`
- ❌ **REMOVIDO:** Mock com `picsum.photos`
- ✅ **IMPLEMENTADO:** Upload real para Supabase Storage
- **Tecnologia:** `busboy` para parse multipart
- **Validações:**
  - Tipos de arquivo: JPEG, PNG, WebP, GIF
  - Tamanho máximo: 10MB
  - Nome seguro com UUID
- **Resposta:** `{ ok: true, url, path, filename }`

#### `api/admin/upload-multiple.ts`
- ❌ **REMOVIDO:** Mock com `picsum.photos`
- ✅ **IMPLEMENTADO:** Upload múltiplo real (até 10 arquivos)
- **Tecnologia:** `busboy` para parse multipart
- **Validações:** Mesmas do upload único
- **Resposta:** `{ ok: true, results: [...], count, successCount }`

---

### 3. Front-end (Remoção de Mocks)

#### `src/components/HeroCarousel.tsx`
- ❌ **REMOVIDO:** `fallbackSlides` com URLs `picsum.photos`
- ✅ **IMPLEMENTADO:** Placeholder local (`/placeholder.svg`) quando não há slides

#### `src/components/admin/sections/AdminHeroEditor.tsx`
- ❌ **REMOVIDO:** Criação de slides com `picsum.photos`
- ✅ **IMPLEMENTADO:** Criação com placeholder local (`/placeholder.svg`)
- ✅ **MELHORADO:** Validação de resposta do upload com tratamento de erros

#### `src/components/admin/sections/AdminGalleryEditor.tsx`
- ✅ **MELHORADO:** Validação de resposta do upload múltiplo
- ✅ **MELHORADO:** Mensagem de toast com contagem de sucessos/falhas

---

### 4. Dependências

#### `package.json`
- ✅ Adicionado `busboy: ^1.6.0` em `dependencies`
- ✅ Adicionado `@types/busboy: ^1.5.4` em `devDependencies`

---

## 🚀 Configuração Pós-Merge

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente na Vercel

Acesse o dashboard da Vercel e configure as seguintes variáveis:

**Para as Serverless Functions:**
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET=recanto-moriah
```

**Opcional (se o client precisar):**
```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Verificar Bucket no Supabase

Certifique-se de que o bucket `recanto-moriah` existe e está configurado como **público**:

1. Acesse Supabase Dashboard → Storage
2. Verifique se o bucket `recanto-moriah` existe
3. Se não existir, execute o SQL em `supabase_storage.sql`

### 4. Testar Upload

#### Teste 1: Upload Único (Hero Carousel)
1. Acesse `/admin`
2. Vá para "Hero/Carrossel"
3. Clique em "Adicionar Slide"
4. Faça upload de uma imagem
5. Verifique se a URL retornada é do Supabase (não `picsum.photos`)

#### Teste 2: Upload Múltiplo (Galeria)
1. Acesse `/admin`
2. Vá para "Galeria"
3. Selecione um álbum
4. Faça upload de 3 imagens de uma vez
5. Verifique se todas as URLs são do Supabase

---

## 🔍 Checklist de Validação

- [ ] `pnpm install` executado com sucesso
- [ ] Variáveis configuradas na Vercel
- [ ] Bucket `recanto-moriah` existe no Supabase
- [ ] Upload único funciona (Hero)
- [ ] Upload múltiplo funciona (Galeria)
- [ ] URLs retornadas são do Supabase (formato: `https://xxx.supabase.co/storage/v1/object/public/recanto-moriah/...`)
- [ ] Imagens aparecem corretamente na landing page
- [ ] Nenhum erro 500/404 nos uploads
- [ ] Console do navegador sem erros

---

## 📊 Comparação Antes/Depois

### Antes (Mock)
```typescript
// api/admin/upload.ts
const publicUrl = `https://picsum.photos/800/600?random=${timestamp}`;
return res.status(200).json({ 
  ok: true, 
  url: publicUrl,
  message: 'Upload simulado'
});
```

### Depois (Real)
```typescript
// api/admin/upload.ts
const { error } = await supabase.storage
  .from(bucket)
  .upload(objectPath, buffer, { contentType, upsert: false });

const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

return res.status(200).json({
  ok: true,
  url: data.publicUrl,
  path: objectPath,
  filename: safeName,
});
```

---

## 🐛 Troubleshooting

### Erro: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE"
- Verifique se as variáveis estão configuradas na Vercel
- Faça redeploy após configurar as variáveis

### Erro: "Failed to upload file to storage"
- Verifique se o bucket `recanto-moriah` existe
- Verifique se as políticas de acesso estão corretas (execute `supabase_storage.sql`)
- Verifique se `SUPABASE_SERVICE_ROLE` tem permissões de escrita

### Erro: "Invalid file type"
- Apenas JPEG, PNG, WebP e GIF são aceitos
- Verifique o tipo MIME do arquivo

### Erro: "File too large"
- Tamanho máximo: 10MB por arquivo
- Comprima a imagem antes de fazer upload

---

## 📝 Notas Técnicas

### Por que Busboy?
- Vercel Serverless Functions não suportam `multer` diretamente
- `busboy` é leve e funciona bem com streaming
- Permite processar múltiplos arquivos de forma eficiente

### Por que desabilitar bodyParser?
```typescript
export const config = {
  api: {
    bodyParser: false,
  },
};
```
- Necessário para processar multipart/form-data manualmente
- Permite controle total sobre o streaming de arquivos

### Bucket Público vs Privado
- Bucket `recanto-moriah` é **público**
- URLs são acessíveis sem autenticação
- Ideal para imagens da landing page
- Se precisar de arquivos privados, use signed URLs

---

## 🎉 Conclusão

Todos os mocks foram removidos e o upload real está implementado usando Supabase Storage através de Serverless Functions na Vercel. O sistema agora:

- ✅ Faz upload real de arquivos
- ✅ Valida tipos e tamanhos
- ✅ Gera nomes seguros com UUID
- ✅ Retorna URLs públicas do Supabase
- ✅ Suporta upload único e múltiplo
- ✅ Trata erros adequadamente

**Próximos passos:** Configurar variáveis na Vercel e testar em produção.
