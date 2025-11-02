# 🎨 MAPA COMPLETO DE CORES - Recanto Moriah

Documentação detalhada de onde cada cor é aplicada no site.

---

## 📋 RESUMO DO SISTEMA DE CORES

### Como Funciona:
1. **Admin altera cores** → Salvo no banco (`site_settings`)
2. **API retorna** → Rota `/api/public/page`
3. **Frontend aplica** → `updateGlobalTheme()` em `src/lib/globalData.ts`
4. **CSS Variables** → `--primary`, `--secondary`, `--accent`, `--background`
5. **Tailwind usa** → Classes `bg-primary`, `text-primary`, etc.

---

## 🟢 COR PRIMÁRIA (Verde) - `--primary`

**Campo Admin:** "Cor Primária (Verde)"  
**Valor padrão:** `#4a5d23` (122 25% 28% em HSL)  
**CSS Variable:** `--primary` e `--primary-foreground`

### Onde é usada:

#### 1️⃣ **Navbar** (`src/components/Navbar.tsx`)
```tsx
- Texto "Recanto Moriah" → text-primary
- Links ao hover → hover:text-primary
- Botão "Contato" → bg-primary text-primary-foreground hover:bg-primary/90
```

#### 2️⃣ **Hero/Carousel** (`src/components/HeroCarousel.tsx`)
```tsx
- Botão CTA → bg-primary text-primary-foreground hover:bg-primary/90
- Indicadores de slide (bolinhas) → bg-primary (ativo) / bg-white/50 (inativo)
```

#### 3️⃣ **Benefits** (`src/components/Benefits.tsx`)
```tsx
- Título "Por que escolher..." → text-primary
- Ícones dos cards → text-primary
- Fundo dos ícones → bg-primary/10 (10% opacidade)
- Hover nos ícones → group-hover:bg-primary/20
```

#### 4️⃣ **Gallery** (`src/components/Gallery.tsx`)
```tsx
- Título "Galeria de Fotos" → text-primary
- Botões dos álbuns (ativo) → bg-primary text-primary-foreground
- Botões dos álbuns (hover) → hover:bg-primary/90
```

#### 5️⃣ **Testimonials** (`src/components/Testimonials.tsx`)
```tsx
- Título "Depoimentos" → text-primary
- Aspas decorativas → text-primary/20
- Estrelas de rating → text-primary (preenchidas)
```

#### 6️⃣ **Contact Form** (`src/components/ContactForm.tsx`)
```tsx
- Botão "Enviar Mensagem" → bg-primary text-primary-foreground hover:bg-primary/90
- Botão WhatsApp → border-primary text-primary hover:bg-primary
- Ícones de contato → text-primary
- Fundo dos ícones → bg-primary/10
- Cards ao hover → hover:bg-primary/5
- Card "Horário de Atendimento" → bg-primary text-primary-foreground
```

#### 7️⃣ **Footer** (`src/components/Footer.tsx`)
```tsx
- Links ao hover → hover:text-primary
- Links de redes sociais → hover:text-primary
- Borda superior → border-t border-primary/10
```

#### 8️⃣ **Practical Info** (`src/components/PracticalInfo.tsx`)
```tsx
- Ícones → text-primary
- Fundo dos ícones → bg-primary/10
```

#### 9️⃣ **Componentes UI** (botões, inputs, etc.)
```tsx
- Button variant="default" → bg-primary text-primary-foreground
- Focus rings → ring-primary
- Checkboxes → bg-primary (quando marcado)
- Radio buttons → text-primary
- Progress bars → bg-primary
- Sliders → bg-primary
```

---

## 🟤 COR SECUNDÁRIA (Bege) - `--secondary`

**Campo Admin:** "Cor Secundária (Bege)"  
**Valor padrão:** `#f4f1e8` (40 60% 94% em HSL)  
**CSS Variable:** `--secondary` e `--secondary-foreground`

### Onde é usada:

#### 1️⃣ **Backgrounds Suaves**
```tsx
- Seções alternadas → bg-secondary (raramente usado diretamente)
- Gradientes → bg-gradient-nature (usa secondary internamente)
```

#### 2️⃣ **Cards e Containers**
```tsx
- Cor de fundo secundária para cards → bg-secondary
- Variações de background → bg-secondary/50
```

#### 3️⃣ **Componentes UI**
```tsx
- Button variant="secondary" → bg-secondary text-secondary-foreground
- Hover states secundários → hover:bg-secondary
- Badges secundários → bg-secondary
```

**⚠️ NOTA:** A cor secundária é **menos usada** que a primária. Ela serve mais como **complemento** e **backgrounds suaves**.

---

## 🌟 COR DE DESTAQUE (Accent) - `--accent`

**Campo Admin:** "Cor de Destaque"  
**Valor padrão:** `#e8e0d0` (40 60% 88% em HSL)  
**CSS Variable:** `--accent` e `--accent-foreground`

### Onde é usada:

#### 1️⃣ **Elementos de Destaque**
```tsx
- Hovers suaves → hover:bg-accent
- Sidebar items ativos → bg-accent
- Menu items selecionados → bg-accent
```

#### 2️⃣ **Componentes UI**
```tsx
- Button variant="outline" hover → hover:bg-accent
- Dropdown items hover → hover:bg-accent
- Select items → bg-accent (quando selecionado)
- Tabs ativos → bg-accent
```

#### 3️⃣ **Bordas e Separadores**
```tsx
- Bordas suaves → border-accent
- Divisores de seção → border-accent
```

**⚠️ NOTA:** A cor accent é usada principalmente para **estados de hover** e **itens ativos** em menus/navegação.

---

## ⬜ COR DE FUNDO - `--background`

**Campo Admin:** "Cor de Fundo"  
**Valor padrão:** `#fefcf7` (40 70% 97% em HSL)  
**CSS Variable:** `--background` e `--foreground`

### Onde é usada:

#### 1️⃣ **Background Global**
```tsx
- Body do site → bg-background
- Áreas principais → bg-background
```

#### 2️⃣ **Cards e Modais**
```tsx
- Fundo de cards → bg-background (quando não usa bg-card)
- Modais/Dialogs → bg-background
- Popovers → bg-popover (derivado de background)
```

#### 3️⃣ **Gallery** (`src/components/Gallery.tsx`)
```tsx
- Section principal → bg-background
```

#### 4️⃣ **Navbar** (`src/components/Navbar.tsx`)
```tsx
- Background com transparência → bg-background/70 ou bg-background/30
- Usa backdrop-blur para efeito de vidro
```

**⚠️ NOTA:** A cor de fundo é a **base** do site. Todas as outras cores se contrastam com ela.

---

## 🔍 DIAGNÓSTICO: POR QUE AS CORES PODEM NÃO ESTAR FUNCIONANDO

### Checklist de Verificação:

#### ✅ 1. **Configurações estão salvas no banco?**
```sql
-- Execute no Supabase SQL Editor:
SELECT 
  primary_color, 
  secondary_color, 
  accent_color, 
  background_color,
  is_published,
  published_at
FROM site_settings 
WHERE deleted_at IS NULL 
ORDER BY updated_at DESC 
LIMIT 1;
```
**Esperado:** Deve retornar 1 linha com `is_published = true`

#### ✅ 2. **API está retornando as cores?**
```bash
# Teste a API:
curl http://localhost:8080/api/public/page
```
**Esperado:** JSON com `site_settings: { primary_color: "#...", ... }`

#### ✅ 3. **Frontend está aplicando as cores?**
Abra DevTools (F12) → Console → Execute:
```javascript
console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary'));
```
**Esperado:** Deve mostrar algo como "122 25% 28%"

#### ✅ 4. **updateGlobalTheme está sendo chamado?**
Adicione log temporário em `src/pages/Index.tsx`:
```typescript
useEffect(() => {
  const s = data?.site_settings;
  console.log('🎨 Aplicando cores:', s); // ADICIONE ESTA LINHA
  if (s) {
    updateGlobalTheme({
      primary: s.primary_color ?? '#4a5d23',
      // ...
    });
  }
}, [data?.site_settings]);
```

#### ✅ 5. **Função hexToHsl está correta?**
O problema pode estar aqui! Vamos testar:
```javascript
// No console do navegador:
const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return \`\${Math.round(h * 360)} \${Math.round(s * 100)}% \${Math.round(l * 100)}%\`;
};

console.log(hexToHsl('#4a5d23')); // Deve retornar algo como "122 25% 28%"
```

---

## 🔧 SOLUÇÕES PARA PROBLEMAS COMUNS

### ❌ Problema 1: "Cores não mudam mesmo após publicar"

**Causas:**
1. Cache do navegador
2. CSS estático sobrescrevendo
3. Configurações não publicadas

**Soluções:**
```bash
1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Limpar cache: F12 → Application → Clear storage
3. Verificar publicação: Admin → Identidade Visual → Botão "Publicar"
```

### ❌ Problema 2: "Algumas cores funcionam, outras não"

**Causa:** Classes Tailwind com cores hardcoded

**Solução:** Procurar e substituir:
```bash
# Procurar no código:
grep -r "bg-\[#" src/
grep -r "text-\[#" src/

# Substituir por classes dinâmicas:
bg-[#4a5d23] → bg-primary
text-[#f4f1e8] → text-secondary
```

### ❌ Problema 3: "Cores padrão aparecem no lugar das personalizadas"

**Causa:** `index.css` tem valores hardcoded nas CSS variables

**Solução:** As CSS variables do `index.css` são **valores iniciais**.  
O JavaScript sobrescreve com `root.style.setProperty()`.

Se não está sobrescrevendo, verifique:
```typescript
// src/lib/globalData.ts linha 189-190
if (typeof window !== 'undefined') {
  applyThemeToDOM(globalData.theme); // ← Esta linha DEVE executar
}
```

### ❌ Problema 4: "Erro na conversão Hex → HSL"

**Causa:** Hex inválido (faltando #, ou formato errado)

**Solução:** Validar no admin:
```typescript
// Adicionar validação em AdminBrandEditor.tsx
const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);

if (!isValidHex(value)) {
  toast({ title: 'Cor inválida', description: 'Use formato #RRGGBB', variant: 'destructive' });
  return;
}
```

---

## 🎯 TESTE RÁPIDO: Verifique SE as Cores Estão Aplicadas

Execute no Console do Navegador (F12):
```javascript
// Teste 1: CSS Variables
console.log('🎨 CSS Variables:');
console.log('--primary:', getComputedStyle(document.documentElement).getPropertyValue('--primary'));
console.log('--secondary:', getComputedStyle(document.documentElement).getPropertyValue('--secondary'));
console.log('--accent:', getComputedStyle(document.documentElement).getPropertyValue('--accent'));
console.log('--background:', getComputedStyle(document.documentElement).getPropertyValue('--background'));

// Teste 2: Botão Primary
const btn = document.querySelector('.bg-primary');
if (btn) {
  console.log('✅ Botão encontrado:', btn);
  console.log('Cor de fundo:', getComputedStyle(btn).backgroundColor);
} else {
  console.log('❌ Nenhum elemento .bg-primary encontrado');
}
```

---

## 📊 TABELA RESUMIDA: Onde Cada Cor Aparece

| Cor | Mais Usado Em | Exemplos Visuais |
|-----|---------------|------------------|
| **Primary (Verde)** | Botões, links, ícones, títulos | Botão "Contato", Ícones de benefícios, Títulos de seção |
| **Secondary (Bege)** | Backgrounds suaves | Raramente visível, mais para sutileza |
| **Accent (Destaque)** | Hovers, itens ativos | Hover em botões outline, menus ativos |
| **Background (Fundo)** | Fundo geral do site | Cor base de tudo |

---

## 🚨 PROBLEMA CRÍTICO IDENTIFICADO

**Possível causa:** As cores estão sendo aplicadas corretamente, mas você pode estar vendo **cache antigo**.

### Teste definitivo:

1. Abra DevTools (F12)
2. Vá em **Network** → Marque **"Disable cache"**
3. Recarregue a página (F5)
4. Vá em **Application** → **Storage** → **Clear site data**
5. Feche e reabra o navegador
6. Teste novamente

Se ainda não funcionar, o problema está em uma destas 3 áreas:
1. ❌ Banco não tem registro publicado
2. ❌ API não está retornando os dados
3. ❌ JavaScript não está executando `updateGlobalTheme()`

---

**Próximo passo:** Me diga qual dos 5 testes do diagnóstico falhou, e eu vou corrigir especificamente!
