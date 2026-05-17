const rawApiBase = import.meta.env.VITE_API_BASE;
const apiBase = typeof rawApiBase === 'string' && rawApiBase.trim() !== ''
  ? rawApiBase.trim().replace(/\/+$/, '')
  : '/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${apiBase}${normalizedPath}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'API request failed');
  }

  return response.json();
}
