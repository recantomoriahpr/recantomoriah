import 'dotenv/config';
import { getSupabaseService } from '../lib/supabase';

async function ensureAdminUser(email: string, password: string) {
  const supabase = getSupabaseService();

  // 1) Try to create the user
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!createError && created?.user) {
    // eslint-disable-next-line no-console
    console.log(`[ensureAdminUser] Created user ${created.user.id} for ${email}`);
    return;
  }

  // 2) If already exists, find by email and update password
  // eslint-disable-next-line no-console
  console.warn(`[ensureAdminUser] Create failed or user exists. Attempting update for ${email}. Error: ${createError?.message || 'n/a'}`);

  let page = 1;
  const perPage = 1000;
  let foundUserId: string | null = null;

  while (true) {
    const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page, perPage });
    if (listError) throw listError;

    const match = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) {
      foundUserId = match.id;
      break;
    }

    if (!list || list.users.length < perPage) break; // no more pages
    page += 1;
  }

  if (!foundUserId) {
    throw new Error(`[ensureAdminUser] User with email ${email} not found and could not be created.`);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(foundUserId, { password });
  if (updateError) throw updateError;

  // eslint-disable-next-line no-console
  console.log(`[ensureAdminUser] Updated password for user ${foundUserId} (${email}).`);
}

(async () => {
  const email = process.env.ADMIN_EMAIL || 'recantomoriahpr@gmail.com.br';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('Missing ADMIN_PASSWORD in environment');
  }

  try {
    await ensureAdminUser(email, password);
    // eslint-disable-next-line no-console
    console.log('[ensureAdminUser] Done.');
    process.exit(0);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[ensureAdminUser] Failed:', err?.message || err);
    process.exit(1);
  }
})();
