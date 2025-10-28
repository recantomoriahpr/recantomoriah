const raw = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
export const API_BASE = raw || '/api';

if (import.meta.env.DEV) {
  // Helpful dev log to know which base is in use
  // eslint-disable-next-line no-console
  console.info(`[api] base: ${API_BASE} (${raw ? 'env' : 'proxy'})`);
}

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: 'GET' });
  return res.json() as Promise<T>;
}
