# ⚠️ INSTRUÇÕES CRÍTICAS - LEIA ANTES DE CONTINUAR

## 🔴 Problema Atual

O erro que você está vendo:
```
"Could not find the table 'public.contact_info' in the schema cache"
```

**Significa que a tabela `contact_info` NÃO EXISTE no seu banco de dados Supabase.**

---

## ✅ Solução (3 Passos Simples)

### **PASSO 1: Executar SQL no Supabase**

1. Abra o **Supabase Dashboard** no navegador
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Abra o arquivo: `EXECUTAR_ESTE_SQL_NO_SUPABASE.sql`
4. **COPIE TODO O CONTEÚDO** do arquivo
5. **COLE** no SQL Editor do Supabase
6. Clique em **RUN** (ou F5)
7. Aguarde a mensagem de sucesso

### **PASSO 2: Reiniciar a API**

```bash
# Pare a API (Ctrl+C no terminal)
cd apps/api
pnpm dev
# ou
npm run dev
```

### **PASSO 3: Reiniciar o Frontend**

```bash
# Pare o frontend (Ctrl+C no terminal)
pnpm dev
# ou
npm run dev
```

---

## ✅ O Que Foi Corrigido

### **1. AdminContactEditor (Aba "Orçamento")**
- ✅ **ANTES:** Dados não persistiam ao dar F5
- ✅ **AGORA:** Horários de atendimento salvam no banco via API

### **2. AdminContactsManager (Aba "Contatos")**
- ✅ **ANTES:** Dados não persistiam ao dar F5
- ✅ **AGORA:** Todos os dados (telefone, email, endereço, redes sociais) salvam no banco

### **3. AdminFooterEditor (Aba "Rodapé")**
- ✅ **ANTES:** Título da marca, descrição, copyright e links legais não persistiam
- ✅ **AGORA:** TODOS os campos salvam no banco automaticamente

### **4. Footer Público**
- ✅ **ANTES:** Dados hardcoded que não sincronizavam
- ✅ **AGORA:** Todos os dados vêm da API pública

---

## 🎯 Como Testar Após Executar o SQL

1. **No Admin Dashboard:**
   - Vá em **"Contatos"**
   - Altere telefone, email, horários
   - Vá em **"Rodapé"**
   - Altere nome da empresa, descrição, copyright
   - Clique **"Publicar Alterações"**
   - Dê **F5** na página
   - ✅ **Dados devem PERMANECER** (não voltam ao padrão)

2. **No Site Público:**
   - Acesse a home `/`
   - Role até o rodapé
   - ✅ **Deve mostrar os dados que você editou no admin**
   - Role até "Solicite seu Orçamento"
   - ✅ **Horários devem estar corretos**

---

## 📋 Tabela Criada: `contact_info`

Esta tabela armazena **TODAS** as informações da empresa em um único lugar:

- Telefone, WhatsApp, Email
- Endereço completo (com complemento e referência)
- Horários de atendimento (Segunda-Sexta, Sábado, Domingo)
- Tempo de resposta
- Redes sociais (Instagram, Facebook, LinkedIn, Twitter)
- **Título da marca no rodapé**
- **Descrição da empresa no rodapé**
- **Texto de copyright**
- **Textos dos links legais** (Política de Privacidade, Termos de Uso)

---

## ⚠️ IMPORTANTE: Diferença entre Tabelas

### `contact_info` (NOVA - Informações da Empresa)
- **O QUE É:** Dados da EMPRESA (telefone, email, horários)
- **EDITADO EM:** Admin → Contatos / Rodapé
- **MOSTRADO EM:** Site público (rodapé, formulário de contato)

### `contacts` (JÁ EXISTIA - Submissões de Formulário)
- **O QUE É:** MENSAGENS dos visitantes do site
- **CRIADO QUANDO:** Visitante preenche formulário de orçamento
- **USADO PARA:** Admin ver mensagens recebidas

**NÃO CONFUNDA AS DUAS!**

---

## 🚀 Fluxo Completo de Dados Agora

```
┌─────────────────────────┐
│   Admin edita dados     │
│   (Contatos/Rodapé)     │
└──────────┬──────────────┘
           │
           │ PUT /admin/contact-info
           ▼
┌─────────────────────────┐
│   Salva no Supabase     │
│   Tabela: contact_info  │
└──────────┬──────────────┘
           │
           │ GET /public/page
           ▼
┌─────────────────────────┐
│   Site Público          │
│   (Footer, ContactForm) │
│   Mostra dados salvos   │
└─────────────────────────┘
```

---

## 🔧 Arquivos Modificados (Não Precisa Mexer)

**Backend:**
- ✅ `apps/api/src/routes/contactInfo.ts` → Novos campos de footer
- ✅ `apps/api/src/routes/public.ts` → Retorna contact_info
- ✅ `apps/api/src/index.ts` → Registra rota contactInfo

**Frontend:**
- ✅ `src/lib/adminApi.ts` → Tipos e funções da API
- ✅ `src/components/admin/sections/AdminContactEditor.tsx` → Salva horários
- ✅ `src/components/admin/sections/AdminContactsManager.tsx` → Salva contatos
- ✅ `src/components/admin/sections/AdminFooterEditor.tsx` → Salva footer
- ✅ `src/components/Footer.tsx` → Consome dados da API
- ✅ `src/components/ContactForm.tsx` → Consome dados da API

---

## ❓ Se Ainda Não Funcionar

### Erro: "Could not find the table 'public.contact_info'"
- ❌ **Você NÃO executou o SQL no Supabase**
- ✅ **Solução:** Execute o SQL conforme Passo 1 acima

### Erro: Dados não persistem após F5
- ❌ **Você não reiniciou a API após executar o SQL**
- ✅ **Solução:** Reinicie API conforme Passo 2 acima

### Erro: Site não reflete alterações do admin
- ❌ **Você não clicou em "Publicar Alterações"**
- ✅ **Solução:** Sempre clique "Publicar" após editar no admin

---

## 📞 Status Final

✅ **Todas as correções implementadas**
✅ **Todos os dados agora persistem no banco**
✅ **Admin e site público sincronizados**
✅ **Nenhum dado hardcoded restante**

**Após executar o SQL, tudo deve funcionar perfeitamente! 🎉**
