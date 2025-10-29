@echo off
echo ========================================
echo Commit: Correcao API Serverless
echo ========================================
echo.

echo [1/3] Adicionando arquivos...
git add src/server/env.ts
git add src/server/supabase.ts
git add api/diag.ts
git add api/admin/*.ts
git add api/admin/[resource]/*.ts
git add api/public/*.ts
git add tsconfig.json
git add CORRECAO_API_SERVERLESS.md
git add commit-api-fix.bat

echo.
echo [2/3] Criando commit...
git commit -m "fix: padronizar API serverless e eliminar 500s" -m "- Criar src/server/env.ts para gerenciar variaveis de ambiente" -m "- Criar src/server/supabase.ts com clientes centralizados" -m "- Atualizar tsconfig.json para Node/Serverless (NodeNext)" -m "- Substituir criacao inline de clientes Supabase por helpers" -m "- Padronizar todos os handlers com try/catch e VercelRequest/Response" -m "- Criar endpoint /api/diag para diagnostico" -m "- Remover imports @/ e vite/client de /api" -m "- Garantir que process.env so e acessado via helper"

echo.
echo [3/3] Enviando para repositorio...
git push

echo.
echo ========================================
echo Commit concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. Aguardar deploy da Vercel
echo 2. Testar GET /api/diag
echo 3. Testar endpoints /api/admin/*
echo.
pause
