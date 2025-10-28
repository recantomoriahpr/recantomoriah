```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║           🎯 CHECKLIST DE MIGRAÇÃO DRIZZLE ORM - MORIAH             ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────┐
│ 📦 FASE 1: INSTALAÇÃO (5 minutos)                                   │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 1.1 - Instalar dependências principais
          pnpm add drizzle-orm drizzle-kit pg
          
  [ ] 1.2 - Instalar dependências de desenvolvimento
          pnpm add -D @types/pg tsx
          
  [ ] 1.3 - Verificar instalação
          pnpm list drizzle-orm drizzle-kit pg

┌──────────────────────────────────────────────────────────────────────┐
│ 🔧 FASE 2: CONFIGURAÇÃO (2 minutos)                                 │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 2.1 - Criar arquivo .env na raiz do projeto
  
  [ ] 2.2 - Obter DATABASE_URL do Supabase
          • Acesse: https://app.supabase.com
          • Settings → Database → Connection string
          • Copie a URI
          
  [ ] 2.3 - Adicionar DATABASE_URL no .env
          DATABASE_URL="postgresql://postgres.{ref}:{pass}@{host}:5432/postgres"
          
  [ ] 2.4 - Verificar formato (deve começar com "postgresql://")

┌──────────────────────────────────────────────────────────────────────┐
│ 🗄️ FASE 3: MIGRAÇÃO SQL (3 minutos)                                 │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 3.1 - Acessar Supabase Dashboard → SQL Editor
  
  [ ] 3.2 - Executar 001_init.sql
          • New Query
          • Copiar TODO conteúdo de: drizzle/001_init.sql
          • Colar no editor
          • Run (Ctrl+Enter)
          • ✅ Deve aparecer "Success. No rows returned"
          
  [ ] 3.3 - Executar supabase_storage.sql
          • New Query
          • Copiar TODO conteúdo de: supabase_storage.sql
          • Colar no editor
          • Run (Ctrl+Enter)
          • ✅ Deve aparecer "Success"

┌──────────────────────────────────────────────────────────────────────┐
│ ✅ FASE 4: VALIDAÇÃO (2 minutos)                                    │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 4.1 - Testar conexão com banco
          pnpm db:test
          • ✅ Deve mostrar: "TODOS OS TESTES PASSARAM!"
          
  [ ] 4.2 - Verificar tabelas no Supabase
          • Table Editor
          • ✅ Deve listar 11 tabelas:
            - benefit_cards
            - contact_info
            - contacts
            - footer_links
            - gallery_albums
            - gallery_images
            - hero_slides
            - info_cards
            - schedules
            - site_settings
            - testimonials
            
  [ ] 4.3 - Verificar Storage
          • Storage → Buckets
          • ✅ Deve existir: recanto-moriah (public)
          
  [ ] 4.4 - Verificar RLS
          • Table Editor → Selecione qualquer tabela → Policies
          • ✅ Deve ter policy de leitura pública

┌──────────────────────────────────────────────────────────────────────┐
│ 🎨 FASE 5: INTERFACE VISUAL (Opcional - 1 minuto)                   │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 5.1 - Abrir Drizzle Studio
          pnpm db:studio
          
  [ ] 5.2 - Acessar no navegador
          https://local.drizzle.studio
          
  [ ] 5.3 - Explorar tabelas e dados

┌──────────────────────────────────────────────────────────────────────┐
│ 💻 FASE 6: TESTE PRÁTICO (2 minutos)                                │
└──────────────────────────────────────────────────────────────────────┘

  [ ] 6.1 - Executar exemplo de query
          • Ver arquivo: drizzle-examples.ts
          • Rodar queries de teste
          
  [ ] 6.2 - Verificar tipos TypeScript
          • Abrir src/db/schema.ts
          • Verificar autocomplete funcionando
          
  [ ] 6.3 - Testar INSERT básico
          • Usar Drizzle Studio ou código
          • Inserir registro de teste
          • ✅ Deve aparecer no Table Editor

╔══════════════════════════════════════════════════════════════════════╗
║                      🎉 MIGRAÇÃO COMPLETA!                          ║
╚══════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────┐
│ 📊 RESUMO DA MIGRAÇÃO                                                │
└──────────────────────────────────────────────────────────────────────┘

  ✅ Tabelas criadas:          11
  ✅ Índices criados:           27
  ✅ Foreign Keys:              1
  ✅ Triggers:                  11
  ✅ RLS Policies:              11
  ✅ Storage Buckets:           1
  ✅ Extensions:                2

┌──────────────────────────────────────────────────────────────────────┐
│ 📚 DOCUMENTAÇÃO GERADA                                               │
└──────────────────────────────────────────────────────────────────────┘

  📄 DRIZZLE_MIGRATION_README.md    → Documentação completa
  📄 QUICK_START.md                  → Guia rápido de 5 minutos
  📄 MIGRATION_SUMMARY.md            → Resumo executivo
  📄 COMANDOS_COMPLETOS.md           → Todos os comandos
  📄 CHECKLIST_VISUAL.md             → Este checklist
  📄 drizzle-examples.ts             → Exemplos práticos
  📄 test-db.ts                      → Script de teste

┌──────────────────────────────────────────────────────────────────────┐
│ 🚀 PRÓXIMOS PASSOS                                                   │
└──────────────────────────────────────────────────────────────────────┘

  [ ] Migrar API de @supabase/supabase-js para Drizzle ORM
  [ ] Atualizar queries no frontend (se aplicável)
  [ ] Adicionar novos recursos usando Drizzle
  [ ] Testar em ambiente de staging
  [ ] Deploy para produção

┌──────────────────────────────────────────────────────────────────────┐
│ 🆘 SUPORTE                                                           │
└──────────────────────────────────────────────────────────────────────┘

  🌐 Drizzle Docs:    https://orm.drizzle.team
  🌐 Supabase Docs:   https://supabase.com/docs
  💬 Discord Drizzle: https://discord.gg/drizzle
  
  ⚠️  PROBLEMAS?
      → Consulte: COMANDOS_COMPLETOS.md → Seção "Resolução de Problemas"

╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  ✨ Parabéns! Seu banco de dados está pronto com Drizzle ORM! ✨   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────┐
│ 📝 NOTAS FINAIS                                                      │
└──────────────────────────────────────────────────────────────────────┘

  • Este checklist pode ser impresso para referência rápida
  • Marque cada item conforme completa
  • Em caso de dúvidas, consulte os arquivos de documentação
  • Guarde este checklist para futuras migrações
  
  Data da migração: ___/___/______
  Responsável: _____________________
  Projeto Supabase: _________________
  
  ✅ Migração concluída com sucesso!
  ✅ Testes passaram!
  ✅ Documentação gerada!
  ✅ Pronto para desenvolvimento!

```
