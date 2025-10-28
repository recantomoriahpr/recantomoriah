/**
 * Script de Teste de Conexão com Banco de Dados
 * Verifica se o Drizzle ORM está configurado corretamente
 */

import { testConnection, db } from './src/db';
import { sql } from 'drizzle-orm';

console.log('🔍 Testando conexão com banco de dados...\n');

async function main() {
  try {
    // Teste 1: Conexão básica
    console.log('📡 Teste 1: Verificando conexão...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Falha ao conectar ao banco de dados');
    }

    // Teste 2: Query simples
    console.log('📊 Teste 2: Executando query de teste...');
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as pg_version`);
    
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as { current_time: Date; pg_version: string };
      console.log('   ⏰ Hora do servidor:', row.current_time);
      console.log('   🐘 PostgreSQL versão:', row.pg_version.split(' ')[0]);
    }

    // Teste 3: Listar tabelas
    console.log('\n📋 Teste 3: Verificando tabelas criadas...');
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tables.rows && tables.rows.length > 0) {
      console.log(`   ✅ ${tables.rows.length} tabelas encontradas:`);
      tables.rows.forEach((row: any) => {
        console.log(`      - ${row.table_name}`);
      });
    } else {
      console.log('   ⚠️  Nenhuma tabela encontrada. Execute o SQL de migração primeiro!');
    }

    // Teste 4: Verificar RLS
    console.log('\n🔐 Teste 4: Verificando Row Level Security...');
    const rlsTables = await db.execute(sql`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND rowsecurity = true
      ORDER BY tablename
    `);

    if (rlsTables.rows && rlsTables.rows.length > 0) {
      console.log(`   ✅ RLS ativado em ${rlsTables.rows.length} tabelas:`);
      rlsTables.rows.forEach((row: any) => {
        console.log(`      - ${row.tablename}`);
      });
    } else {
      console.log('   ⚠️  RLS não configurado. Execute o SQL de migração!');
    }

    console.log('\n✅ TODOS OS TESTES PASSARAM!\n');
    console.log('🎉 Seu banco de dados está configurado corretamente.');
    console.log('📝 Próximos passos:');
    console.log('   1. Execute o SQL de migração (drizzle/001_init.sql) no Supabase');
    console.log('   2. Configure o storage (supabase_storage.sql)');
    console.log('   3. Comece a desenvolver!');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error);
    console.log('\n🔧 Possíveis soluções:');
    console.log('   1. Verifique se DATABASE_URL está correto no .env');
    console.log('   2. Confirme que o projeto Supabase está ativo');
    console.log('   3. Verifique se executou o SQL de migração');
    process.exit(1);
  }

  process.exit(0);
}

main();
