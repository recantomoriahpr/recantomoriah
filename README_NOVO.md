# 🌳 Recanto Moriah - Sistema Completo

Landing page moderna e painel administrativo completo para chácara de eventos.

## ✨ Funcionalidades

### Landing Page:
- ✅ **Hero Carousel** com slides personalizáveis
- ✅ **Galeria de Fotos e Vídeos** (YouTube integrado)
- ✅ **Benefícios** com ícones e descrições
- ✅ **Depoimentos** de clientes
- ✅ **Informações Práticas** (horários, contato)
- ✅ **Formulário de Contato** com integração WhatsApp
- ✅ **WhatsApp Flutuante** que aparece ao rolar
- ✅ **Navbar Sticky** com navegação suave
- ✅ **Cores Personalizáveis** (tema dinâmico)
- ✅ **Totalmente Responsivo**

### Painel Admin:
- ✅ **Identidade Visual** (logo, cores, fontes)
- ✅ **Hero/Carrossel** (gerenciar slides)
- ✅ **Benefícios** (ícones e textos)
- ✅ **Galeria** (upload múltiplo + YouTube)
- ✅ **Depoimentos** (com fotos)
- ✅ **Informações Práticas**
- ✅ **Contatos** (telefone, email, WhatsApp)
- ✅ **Footer** (links e redes sociais)
- ✅ **Sistema de Publicação** (draft/published)

## 🚀 Início Rápido

### Pré-requisitos:
- Node.js 18+
- pnpm 8+
- Conta no Supabase

### Instalação:

```bash
# 1. Clone o repositório
git clone <URL_DO_REPO>
cd MORIAH

# 2. Instale dependências
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Execute migrations no Supabase
# Copie o conteúdo de MIGRATION_YOUTUBE_GALLERY.sql
# Execute no Supabase SQL Editor

# 5. Execute migration de truncamento (opcional)
# Copie o SQL de CORRIGIR_TRUNCAMENTO.md
# Execute no Supabase SQL Editor

# 6. Inicie o servidor
pnpm dev
```

### Acessos:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **Admin:** http://localhost:5173/admin

## 📁 Estrutura do Projeto

```
MORIAH/
├── apps/api/           # Backend Express + Supabase
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas (Index, Admin)
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitários
│   └── assets/         # Imagens
├── public/             # Arquivos estáticos
└── docs/               # Documentação
```

## 🎨 Personalização

### Cores e Identidade Visual:

1. Acesse `/admin`
2. Vá em "Identidade Visual"
3. Ajuste cores, logo e fonte
4. Clique em "Publicar"

### Galeria com Vídeos do YouTube:

1. Acesse `/admin` → Galeria
2. Selecione um álbum
3. Role até "Adicionar Vídeo do YouTube"
4. Cole a URL do YouTube
5. Pressione Enter

### Upload Múltiplo:

1. Acesse `/admin` → Galeria
2. Clique em "Adicionar Fotos"
3. Selecione até 10 imagens de uma vez
4. Upload automático

## 🛠️ Tecnologias

### Frontend:
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Query
- Lucide Icons

### Backend:
- Express.js
- Supabase (PostgreSQL)
- Multer (upload de arquivos)
- CORS

## 📚 Documentação

- **[CHECKLIST_FINAL.md](CHECKLIST_FINAL.md)** - Checklist completa antes do deploy
- **[GUIA_DEPLOY_VERCEL.md](GUIA_DEPLOY_VERCEL.md)** - Guia passo a passo de deploy
- **[MAPA_DE_CORES.md](MAPA_DE_CORES.md)** - Onde cada cor é usada
- **[DIAGNOSTICO_CORES.md](DIAGNOSTICO_CORES.md)** - Resolver problemas de cores
- **[CORRIGIR_TRUNCAMENTO.md](CORRIGIR_TRUNCAMENTO.md)** - Corrigir textos cortados
- **[RESUMO_ALTERACOES.md](RESUMO_ALTERACOES.md)** - Todas as alterações feitas

## 🚀 Deploy

### Vercel (Recomendado):

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy backend
cd apps/api
vercel

# 4. Deploy frontend
cd ../..
vercel

# 5. Configurar variáveis de ambiente no dashboard
# VITE_API_BASE_URL=https://sua-api.vercel.app/api
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_SERVICE_KEY=...
```

**Leia o guia completo:** [GUIA_DEPLOY_VERCEL.md](GUIA_DEPLOY_VERCEL.md)

## ✅ Checklist Antes do Deploy

- [ ] Executar `MIGRATION_YOUTUBE_GALLERY.sql` no Supabase
- [ ] Executar SQL de correção de truncamento (opcional)
- [ ] Testar upload múltiplo de fotos
- [ ] Testar adição de vídeos do YouTube
- [ ] Testar WhatsApp flutuante
- [ ] Verificar cores aplicando corretamente
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Deploy do backend
- [ ] Deploy do frontend
- [ ] Testar em produção

## 🐛 Problemas Comuns

### Cores não aplicam
Leia: [DIAGNOSTICO_CORES.md](DIAGNOSTICO_CORES.md)

### Texto truncado (ex: "Fachada" → "Fachad")
Execute SQL de: [CORRIGIR_TRUNCAMENTO.md](CORRIGIR_TRUNCAMENTO.md)

### WhatsApp não abre
Verifique se o número está cadastrado em Admin → Contatos

### Vídeos do YouTube não aparecem
Execute migration: `MIGRATION_YOUTUBE_GALLERY.sql`

## 📞 Suporte

Para mais detalhes, consulte a documentação completa na pasta raiz do projeto.

## 📝 Licença

Este projeto é proprietário do Recanto Moriah.

---

**Desenvolvido com ❤️ para Recanto Moriah**
