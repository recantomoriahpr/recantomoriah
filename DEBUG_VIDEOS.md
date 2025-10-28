# 🐛 DEBUG: Vídeos do YouTube não funcionando

## 🔍 PASSO 1: Verificar Console

1. Abra o site: http://localhost:5173
2. Aperte **F12** (DevTools)
3. Vá na aba **Console**
4. Navegue até a Galeria na página
5. Procure por mensagens:
   - `🎥 Vídeo detectado:` - aparece quando carrega a página
   - `🖼️ Abrindo lightbox:` - aparece quando clica no vídeo

### O que você deve ver:

#### ✅ Se estiver funcionando:
```javascript
🎥 Vídeo detectado: {
  videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  img: { ... }
}

🖼️ Abrindo lightbox: {
  globalIndex: 0,
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  selectedImg: { ... }
}
```

#### ❌ Se NÃO estiver funcionando:
```javascript
// Nenhuma mensagem aparece
// OU
🖼️ Abrindo lightbox: {
  globalIndex: 0,
  isVideo: false,  // ❌ FALSE!
  videoId: null,   // ❌ NULL!
  videoUrl: null,  // ❌ NULL!
  selectedImg: { ... }
}
```

---

## 🔧 PASSO 2: Verificar Migration

**Se no console apareceu `isVideo: false` e `videoUrl: null`:**

### Causa: Migration não foi executada

**Solução:**

1. Abra Supabase SQL Editor
2. Execute este SQL para verificar se as colunas existem:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
  AND column_name IN ('video_url', 'is_video');
```

**Resultado esperado:**
```
video_url  | text
is_video   | boolean
```

**Se retornar 0 linhas:**
- ❌ As colunas NÃO existem
- ✅ Execute `MIGRATION_YOUTUBE_GALLERY.sql`

**Passo a passo:**
1. Abra o arquivo: `MIGRATION_YOUTUBE_GALLERY.sql`
2. Copie TODO o conteúdo
3. Vá em: https://supabase.com/dashboard
4. Selecione seu projeto
5. SQL Editor → New Query
6. Cole o SQL
7. Run (Executar)
8. Aguarde: `Success. No rows returned`

---

## 🔧 PASSO 3: Verificar se o Vídeo Foi Salvo Corretamente

Execute no Supabase SQL Editor:

```sql
SELECT 
  id,
  url,
  video_url,
  is_video,
  alt,
  caption
FROM gallery_images
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;
```

### O que verificar:

**✅ Vídeo salvo corretamente:**
```
url         | https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
video_url   | https://youtube.com/watch?v=dQw4w9WgXcQ
is_video    | true
```

**❌ Vídeo NÃO salvo corretamente:**
```
url         | alguma_imagem.jpg
video_url   | null  ❌
is_video    | false ❌
```

**Se o vídeo não foi salvo corretamente:**

### Solução A: Re-adicionar o vídeo

1. Acesse `/admin`
2. Galeria → Selecione álbum
3. **Delete** o item que deveria ser vídeo
4. Role até "Adicionar Vídeo do YouTube"
5. Cole URL: `https://youtube.com/watch?v=SEU_VIDEO_ID`
6. Pressione **Enter**
7. Aguarde mensagem de sucesso

### Solução B: Corrigir manualmente no banco

Se você já adicionou mas não salvou como vídeo, execute:

```sql
-- Substitua 'SUA_URL' pela URL do YouTube
UPDATE gallery_images
SET 
  video_url = 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  is_video = true,
  url = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
WHERE id = 'ID_DA_IMAGEM';
```

---

## 🔧 PASSO 4: Testar o Player

Depois de corrigir, teste:

1. **Ctrl+Shift+R** (hard refresh)
2. Vá na Galeria
3. Clique no vídeo
4. **Esperado:**
   - ✅ Abre modal em tela cheia
   - ✅ Aparece player do YouTube (iframe)
   - ✅ Vídeo começa a tocar automaticamente
   - ✅ Controles do YouTube visíveis

---

## 🚨 PROBLEMAS COMUNS

### Problema 1: "Thumbnail aparece, mas ao clicar mostra imagem estática"

**Causa:** `isVideo` ou `videoId` estão como `false`/`null`

**Solução:**
1. Verifique console (F12)
2. Veja logs de debug
3. Se `isVideo: false`, execute Migration
4. Re-adicione o vídeo no admin

---

### Problema 2: "Iframe aparece mas vídeo não carrega"

**Causa:** URL do YouTube inválida

**Solução:**
1. Verifique se a URL está correta
2. Teste se o vídeo existe: `https://youtube.com/watch?v=SEU_ID`
3. Certifique-se que o vídeo não está privado/bloqueado

---

### Problema 3: "Nada aparece no console"

**Causa:** JavaScript não está executando

**Solução:**
1. Verifique se há erros em vermelho no console
2. Veja tab "Network" → Procure por erros
3. Recarregue a página
4. Se persistir, reinstale dependências:
```bash
pnpm install
pnpm dev
```

---

## ✅ TESTE RÁPIDO

Execute este passo a passo:

1. **Terminal:**
```bash
pnpm dev
```

2. **Navegador:**
- Acesse: http://localhost:5173/admin
- Login
- Galeria → Selecione álbum
- "Adicionar Vídeo do YouTube"
- Cole: `https://youtube.com/watch?v=dQw4w9WgXcQ`
- Enter
- Aguarde sucesso

3. **Home:**
- Acesse: http://localhost:5173
- F12 (console)
- Galeria
- **Deve aparecer:** `🎥 Vídeo detectado:`
- Clique no vídeo
- **Deve aparecer:** `🖼️ Abrindo lightbox: { isVideo: true }`
- **Player do YouTube deve abrir e tocar**

---

## 📞 Se ainda não funcionar

Me envie os logs que aparecem no console quando você:
1. Carrega a página (home)
2. Clica no vídeo

Exemplo:
```
🎥 Vídeo detectado: { ... copie tudo aqui ... }
🖼️ Abrindo lightbox: { ... copie tudo aqui ... }
```

Com isso eu consigo identificar exatamente o problema!
