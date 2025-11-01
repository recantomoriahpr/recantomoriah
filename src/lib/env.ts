// src/lib/env.ts
export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  // Suporta ambos os nomes para compatibilidade
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || 'recanto-moriah',
} as const;

// Validação das variáveis obrigatórias
if (!env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is required');
}

if (!env.SUPABASE_SERVICE_ROLE) {
  throw new Error('SUPABASE_SERVICE_ROLE (or SUPABASE_SERVICE_ROLE_KEY) is required');
}
