# ⚡ RESOLVER ERRO 42703 AGORA (2 minutos)

## 🎯 O QUE FAZER

### 1️⃣ Reiniciar servidor
```bash
pnpm dev
```

### 2️⃣ Ver o que aparece no terminal

---

## 📊 RESULTADO A: Site funciona (fallback ativo)

**Terminal mostra:**
```
[API] [public/page] 🔍 Tentando SELECT com colunas de vídeo...
[API] [public/page] ⚠️ Erro 42703: Colunas de vídeo não encontradas
[API] [public/page] 💡 SOLUÇÃO: Faça "Restart Project" no Supabase Dashboard
[API] [public/page] 🔄 Usando fallback sem colunas de vídeo
[API] [public/page] 📸 Total images from DB: 8
```

**Isso significa:**
- ✅ Site está funcionando (sem erro 500)
- ⚠️ Vídeos NÃO vão aparecer (fallback ativo)
- 💡 Cache do Supabase precisa expirar

**O QUE FAZER:**

1. Abra https://supabase.com/dashboard
2. Selecione seu projeto
3. **Settings** → **API** → Role até o final
4. Clique em **"Restart Project"**
5. **AGUARDE 2-3 MINUTOS** ⏰
6. Reinicie servidor: `pnpm dev`
7. Terminal deve mostrar: `✅ SELECT com colunas de vídeo funcionou!`

---

## 📊 RESULTADO B: Vídeos funcionam!

**Terminal mostra:**
```
[API] [public/page] 🔍 Tentando SELECT com colunas de vídeo...
[API] [public/page] ✅ SELECT com colunas de vídeo funcionou!
[API] [public/page] 📸 Total images from DB: 8
[API] [public/page] 🎥 Vídeos encontrados: [...]
```

**✅ PRONTO!** Vídeos estão funcionando.

---

## 📊 RESULTADO C: Erro persiste (fallback não ativou)

**Terminal mostra:**
```
[API] [public/page] errors: [
  { code: '42703', message: 'column ... does not exist' }
]
```

**Causa:** Colunas não existem no banco.

**SOLUÇÃO:** Execute no Supabase SQL Editor:

```sql
-- Criar colunas
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS video_id TEXT;
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false;

-- Verificar
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
AND column_name IN ('video_url', 'video_id', 'is_video');
```

Deve retornar 3 linhas. Depois:
1. Restart Project no Supabase
2. Aguarde 2 minutos
3. `pnpm dev`

---

## 🎯 RESUMO

**90% dos casos: RESULTADO A**
- Site funciona com fallback
- Restart Project + aguardar resolve

**9% dos casos: RESULTADO B**
- Já está funcionando!

**1% dos casos: RESULTADO C**
- Precisa executar SQL

---

## 📞 Me reporte

**Reinicie o servidor e me diga:**

Qual resultado apareceu? **A**, **B** ou **C**?

Se **A**: Já fez Restart? Aguardou 2 minutos?
Se **C**: Execute o SQL acima e me avise.
