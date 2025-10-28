# 🚀 Guia Completo: Deploy na Vercel

## ✅ Checklist Pré-Deploy

### 1. **Variáveis de Ambiente**

Você precisa configurar as seguintes variáveis no Vercel:

#### Frontend (Vite)
```env
VITE_API_BASE_URL=https://seu-backend.vercel.app/api
```

#### Backend (API)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=8080
NODE_ENV=production
```

---

### 2. **Arquivos Necessários**

#### ✅ `vercel.json` (Raiz do Projeto)

Crie este arquivo na raiz (`d:\PROJETOS\MORIAH\vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/src/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### ✅ `vercel.json` (API - `apps/api/vercel.json`)

Se você quiser fazer deploy separado da API:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

---

### 3. **Scripts no package.json**

Verifique se tem estes scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "api:dev": "tsx watch apps/api/src/index.ts",
    "api:build": "tsc -p apps/api/tsconfig.json",
    "vercel-build": "npm run build"
  }
}
```

---

## 🔧 Problemas Comuns e Soluções

### ❌ Problema 1: "Cannot find module 'express'"

**Causa:** Dependências não instaladas no build

**Solução:** Mover dependências de `devDependencies` para `dependencies`:

```bash
pnpm add express cors multer @supabase/supabase-js
```

---

### ❌ Problema 2: "Port 8080 already in use"

**Causa:** Vercel usa porta dinâmica

**Solução:** No `apps/api/src/index.ts`, use:

```typescript
const PORT = process.env.PORT || 8080;
```

---

### ❌ Problema 3: "CORS Error"

**Causa:** Frontend e Backend em domínios diferentes

**Solução:** Configure CORS no backend:

```typescript
// apps/api/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://seu-frontend.vercel.app' 
    : 'http://localhost:5173',
  credentials: true
}));
```

---

### ❌ Problema 4: "Cannot access Supabase"

**Causa:** Variáveis de ambiente não configuradas

**Solução:** No Vercel Dashboard:
1. Project Settings → Environment Variables
2. Adicione `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`
3. Faça redeploy

---

## 📋 Passo a Passo: Deploy Completo

### Opção 1: Deploy Monorepo (Frontend + Backend juntos)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Iniciar deploy
vercel

# 4. Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Seu usuário/organização
# - Link to existing project? No
# - Project name? recanto-moriah
# - Directory? ./
# - Override settings? No

# 5. Deploy para produção
vercel --prod
```

### Opção 2: Deploy Separado (Recomendado)

#### **Backend (API) - Deploy primeiro**

```bash
cd apps/api
vercel
# Nome: recanto-moriah-api
# Anote a URL: https://recanto-moriah-api.vercel.app
```

#### **Frontend - Deploy depois**

```bash
cd ../..  # Voltar para raiz
vercel
# Nome: recanto-moriah
# Adicionar variável: VITE_API_BASE_URL=https://recanto-moriah-api.vercel.app/api
```

---

## 🔐 Configurar Variáveis de Ambiente no Vercel

### Via Dashboard:

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Settings → Environment Variables
4. Adicione uma por uma:

**Backend:**
```
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJI...
PORT = 8080
NODE_ENV = production
```

**Frontend:**
```
VITE_API_BASE_URL = https://recanto-moriah-api.vercel.app/api
```

### Via CLI:

```bash
vercel env add SUPABASE_URL
# Cole o valor e pressione Enter

vercel env add SUPABASE_SERVICE_KEY
# Cole o valor e pressione Enter
```

---

## 🧪 Testar Após Deploy

### 1. Testar API:

```bash
curl https://recanto-moriah-api.vercel.app/api/public/page
```

**Esperado:** JSON com `site_settings`, `hero_slides`, etc.

### 2. Testar Frontend:

Acesse: `https://recanto-moriah.vercel.app`

Abra DevTools (F12) → Console → Deve aparecer:
- ✅ Requisições para `/api/public/page`
- ✅ Sem erros de CORS
- ✅ Dados carregando

---

## 📦 Estrutura de Arquivos Final

```
MORIAH/
├── apps/
│   └── api/
│       ├── src/
│       │   └── index.ts
│       ├── vercel.json          ← Criar este
│       ├── package.json
│       └── tsconfig.json
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
├── public/
├── .env.example
├── .env                         ← NÃO fazer commit!
├── vercel.json                  ← Criar este (se deploy monorepo)
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🎯 Comandos Úteis Vercel

```bash
# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm deployment-url

# Abrir dashboard
vercel open

# Ver variáveis
vercel env ls

# Pull variáveis localmente
vercel env pull .env.local
```

---

## ⚠️ IMPORTANTE: Antes do Deploy

### 1. **Executar Migration do YouTube**

Execute o SQL no Supabase antes de fazer deploy:

```bash
# Abra: MIGRATION_YOUTUBE_GALLERY.sql
# Copie todo o conteúdo
# Cole no Supabase SQL Editor
# Execute
```

### 2. **Testar Localmente com Build de Produção**

```bash
# Build frontend
pnpm build

# Preview
pnpm preview

# Build API
cd apps/api
pnpm build
node dist/index.js
```

### 3. **Verificar .gitignore**

Certifique-se que `.env` está no `.gitignore`:

```gitignore
.env
.env.local
.env.production
node_modules/
dist/
.vercel/
```

---

## 🔒 Segurança

### Nunca expor no GitHub:

- ❌ `SUPABASE_SERVICE_KEY`
- ❌ Senhas
- ❌ Tokens de API

### Sempre usar:

- ✅ `.env.example` (sem valores reais)
- ✅ Variáveis de ambiente no Vercel
- ✅ `.gitignore` atualizado

---

## 🎉 Checklist Final

Antes de considerar o deploy completo:

- [ ] Migration `MIGRATION_YOUTUBE_GALLERY.sql` executada no Supabase
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `vercel.json` criado
- [ ] Deploy da API feito com sucesso
- [ ] Deploy do Frontend feito com sucesso
- [ ] Testado upload de fotos
- [ ] Testado adição de vídeos do YouTube
- [ ] Testado WhatsApp flutuante
- [ ] Testado navbar sticky
- [ ] Cores aplicando corretamente
- [ ] Favicon aparecendo

---

## 📞 Próximos Passos

1. **Domínio Customizado**
   - Settings → Domains → Add Domain
   - Adicione: `www.recantomoriah.com.br`
   - Configure DNS conforme instruções

2. **SSL/HTTPS**
   - Vercel configura automaticamente ✅

3. **Analytics**
   - Settings → Analytics → Enable

4. **Monitoramento**
   - Configurar alertas de erro
   - Configurar logs

---

**Tudo pronto para o deploy! 🚀**
