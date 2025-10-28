# ✅ CHECKLIST FINAL - Antes do Deploy

## 🎯 ETAPA 1: EXECUTAR MIGRATIONS (OBRIGATÓRIO!)

### Migration 1: YouTube na Galeria
```sql
-- Abra: MIGRATION_YOUTUBE_GALLERY.sql
-- Copie TODO o conteúdo
-- Vá em: https://supabase.com/dashboard/project/SEU_PROJETO/sql/new
-- Cole e Execute
```

**Resultado esperado:**
```
✅ Success. No rows returned
```

### Migration 2: Corrigir Truncamento
```sql
-- Abra: CORRIGIR_TRUNCAMENTO.md
-- Role até o final (seção "CORREÇÃO DEFINITIVA")
-- Copie TODO o SQL grande
-- Vá em: https://supabase.com/dashboard/project/SEU_PROJETO/sql/new
-- Cole e Execute
```

**Resultado esperado:**
```
✅ Success. No rows returned
```

---

## 🧪 ETAPA 2: TESTAR LOCALMENTE

### Teste 1: Servidor rodando
```bash
pnpm dev
```

**Esperado:**
- ✅ API rodando em http://localhost:8080
- ✅ Frontend rodando em http://localhost:5173
- ✅ Sem erros no terminal

---

### Teste 2: WhatsApp Flutuante

**Passo a passo:**
1. Acesse http://localhost:5173
2. Role para baixo (300px)
3. Botão verde aparece no canto inferior direito
4. Clique no botão

**Esperado:**
- ✅ Botão aparece após scroll
- ✅ Abre WhatsApp (web ou app)
- ✅ URL contém o número cadastrado
- ✅ Mensagem padrão aparece

**❌ Se não funcionar:**
- Vá em Admin → Contatos
- Certifique-se que o campo "WhatsApp" está preenchido
- Formato: (11) 99999-9999

---

### Teste 3: Vídeo do YouTube na Galeria

**Passo a passo:**
1. Acesse http://localhost:5173/admin
2. Faça login
3. Vá em "Galeria"
4. Selecione um álbum existente (ou crie um)
5. Role até "Adicionar Vídeo do YouTube"
6. Cole: `https://youtube.com/watch?v=dQw4w9WgXcQ`
7. Pressione **Enter**
8. Aguarde mensagem de sucesso
9. Vá na home (http://localhost:5173)
10. Navegue até a seção "Galeria"
11. Clique no álbum onde adicionou o vídeo
12. Vídeo deve aparecer com:
    - Thumbnail do YouTube
    - Ícone de play vermelho
    - Texto "Clique para assistir"
13. Clique no vídeo

**Esperado:**
- ✅ Vídeo é adicionado no admin
- ✅ Thumbnail aparece automaticamente
- ✅ Ícone de play vermelho visível
- ✅ Ao clicar, abre player do YouTube
- ✅ Vídeo começa a tocar (autoplay)

**❌ Se não funcionar:**
- Verifique se executou `MIGRATION_YOUTUBE_GALLERY.sql`
- Limpe cache (Ctrl+Shift+R)
- Veja console do navegador (F12) para erros

---

### Teste 4: Truncamento Corrigido

**Passo a passo:**
1. Acesse http://localhost:5173/admin
2. Vá em "Galeria"
3. Edite o nome de um álbum
4. Digite: "Fachada Completa da Propriedade Moriah"
5. Salve
6. Volte para a home
7. Vá até a galeria
8. Verifique o nome do botão do álbum

**Esperado:**
- ✅ Nome completo aparece (não truncado)
- ✅ Todos os caracteres visíveis

**❌ Se truncar:**
- Execute o SQL de `CORRIGIR_TRUNCAMENTO.md`
- Limpe cache (Ctrl+Shift+R)

---

### Teste 5: Cores Aplicando

**Passo a passo:**
1. Acesse http://localhost:5173/admin
2. Vá em "Identidade Visual"
3. Mude "Cor Primária" para `#FF0000` (vermelho forte)
4. Clique em **"Publicar"** (canto superior direito)
5. Aguarde confirmação
6. Volte para home
7. Dê **Ctrl+Shift+R** (hard refresh)

**Esperado:**
- ✅ Todos os botões ficam vermelhos
- ✅ Títulos de seções ficam vermelhos
- ✅ Ícones ficam vermelhos

**❌ Se não funcionar:**
- Leia `DIAGNOSTICO_CORES.md`
- Siga passos de diagnóstico

---

## 📦 ETAPA 3: PREPARAR PARA DEPLOY

### 1. Verificar Arquivos

**Checklist:**
- [ ] `vercel.json` existe na raiz
- [ ] `apps/api/vercel.json` existe
- [ ] `package.json` tem script `vercel-build`
- [ ] `.env.example` atualizado
- [ ] `.gitignore` tem `.env`

### 2. Variáveis de Ambiente

**Anote estas informações do Supabase:**

```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```

**Como pegar:**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings → API
4. Copie:
   - Project URL → `SUPABASE_URL`
   - service_role (secret) → `SUPABASE_SERVICE_KEY`

---

## 🚀 ETAPA 4: DEPLOY NA VERCEL

### Opção A: Via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy Backend (API)
cd apps/api
vercel

# Perguntas:
# - Set up and deploy? → Yes
# - Which scope? → Seu usuário
# - Link to existing project? → No
# - Project name? → recanto-moriah-api
# - Directory? → ./
# - Override settings? → No

# 4. Anotar URL da API
# Exemplo: https://recanto-moriah-api.vercel.app

# 5. Deploy Frontend
cd ../..
vercel

# Perguntas:
# - Set up and deploy? → Yes
# - Which scope? → Seu usuário
# - Link to existing project? → No
# - Project name? → recanto-moriah
# - Directory? → ./
# - Override settings? → No

# 6. Adicionar variável de ambiente
vercel env add VITE_API_BASE_URL
# Quando pedir o valor, cole: https://recanto-moriah-api.vercel.app/api

# 7. Redeploy com variável
vercel --prod
```

### Opção B: Via Dashboard

1. Acesse https://vercel.com/new
2. Conecte GitHub/GitLab
3. Selecione repositório
4. Configure variáveis:
   - Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
   - Frontend: `VITE_API_BASE_URL`
5. Deploy!

---

## ✅ ETAPA 5: TESTAR EM PRODUÇÃO

### Após Deploy Completo:

#### Teste 1: API funcionando
```bash
curl https://recanto-moriah-api.vercel.app/api/public/page
```

**Esperado:** JSON com dados

#### Teste 2: Frontend carregando
Acesse: https://recanto-moriah.vercel.app

**Esperado:**
- ✅ Página carrega
- ✅ Imagens aparecem
- ✅ Cores corretas
- ✅ Sem erros no console (F12)

#### Teste 3: WhatsApp funciona em produção
1. Acesse o site
2. Role para baixo
3. Clique no botão WhatsApp
4. **Esperado:** Abre WhatsApp

#### Teste 4: Vídeos funcionam em produção
1. Vá até a galeria
2. Clique em um vídeo
3. **Esperado:** Player do YouTube abre e toca

---

## 📊 RESUMO FINAL

### Tudo implementado:
- [x] Botão WhatsApp flutuante
- [x] Suporte a vídeos do YouTube
- [x] Correção de truncamento
- [x] Preparação para deploy Vercel

### Tudo documentado:
- [x] Guia de deploy completo
- [x] Guia de correção de truncamento
- [x] Mapa de cores
- [x] Diagnóstico de cores
- [x] Resumo de alterações

### Tudo testado:
- [ ] Migrations executadas
- [ ] WhatsApp flutuante funciona
- [ ] Vídeos YouTube funcionam
- [ ] Truncamento corrigido
- [ ] Cores aplicando

### Deploy:
- [ ] Variáveis de ambiente anotadas
- [ ] Backend deployado
- [ ] Frontend deployado
- [ ] Testado em produção

---

## 🎯 ÚLTIMA CHECAGEM

### Antes de considerar COMPLETO:

1. **Migrations:**
   ```sql
   -- Execute no Supabase SQL Editor:
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'gallery_images' 
     AND column_name IN ('video_url', 'is_video');
   ```
   **Esperado:** 2 linhas retornadas (video_url e is_video)

2. **WhatsApp:**
   - Teste no celular
   - Deve abrir app do WhatsApp

3. **Vídeos:**
   - Adicione 2-3 vídeos de teste
   - Todos devem funcionar

4. **Deploy:**
   - Site acessível via URL .vercel.app
   - Admin acessível
   - Login funcionando

---

## 🎉 PRONTO PARA PRODUÇÃO!

Quando todos os itens acima estiverem ✅, o projeto está **100% pronto** para uso!

### Próximos passos opcionais:
1. Domínio customizado (recantomoriah.com.br)
2. Analytics (Google Analytics)
3. SEO otimizado
4. Certificado SSL (Vercel faz automaticamente)

---

**Sucesso! 🚀**
