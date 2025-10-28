# 🎬 TESTE IFRAME YOUTUBE CORRIGIDO

## 🔧 O que foi ajustado:

### 1. **Parâmetros simplificados:**
- ✅ Removido `autoplay=1` (pode causar bloqueio)
- ✅ Removido `origin=...` (pode causar restrições)
- ✅ Removido `referrerPolicy` (pode interferir)
- ✅ Mantido apenas: `rel=0&modestbranding=1&playsinline=1`

### 2. **Domínio testado:**
- ✅ Usando `youtube.com` normal (mais compatível)
- ✅ Adicionado `loading="lazy"`

### 3. **Debug melhorado:**
- ✅ Log mostra URL completa do embed para teste manual

---

## 🚀 TESTE AGORA (2 minutos)

### 1️⃣ Reiniciar servidor
```bash
pnpm dev
```

### 2️⃣ Abrir site e testar vídeo
1. http://localhost:5173
2. Vá na **Galeria**
3. Clique no vídeo
4. **F12** → **Console**

### 3️⃣ Ver logs detalhados
**Console deve mostrar:**
```javascript
🎬 [Gallery] Lightbox renderizando: {
  isVideoItem: true,
  videoId: "Ocn8-Sr5eYs",
  videoUrl: "https://www.youtube.com/watch?v=Ocn8-Sr5eYs",
  embedUrl: "https://www.youtube.com/embed/Ocn8-Sr5eYs?rel=0&modestbranding=1&playsinline=1"
}
```

### 4️⃣ Testar URL manualmente
1. **Copie a `embedUrl` do console**
2. **Abra em nova aba** do navegador
3. **Deve tocar o vídeo normalmente**

---

## 📊 RESULTADOS POSSÍVEIS

### ✅ SUCESSO: Vídeo toca
- Player abre sem "Vídeo indisponível"
- Vídeo começa a tocar
- Controles do YouTube funcionam

### ⚠️ PROBLEMA 1: Ainda mostra "indisponível"
**Possíveis causas:**
1. **Vídeo privado/removido:** Teste com outro ID
2. **Extensão bloqueando:** Teste em aba anônima
3. **Região bloqueada:** Vídeo não disponível no Brasil

**Teste com vídeo alternativo:**
- ID: `dQw4w9WgXcQ` (Rick Roll - sempre funciona)
- ID: `jNQXAC9IVRw` (Me at the zoo - primeiro vídeo do YouTube)

### ⚠️ PROBLEMA 2: videoId está incorreto
**Console mostra:**
```javascript
videoId: "Ocn8-Sr5eYsXXXX"  // ❌ Mais de 11 caracteres
videoId: null               // ❌ Parser falhou
```

**Solução:** Verificar se URL original está correta no banco

---

## 🧪 TESTE ALTERNATIVO (se ainda falhar)

### Versão ultra-simples do iframe:
```html
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  width="560" 
  height="315"
  allowfullscreen>
</iframe>
```

### Teste no console do navegador:
```javascript
// Cole isso no console (F12) para testar:
const videoId = "dQw4w9WgXcQ";
const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
console.log("Teste esta URL:", embedUrl);
window.open(embedUrl, '_blank');
```

---

## 📋 CHECKLIST DE TESTE

- [ ] Servidor reiniciado
- [ ] Site aberto: http://localhost:5173
- [ ] Cliquei no vídeo na galeria
- [ ] Console mostra: `isVideoItem: true`
- [ ] Console mostra: `videoId` (11 caracteres)
- [ ] Console mostra: `embedUrl` completa
- [ ] Copiei `embedUrl` e testei em nova aba
- [ ] URL manual funciona? ✅/❌
- [ ] Player no lightbox funciona? ✅/❌

---

## 📞 RESULTADO

**Se funcionou:** ✅ "Funcionou! Vídeo toca normalmente."

**Se não funcionou:** ❌ Me envie:
1. **embedUrl** do console (URL completa)
2. **videoId** mostrado no log
3. **A URL manual funciona?** (testada em nova aba)
4. **Qual mensagem aparece?** ("indisponível", erro de rede, etc.)

---

**Teste agora e me reporte o resultado! 🎯**
