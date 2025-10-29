// src/server/supabase.ts
// Clientes Supabase centralizados para uso em API routes
// IMPORTANTE: Este arquivo deve ser usado APENAS em código server-side (API routes)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Cliente Supabase com service role key para operações administrativas
 * Use este cliente em rotas /api/admin/* que precisam de permissões elevadas
 */
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
);

/**
 * Cliente Supabase com anon key para operações públicas
 * Use este cliente em rotas /api/public/* ou para leitura de dados públicos
 */
export const supabaseAnon = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
