# 🔥 SOLUÇÃO ERRO 42703: column does not exist

## 🎯 Problema

```
[API] [public/page] errors: [
  { code: '42703', message: 'column gallery_images.video_url does not exist' }
]
```

**Causa:** Cache do schema do Supabase não reconhece as colunas novas.

---

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### 1️⃣ Diagnosticar

**Execute no Supabase SQL Editor:**

```sql
-- Ver se colunas existem
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'gallery_images'
  AND column_name IN ('video_url', 'video_id', 'is_video');
```

**Resultado esperado:** 3 linhas

---

### 2️⃣ Recarregar Schema

**No Supabase Dashboard:**

1. Selecione seu projeto
2. **Settings** → **API**
3. Role até o final
4. Clique em **"Restart Project"** ou **"Reload Schema"**
5. **Aguarde 2-3 minutos** (importante!)

---

### 3️⃣ Reiniciar Servidor

```bash
# Terminal - Ctrl+C e depois:
pnpm dev
```

---

### 4️⃣ Testar

Abra: http://localhost:5173

**Terminal da API deve mostrar:**
```
[API] [public/page] 📸 Total images from DB: X
```

**SEM erro 42703**

---

## 🔧 SOLUÇÃO ALTERNATIVA (se Restart não funcionar)

### Opção A: Forçar refresh via SQL

```sql
NOTIFY pgrst, 'reload schema';
```

Aguarde 60 segundos, depois teste.

---

### Opção B: Recriar colunas

**⚠️ Isso apaga dados das colunas!**

```sql
-- Remover
ALTER TABLE public.gallery_images DROP COLUMN IF EXISTS video_url CASCADE;
ALTER TABLE public.gallery_images DROP COLUMN IF EXISTS video_id CASCADE;
ALTER TABLE public.gallery_images DROP COLUMN IF EXISTS is_video CASCADE;

-- Aguardar 10 segundos

-- Recriar
ALTER TABLE public.gallery_images ADD COLUMN video_url TEXT;
ALTER TABLE public.gallery_images ADD COLUMN video_id TEXT;
ALTER TABLE public.gallery_images ADD COLUMN is_video BOOLEAN DEFAULT false;
```

Depois:
1. Restart Project no Supabase
2. Aguarde 2 minutos
3. Reinicie servidor: `pnpm dev`

---

## 🛡️ FALLBACK IMPLEMENTADO

A API agora tem fallback automático. Se der erro 42703:

```
[API] [public/page] ⚠️ Colunas de vídeo não encontradas no schema. 
Usando fallback sem video_url/video_id/is_video
```

**Isso permite que o site funcione**, mas sem vídeos até o schema ser recarregado.

---

## 📋 CHECKLIST

- [ ] Executei SQL de diagnóstico (3 linhas retornadas?)
- [ ] Cliquei em "Restart Project" no Supabase
- [ ] Aguardei 2-3 minutos
- [ ] Reiniciei servidor local: `pnpm dev`
- [ ] Terminal NÃO mostra erro 42703
- [ ] Terminal mostra: "📸 Total images from DB"
- [ ] Site abre normalmente

---

## 📞 Se ainda não funcionar

**Me envie:**

1. **Resultado do SQL de diagnóstico:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'gallery_images' 
   AND column_name IN ('video_url', 'video_id', 'is_video');
   ```

2. **Log completo do terminal da API** (primeiras 20 linhas)

3. **Há quanto tempo fez o Restart do projeto?**
   - Menos de 1 minuto? → Aguarde mais
   - Mais de 5 minutos? → Cache preso

---

## 🎯 Resumo

1. **Restart Project** no Supabase Dashboard
2. **Aguardar 2-3 minutos**
3. `pnpm dev`
4. ✅ Erro some

**90% dos casos resolve com Restart + aguardar!**
