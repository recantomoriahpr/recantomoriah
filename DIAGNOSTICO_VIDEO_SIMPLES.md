# 🔍 DIAGNÓSTICO SIMPLES - Vídeos YouTube

## ⚡ TESTE RÁPIDO (2 minutos)

### 1️⃣ Reiniciar servidor
```bash
# Ctrl+C para parar, depois:
pnpm dev
```

### 2️⃣ Abrir site e ver logs

1. Abra http://localhost:5173
2. Veja o **terminal da API**

---

## 📊 CENÁRIOS POSSÍVEIS

### ✅ CENÁRIO A: API retorna os campos

**Terminal da API mostra:**
```
[API] [public/page] 📸 Total images from DB: 8
[API] [public/page] 🔍 Primeira imagem (sample): {
[API]   "id": "...",
[API]   "video_url": "https://youtube.com/watch?v=...",
[API]   "video_id": "...",
[API]   "is_video": true,
[API]   ...
[API] }
[API] [public/page] 🔑 Campos disponíveis: [..., 'video_url', 'video_id', 'is_video']
[API] [public/page] 🎥 Vídeos encontrados: [...]
```

**✅ Se vir isso:** API está OK! O problema está no frontend.

**Próximo passo:** Verificar console do navegador (F12)
- Deve mostrar: `📸 [Gallery] Item normalizado: { isVideo: true }`
- Se não mostrar, o adapter não está funcionando

---

### ❌ CENÁRIO B: API NÃO retorna os campos

**Terminal da API mostra:**
```
[API] [public/page] 📸 Total images from DB: 8
[API] [public/page] 🔍 Primeira imagem (sample): {
[API]   "id": "...",
[API]   "url": "...",
[API]   "alt": "..."
[API]   // ❌ NÃO TEM video_url, video_id, is_video
[API] }
[API] [public/page] 🔑 Campos disponíveis: ['id', 'url', 'alt', 'caption', ...]
[API] [public/page] ⚠️ Nenhum vídeo encontrado
```

**❌ Se vir isso:** Cache do Supabase ainda não expirou

**Solução:**
1. Abra Supabase Dashboard
2. Settings → API → **Reload Schema** ou **Restart Project**
3. Aguarde 1-2 minutos
4. Reinicie servidor: `pnpm dev`

---

### ⚠️ CENÁRIO C: API dá erro 500

**Terminal mostra:**
```
[API] [public/page] errors: [
[API]   { code: '42703', message: 'column gallery_images.video_url does not exist' }
[API] ]
```

**❌ Se vir isso:** Colunas não existem no banco

**Solução:** Execute `SQL_FINAL_VIDEO_COMPLETO.sql` novamente

---

## 🎯 CHECKLIST RÁPIDO

Execute e marque:

- [ ] Servidor reiniciado
- [ ] Terminal da API mostra "🔑 Campos disponíveis"
- [ ] Array de campos **INCLUI** `video_url`, `video_id`, `is_video`
- [ ] Terminal mostra "🎥 Vídeos encontrados" (se houver vídeo)
- [ ] Console do navegador (F12) mostra `isVideo: true`
- [ ] Vídeo aparece na galeria com ícone de play
- [ ] Ao clicar, abre player do YouTube

---

## 📞 Me envie:

**Se CENÁRIO A (API OK mas frontend não):**
- Copie logs do console do navegador (F12)

**Se CENÁRIO B (cache):**
- Já recarregou schema no Supabase?
- Aguardou 2 minutos após recarregar?

**Se CENÁRIO C (erro 500):**
- Execute `SQL_FINAL_VIDEO_COMPLETO.sql`
- Me avise depois

---

**Reinicie o servidor e me diga qual cenário aconteceu! 🎯**
