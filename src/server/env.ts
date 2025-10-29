// src/server/env.ts
// Helper para acessar variáveis de ambiente de forma segura
// IMPORTANTE: Este arquivo deve ser usado APENAS em código server-side (API routes)

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'production',
};
