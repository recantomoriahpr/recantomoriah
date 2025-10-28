import { Router } from 'express';
import { z } from 'zod';
import { getSupabaseAnon } from '../lib/supabase';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Cookie names
const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';

function cookieOpts() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/',
    // Optionally set domain if needed
  };
}

router.post('/login', async (req, res) => {
  const parse = LoginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  }

  const supabase = getSupabaseAnon();
  const { email, password } = parse.data;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { access_token, refresh_token, expires_in } = data.session;

  // Set tokens in httpOnly cookies
  res.cookie(ACCESS_COOKIE, access_token, { ...cookieOpts(), maxAge: expires_in * 1000 });
  res.cookie(REFRESH_COOKIE, refresh_token, { ...cookieOpts(), maxAge: 60 * 60 * 24 * 7 * 4 * 3 }); // ~3 months

  return res.json({ success: true });
});

router.post('/logout', async (_req, res) => {
  res.clearCookie(ACCESS_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
  return res.json({ success: true });
});

export default router;
