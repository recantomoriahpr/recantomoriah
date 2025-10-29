// src/server/supabase.ts
// Clientes Supabase centralizados para uso em API routes
// IMPORTANTE: Este arquivo deve ser usado APENAS em código server-side (API routes)

import { createClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Cliente Supabase com service role key para operações administrativas
 * Use este cliente em rotas /api/admin/* que precisam de permissões elevadas
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY // Fallback para anon key se service role não estiver configurada
);

/**
 * Cliente Supabase com anon key para operações públicas
 * Use este cliente em rotas /api/public/* ou para leitura de dados públicos
 */
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);
