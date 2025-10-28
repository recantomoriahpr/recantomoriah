# ✅ CORREÇÃO APLICADA: Vídeos do YouTube

## 🔧 O QUE FOI CORRIGIDO

### Problema:
Vídeos adicionados ficavam como foto estática e não abriam o player do YouTube.

### Causa:
A API não estava salvando os campos `video_url` e `is_video` no banco de dados.

### Solução:
✅ **API corrigida** - Agora aceita e salva `video_url` e `is_video`
✅ **Debug adicionado** - Console mostra logs para facilitar identificação de problemas

---

## 🚀 COMO TESTAR AGORA

### PASSO 1: Reiniciar servidor

**IMPORTANTE:** Você PRECISA reiniciar a API para aplicar as correções!

```bash
# No terminal, pare o servidor (Ctrl+C)
# Depois reinicie:
pnpm dev
```

---

### PASSO 2: Executar Migration (se ainda não fez)

**Abra Supabase SQL Editor e execute:**

```sql
-- Migration: Adicionar suporte a vídeos do YouTube na galeria

ALTER TABLE gallery_images
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false;

COMMENT ON COLUMN gallery_images.video_url IS 'URL do vídeo do YouTube';
COMMENT ON COLUMN gallery_images.is_video IS 'Se true, este item é um vídeo; se false, é uma imagem';

UPDATE gallery_images
SET is_video = false
WHERE is_video IS NULL;
```

---

### PASSO 3: Adicionar Vídeo de Teste

1. **Acesse:** http://localhost:5173/admin
2. **Login**
3. **Galeria** → Selecione um álbum (ou crie um novo)
4. Role até **"Adicionar Vídeo do YouTube"**
5. Cole uma URL de teste: `https://youtube.com/watch?v=dQw4w9WgXcQ`
6. Pressione **Enter**
7. Aguarde mensagem: **"Vídeo adicionado!"**

---

### PASSO 4: Verificar Console (Debug)

1. Vá para a **home**: http://localhost:5173
2. Aperte **F12** (DevTools)
3. Aba **Console**
4. Navegue até a **Galeria**

**Você DEVE ver:**
```javascript
🎥 Vídeo detectado: {
  videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  img: {...}
}
```

**Se NÃO aparecer:** A migration não foi executada ou o vídeo não foi salvo corretamente.

---

### PASSO 5: Clicar no Vídeo

1. Na galeria, clique no card do vídeo (com ícone de play vermelho)
2. **Console deve mostrar:**
```javascript
🖼️ Abrindo lightbox: {
  globalIndex: 0,
  isVideo: true,
  videoId: "dQw4w9WgXcQ",
  videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  selectedImg: {...}
}
```

3. **Tela deve mostrar:**
   - ✅ Modal em tela cheia com fundo preto
   - ✅ Player do YouTube (iframe)
   - ✅ Vídeo começa a tocar automaticamente
   - ✅ Controles do YouTube visíveis (play, pause, volume, etc.)

---

## 🐛 SE AINDA NÃO FUNCIONAR

### Debug 1: Verificar se campos existem no banco

**Execute no Supabase SQL Editor:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
  AND column_name IN ('video_url', 'is_video');
```

**Esperado:** 2 linhas
**Se retornar 0:** Execute a migration acima novamente

---

### Debug 2: Verificar se vídeo foi salvo

**Execute no Supabase SQL Editor:**
```sql
SELECT id, url, video_url, is_video, alt, caption
FROM gallery_images
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 5;
```

**Para vídeos, deve aparecer:**
- `video_url`: URL do YouTube
- `is_video`: `true`
- `url`: Thumbnail do YouTube (`https://img.youtube.com/vi/...`)

**Se `video_url` estiver NULL:**
1. Delete o item no admin
2. Adicione novamente (com servidor reiniciado!)

---

### Debug 3: Verificar Console do Servidor

**No terminal onde está rodando `pnpm dev`, procure por:**
```
[POST /admin/gallery-images] insert error: ...
```

**Se aparecer erro relacionado a `video_url` ou `is_video`:**
- Migration não foi executada
- Execute novamente o SQL da migration

---

## ✅ CHECKLIST FINAL

Marque cada item quando completar:

- [ ] Servidor reiniciado (`pnpm dev`)
- [ ] Migration executada no Supabase
- [ ] Vídeo adicionado via admin
- [ ] Console mostra: `🎥 Vídeo detectado:`
- [ ] Cliquei no vídeo na galeria
- [ ] Console mostra: `🖼️ Abrindo lightbox: { isVideo: true }`
- [ ] Player do YouTube abriu
- [ ] Vídeo está tocando
- [ ] Controles do YouTube funcionam

---

## 🎯 TESTE COMPLETO (COPIA E COLA)

Execute este passo a passo completo:

```bash
# Terminal 1: Parar servidor (Ctrl+C) e reiniciar
pnpm dev
```

**Navegador 1: Supabase SQL Editor**
```sql
-- Verificar se colunas existem
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
  AND column_name IN ('video_url', 'is_video');

-- Se retornar 0 linhas, execute:
ALTER TABLE gallery_images
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false;
```

**Navegador 2: Admin**
1. http://localhost:5173/admin
2. Galeria → Álbum → "Adicionar Vídeo do YouTube"
3. Cole: `https://youtube.com/watch?v=dQw4w9WgXcQ`
4. Enter
5. Aguarde sucesso

**Navegador 3: Home**
1. http://localhost:5173
2. F12 → Console
3. Galeria
4. Procure: `🎥 Vídeo detectado:`
5. Clique no vídeo
6. Procure: `🖼️ Abrindo lightbox: { isVideo: true }`
7. **Player do YouTube deve abrir e tocar!**

---

## 🎉 SUCESSO!

Se você viu o player do YouTube e o vídeo está tocando, está **100% funcionando**!

**Agora você pode:**
- ✅ Adicionar quantos vídeos quiser
- ✅ Misturar fotos e vídeos no mesmo álbum
- ✅ Vídeos aparecem com thumbnail e ícone de play
- ✅ Ao clicar, vídeo toca no player do YouTube

---

## 📞 Ainda com problemas?

Envie os logs do console:
1. Mensagem `🎥 Vídeo detectado:` (copie tudo)
2. Mensagem `🖼️ Abrindo lightbox:` (copie tudo)
3. Erros em vermelho no console

Com isso consigo identificar exatamente o problema!
