# ✅ TESTE ADMIN + VÍDEO CORRIGIDO

## 🔧 O que foi corrigido:

### 1. **iframe do YouTube:**
- ✅ Usa `youtube-nocookie.com` (evita bloqueios)
- ✅ Parâmetros corretos: `playsinline=1&origin=...`
- ✅ `referrerPolicy="strict-origin-when-cross-origin"`

### 2. **API Admin:**
- ✅ Schema Zod aceita `video_url`, `video_id`, `is_video`
- ✅ Logs detalhados no POST e PUT
- ✅ Usa dados validados (não `as any`)

---

## 🚀 TESTE AGORA (3 minutos)

### 1️⃣ Reiniciar servidor
```bash
pnpm dev
```

### 2️⃣ Testar Admin
1. Acesse: http://localhost:5173/admin
2. **Galeria** → Selecione um álbum
3. Role até **"Adicionar Vídeo do YouTube"**
4. Cole: `https://youtube.com/watch?v=dQw4w9WgXcQ`
5. Pressione **Enter**

### 3️⃣ Ver logs do terminal da API
**Deve aparecer:**
```
[API] [POST /admin/gallery-images] 🎥 Video data: {
[API]   receivedVideoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
[API]   processedVideoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
[API]   extractedVideoId: 'dQw4w9WgXcQ',
[API]   isVideo: true,
[API]   fullBody: { album_id: '...', url: '...', video_url: '...', is_video: true, ... }
[API] }
```

### 4️⃣ Verificar na home
1. Abra: http://localhost:5173
2. Vá na **Galeria**
3. **Console (F12) deve mostrar:**
```javascript
📦 [Adapter] Raw row: { video_url: "https://youtube.com/watch?v=dQw4w9WgXcQ", video_id: "dQw4w9WgXcQ", is_video: true }
✨ [Adapter] Normalized: { isVideo: true, videoId: "dQw4w9WgXcQ", videoUrl: "..." }
```

### 5️⃣ Clicar no vídeo
1. Clique no card do vídeo
2. **Player do YouTube deve abrir SEM "Vídeo indisponível"**
3. Vídeo deve começar a tocar

---

## 📊 RESULTADOS ESPERADOS

### ✅ SUCESSO:
- Admin salva vídeo (logs mostram `isVideo: true`)
- Home mostra vídeo na galeria
- Player abre e toca normalmente

### ❌ PROBLEMA 1: Admin não salva
**Logs mostram:**
```
[API] receivedVideoUrl: undefined
```
**Causa:** Frontend não está enviando `video_url`
**Solução:** Verificar `AdminGalleryEditor.tsx`

### ❌ PROBLEMA 2: Player mostra "Vídeo indisponível"
**Causa:** Bloqueio de extensão ou CSP
**Solução:** 
- Teste em aba anônima
- Ou use outro vídeo: `https://youtube.com/watch?v=jNQXAC9IVRw`

### ❌ PROBLEMA 3: Console não mostra vídeo
**Logs mostram:**
```
📦 [Adapter] Raw row: { video_url: null, is_video: false }
```
**Causa:** Vídeo não foi publicado
**Solução:** No admin, clique em **"Publicar Alterações"**

---

## 🎯 CHECKLIST

- [ ] Servidor reiniciado
- [ ] Admin: Vídeo adicionado (Enter pressionado)
- [ ] Terminal API: Logs mostram `isVideo: true`
- [ ] Admin: Cliquei em "Publicar Alterações"
- [ ] Home: Console mostra `isVideo: true`
- [ ] Home: Vídeo aparece na galeria
- [ ] Cliquei no vídeo
- [ ] Player abre sem "indisponível"
- [ ] Vídeo está tocando

---

## 📞 Me reporte:

**Se funcionou:** ✅ "Funcionou! Admin salva e vídeo toca."

**Se não funcionou:** ❌ Me envie:
1. **Logs do terminal da API** (seção POST /admin/gallery-images)
2. **Console do navegador** (F12) na home
3. **Qual passo falhou?** (admin salvar, home mostrar, player abrir)

---

**Execute o teste e me reporte! 🎯**
