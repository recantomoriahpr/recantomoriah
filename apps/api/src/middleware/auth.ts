import type { Request, Response, NextFunction } from 'express';

// Placeholder middleware. In the future we will validate Supabase JWT (access token)
// from httpOnly cookies and optionally fetch the user to assert admin membership.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const access = req.cookies?.['sb-access-token'];
  if (!access) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: validate JWT, set req.user
  return next();
}
