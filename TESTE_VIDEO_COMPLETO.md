# 🧪 TESTE COMPLETO - Vídeos do YouTube

## ⚠️ EXECUTE NESTA ORDEM EXATA

### PASSO 1: Publicar o Vídeo no Supabase

**Execute no Supabase SQL Editor:**

```sql
-- Ver todos os vídeos (publicados e não publicados)
SELECT 
  id,
  url,
  video_url,
  is_video,
  is_published,
  alt,
  created_at
FROM gallery_images
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;
```

**Resultado:**
- Se você ver `video_url` preenchido mas `is_published = false`
- OU se `is_video = false`
- Execute a correção abaixo:

```sql
-- PUBLICAR todos os vídeos do YouTube
UPDATE gallery_images
SET 
  is_published = true,
  is_video = true
WHERE video_url IS NOT NULL
  AND video_url != ''
  AND deleted_at IS NULL;
```

**Depois verifique:**
```sql
SELECT id, video_url, is_video, is_published
FROM gallery_images
WHERE video_url IS NOT NULL
  AND deleted_at IS NULL;
```

**Esperado:** Todos com `is_video = true` e `is_published = true`

---

### PASSO 2: Reiniciar Servidor

```bash
# Terminal - Pare (Ctrl+C) e reinicie:
pnpm dev
```

**Aguarde:** Servidor deve iniciar sem erros

---

### PASSO 3: Testar API

**Abra em um navegador:**
```
http://localhost:8080/api/public/page
```

**Procure por** `gallery_images` no JSON

**Deve aparecer algo assim:**
```json
{
  "gallery_images": [
    {
      "id": "...",
      "url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "is_video": true,
      "is_published": true,
      "alt": "Vídeo do YouTube"
    }
  ]
}
```

**❌ Se `video_url` ou `is_video` estiverem NULL/undefined:**
- O vídeo não foi salvo corretamente
- Volte ao Passo 1

---

### PASSO 4: Testar Frontend com Console

1. Abra http://localhost:5173
2. **F12** (DevTools) → **Console**
3. Vá na seção **Galeria**

**Você DEVE ver logs assim:**

```javascript
📸 Item da galeria: {
  id: "...",
  hasVideoUrl: true,
  videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  url: "https://img.youtube.com/vi/..."
}
```

**❌ Se aparecer:**
```javascript
📸 Item da galeria: {
  hasVideoUrl: false,  // ❌ PROBLEMA!
  videoUrl: null,      // ❌ PROBLEMA!
  isVideo: false,
  videoId: null
}
```

**Então:** A API não está retornando os dados corretos. Volte ao Passo 3.

---

### PASSO 5: Clicar no Vídeo

1. Na galeria, clique no card do vídeo
2. **Console deve mostrar:**

```javascript
🖼️ Abrindo lightbox: {
  globalIndex: 0,
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  videoUrl: "https://youtube.com/watch?v=...",
  selectedImg: {...}
}

🎬 Lightbox renderizando: {
  isVideoItem: true,
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  videoUrl: "https://youtube.com/watch?v=..."
}
```

3. **Tela deve mostrar:**
   - ✅ Modal preto em tela cheia
   - ✅ **iframe do YouTube** (player vermelho/preto)
   - ✅ Vídeo começa a tocar automaticamente
   - ✅ Controles do YouTube (play, pause, timeline, etc.)

---

## 🚨 CENÁRIOS DE ERRO

### Erro 1: Vídeo não aparece na galeria

**Causa:** `is_published = false`

**Solução:** Execute o UPDATE do Passo 1

---

### Erro 2: Console mostra `videoUrl: null`

**Causa:** API não está retornando o campo

**Teste a API diretamente:**
```
http://localhost:8080/api/public/page
```

**Se `video_url` estiver no JSON:** Problema no frontend
**Se `video_url` NÃO estiver no JSON:** Problema no banco

---

### Erro 3: Console mostra `videoId: null` mas `videoUrl` tem valor

**Causa:** Regex de extração do ID do YouTube falhou

**URLs suportadas:**
- ✅ `https://youtube.com/watch?v=ID`
- ✅ `https://www.youtube.com/watch?v=ID`
- ✅ `https://youtu.be/ID`
- ✅ `https://youtube.com/embed/ID`

**Execute no console do navegador:**
```javascript
const url = "COLE_A_URL_AQUI";
const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
const match = url.match(regex);
console.log('ID extraído:', match ? match[1] : 'FALHOU');
```

---

### Erro 4: Lightbox mostra imagem ao invés de vídeo

**Causa:** `isVideo` ou `videoId` são `false`/`null`

**Verifique no console:**
```javascript
🎬 Lightbox renderizando: {
  isVideoItem: ???,  // Deve ser true
  isVideo: ???,      // Deve ser true
  videoId: ???       // Deve ter ID
}
```

**Se `isVideoItem: false`:**
- Problema nos dados
- Volte ao Passo 1

---

## ✅ CHECKLIST FINAL

Execute tudo e marque:

- [ ] SQL: Vídeos têm `is_video = true` e `is_published = true`
- [ ] Servidor reiniciado
- [ ] API `/public/page` retorna `video_url` e `is_video`
- [ ] Console mostra: `📸 Item da galeria: { isVideo: true }`
- [ ] Console mostra: `🎬 Lightbox renderizando: { isVideoItem: true }`
- [ ] Iframe do YouTube aparece
- [ ] Vídeo está tocando

---

## 🎯 SE TUDO FALHAR

Execute este SQL para forçar um vídeo de teste:

```sql
-- Pegar ID de um álbum existente
SELECT id, title FROM gallery_albums WHERE deleted_at IS NULL LIMIT 1;

-- Inserir vídeo de teste (substitua ALBUM_ID_AQUI)
INSERT INTO gallery_images (
  album_id,
  url,
  video_url,
  is_video,
  alt,
  caption,
  "order",
  is_published
) VALUES (
  'ALBUM_ID_AQUI',
  'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  true,
  'Vídeo de Teste',
  'Teste YouTube',
  999,
  true
);
```

Depois:
1. **Ctrl+Shift+R** (hard refresh no navegador)
2. Vá na galeria
3. Vídeo deve aparecer
4. Clique → Player do YouTube deve abrir

---

**Me envie os logs do console de cada passo se ainda não funcionar!**
