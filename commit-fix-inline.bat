@echo off
echo ========================================
echo Commit: Fix API Inline Supabase Clients
echo ========================================
echo.

echo [1/3] Adicionando arquivos...
git add api/
git add src/server/
git add tsconfig.json
git add vercel.json
git add CORRECAO_API_SERVERLESS_FINAL.md
git add commit-fix-inline.bat

echo.
echo [2/3] Criando commit...
git commit -m "fix: usar clientes Supabase inline para compatibilidade Vercel" -m "- Criar getSupabaseClient() inline em cada handler" -m "- Remover imports de src/server/* nas API routes" -m "- Reverter tsconfig.json para ESNext/Bundler" -m "- Criar api/tsconfig.json especifico para API routes" -m "- Adicionar runtime explicito em vercel.json" -m "- Acessar process.env diretamente em cada handler" -m "" -m "Isso resolve problemas de resolucao de modulos na Vercel" -m "que causavam 500 em todos os endpoints /api/admin/*"

echo.
echo [3/3] Enviando para repositorio...
git push

echo.
echo ========================================
echo Commit concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. Aguardar deploy da Vercel (2-3 minutos)
echo 2. Testar GET /api/diag
echo 3. Testar todos endpoints /api/admin/*
echo 4. Verificar logs da Vercel se houver erros
echo.
pause
