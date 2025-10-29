// src/server/env.ts
// Helper para validar e acessar variáveis de ambiente de forma segura
// IMPORTANTE: Este arquivo deve ser usado APENAS em código server-side (API routes)

const must = (val: string | undefined, key: string): string => {
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
};

export const env = {
  SUPABASE_URL: must(process.env.SUPABASE_URL, 'SUPABASE_URL'),
  SUPABASE_ANON_KEY: must(process.env.SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY, // Opcional, usado em rotas admin
  NODE_ENV: process.env.NODE_ENV || 'production',
};
