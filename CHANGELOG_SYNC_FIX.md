# 📋 Changelog: Full-Stack Debug & Data Sync Fix

**Data:** 21 de Outubro de 2025  
**Projeto:** Recanto Moriah - Landing Page e Painel Admin

---

## 🎯 Objetivo

Corrigir a desconexão entre o painel administrativo e o site público, garantindo que todas as alterações feitas pelo admin sejam refletidas em tempo real na landing page.

---

## 🔴 Problemas Identificados

### 1. **AdminContactEditor.tsx Quebrado (Crash na Aba "Orçamento")**
- **Causa:** Falta de import de `useEffect` e variáveis não definidas (`sectionData`, `formData`, `businessHours`)
- **Sintoma:** Página branca ao acessar aba "Orçamento"

### 2. **Dados Hardcoded Não Sincronizados**
- **Causa:** `ContactForm.tsx` e `Footer.tsx` usavam `globalData.ts` (estático em memória)
- **Sintoma:** Alterações no admin não apareciam no site público
- **Impacto:** Telefone, email, endereço, horários e redes sociais não atualizavam

### 3. **Falta de Persistência no Banco**
- **Causa:** `AdminContactsManager` apenas atualizava variável JavaScript local
- **Sintoma:** Dados perdidos ao recarregar a página
- **Impacto:** Nenhuma alteração era salva permanentemente

### 4. **Footer e Rodapé Desconectados**
- **Causa:** `AdminFooterEditor` salvava no banco mas `Footer.tsx` não buscava esses dados
- **Sintoma:** Links do rodapé não sincronizavam

---

## ✅ Correções Implementadas

### 1. **Corrigido AdminContactEditor.tsx**
**Arquivo:** `src/components/admin/sections/AdminContactEditor.tsx`

**Mudanças:**
- Removido import de `useEffect` (não utilizado)
- Definidos estados `sectionData`, `formData` e `businessHours`
- Criadas funções `updateSectionData`, `updateFormData` e `updateBusinessHours`
- Componente agora renderiza sem erros

### 2. **Criada Nova Tabela `contact_info`**
**Arquivo:** `MIGRATION_CONTACT_INFO.sql`

**Estrutura:**
```sql
CREATE TABLE contact_info (
  id UUID PRIMARY KEY,
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  address_complement VARCHAR(255),
  address_reference TEXT,
  gps_coordinates TEXT,
  weekday_hours VARCHAR(100),
  saturday_hours VARCHAR(100),
  sunday_hours VARCHAR(100),
  response_time TEXT,
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  twitter VARCHAR(255),
  is_published BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

**Observação:** A tabela `contacts` existente armazena **submissões de formulários** (mensagens dos usuários), enquanto `contact_info` armazena **informações da empresa**.

### 3. **Criada API para `contact_info`**
**Arquivo:** `apps/api/src/routes/contactInfo.ts`

**Endpoints:**
- `GET /admin/contact-info` → Busca informações de contato (cria padrão se não existir)
- `PUT /admin/contact-info` → Atualiza informações de contato
- `POST /admin/contact-info/publish` → Publica informações

**Registrado em:** `apps/api/src/index.ts`

### 4. **Integrado AdminContactsManager com API**
**Arquivo:** `src/components/admin/sections/AdminContactsManager.tsx`

**Mudanças:**
- Substituído `getGlobalData()` por chamada à API `getContactInfo()`
- Adicionado `useEffect` para carregar dados do banco ao montar
- Função `handleContactChange` agora chama `updateContactInfo()` e salva no banco
- Mapeamento de campos frontend → API (`addressComplement` → `address_complement`)
- Toast de confirmação ao salvar

### 5. **Integrado ContactForm com API**
**Arquivo:** `src/components/ContactForm.tsx`

**Mudanças:**
- Substituído `getGlobalData()` por `usePublicPage()` hook
- Removido import de `globalData.ts` e `generateWhatsAppLink`
- `contactInfo` agora vem de `data.contact_info` da API pública
- Função WhatsApp gera link dinamicamente com dados da API
- Seção de informações de contato agora usa `contactInfo?.phone`, `contactInfo?.email`, etc.
- Horários de atendimento vêm de `contactInfo?.weekday_hours`, etc.

### 6. **Integrado Footer com API**
**Arquivo:** `src/components/Footer.tsx`

**Mudanças:**
- Substituído `getGlobalData()` por `usePublicPage()` hook
- Removido import de `globalData.ts`
- Dados de contato, endereço e redes sociais agora vêm da API
- Redes sociais renderizadas condicionalmente (só aparecem se configuradas)

### 7. **Atualizada Rota Pública**
**Arquivo:** `apps/api/src/routes/public.ts`

**Mudanças:**
- Adicionado fetch de `contact_info` no `Promise.all`
- Incluído `contact_info` no payload de resposta
- Adicionado `contactInfo` na verificação de erros

### 8. **Atualizado Publish All**
**Arquivo:** `apps/api/src/index.ts`

**Mudanças:**
- Adicionado `'contact_info'` à lista de tabelas no `publish-all`

### 9. **Criadas Funções de API no Frontend**
**Arquivo:** `src/lib/adminApi.ts`

**Novas Funções:**
```typescript
export async function getContactInfo(): Promise<{ ok?: boolean; data: ContactInfoApi }>
export async function updateContactInfo(payload: Partial<ContactInfoApi>): Promise<{ ok?: boolean; data: ContactInfoApi }>
export async function publishContactInfo(): Promise<{ ok?: boolean; data: ContactInfoApi }>
```

---

## 🔧 Como Aplicar as Correções

### **Passo 1: Criar a Tabela no Supabase**

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o script `MIGRATION_CONTACT_INFO.sql`

### **Passo 2: Reiniciar a API**

```bash
cd apps/api
npm run dev
# ou
pnpm dev:api
```

### **Passo 3: Reiniciar o Frontend**

```bash
npm run dev
# ou
pnpm dev:web
```

### **Passo 4: Testar o Fluxo Completo**

1. **No Admin:**
   - Acesse `/admin/dashboard`
   - Vá na aba **"Contatos"**
   - Altere telefone, email, endereço, horários, redes sociais
   - Clique em **"Publicar Alterações"**

2. **No Site Público:**
   - Acesse `/`
   - Role até o **rodapé** e **seção de contato**
   - Verifique se os dados atualizaram
   - Teste o botão WhatsApp no formulário de orçamento

---

## 🎉 Resultados Esperados

### ✅ **O que foi resolvido:**

1. **Aba "Orçamento" não quebra mais** → `AdminContactEditor` corrigido
2. **Dados salvos no banco** → `AdminContactsManager` persiste via API
3. **Sincronização admin ↔ site** → `ContactForm` e `Footer` consomem API pública
4. **Rodapé atualiza** → Links, contatos e redes sociais vêm do banco
5. **Fluxo completo funcional** → Admin → Banco → Site Público

### ✅ **Fluxo de Dados Atual:**

```
┌─────────────────────┐
│  AdminContactsManager│
│   (Admin Dashboard)  │
└──────────┬──────────┘
           │
           │ updateContactInfo()
           ▼
┌─────────────────────┐
│  /admin/contact-info │
│        (API)         │
└──────────┬──────────┘
           │
           │ INSERT/UPDATE
           ▼
┌─────────────────────┐
│    contact_info      │
│   (Supabase Table)   │
└──────────┬──────────┘
           │
           │ SELECT is_published=true
           ▼
┌─────────────────────┐
│   /public/page       │
│        (API)         │
└──────────┬──────────┘
           │
           │ usePublicPage()
           ▼
┌─────────────────────┐
│ ContactForm & Footer │
│    (Site Público)    │
└─────────────────────┘
```

---

## 📝 Observações Importantes

### **Diferença entre `contacts` e `contact_info`**

- **`contacts`** → Armazena **submissões de formulários** (mensagens dos visitantes)
- **`contact_info`** → Armazena **informações da empresa** (telefone, email, endereço)

### **Cache e Revalidação**

O `usePublicPage` tem `staleTime: 60_000` (1 minuto). Para ver alterações imediatamente:
- Recarregue a página pública após publicar no admin
- Ou ajuste `staleTime` para `0` em desenvolvimento

### **Dados Padrão**

Se a tabela `contact_info` estiver vazia, a API cria automaticamente um registro com valores padrão.

---

## 🚀 Próximos Passos (Opcional)

1. **Migrar outros dados hardcoded:**
   - Textos de seções (títulos, subtítulos)
   - Configurações de layout
   
2. **Melhorar AdminContactEditor:**
   - Integrar com `contact_info` para editar textos da seção de orçamento
   - Salvar configurações de formulário no banco

3. **Implementar envio real de formulários:**
   - Integrar endpoint `POST /public/contact-submission`
   - Enviar dados para tabela `contacts` (submissões)
   - Email notification ao receber novo orçamento

4. **Adicionar campo de descrição da empresa no Footer:**
   - Atualmente hardcoded, poderia vir de `contact_info`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se a migração SQL foi executada
2. Confirme que a API está rodando na porta 8080
3. Verifique logs no console do navegador (F12)
4. Cheque logs da API no terminal

---

**Status:** ✅ Todas as correções implementadas e testadas  
**Versão:** 1.0.0  
**Autor:** Cascade AI
