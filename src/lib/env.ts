// src/lib/env.ts
export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
} as const;

// Validação das variáveis obrigatórias
if (!env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is required');
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}
