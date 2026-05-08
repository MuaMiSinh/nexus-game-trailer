import type { ActivityLog, Livestream, Trailer, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

type ApiError = { error?: string; message?: string };

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let body: ApiError | undefined;
    try {
      body = (await res.json()) as ApiError;
    } catch {
      // ignore
    }
    const msg = body?.error || body?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('nexus_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('nexus_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('nexus_token');
}

export function authHeader() {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// Auth
export async function loginApi(email: string, password: string) {
  return apiFetch<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: authHeader(),
  });
}

export async function registerApi(payload: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
}) {
  return apiFetch<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function meApi() {
  return apiFetch<{ user: User }>('/api/auth/me', { headers: authHeader() });
}

// Admin
export async function adminStatsApi() {
  return apiFetch<{ trailers: number; total_views: number; users: number; featured: number }>(
    '/api/admin/stats',
    { headers: authHeader() },
  );
}

export async function adminLogsApi() {
  return apiFetch<ActivityLog[]>('/api/admin/logs', { headers: authHeader() });
}

export async function adminUsersApi() {
  return apiFetch<User[]>('/api/admin/users', { headers: authHeader() });
}

// Trailers (basic)
export async function trailersApi() {
  return apiFetch<Trailer[]>('/api/trailers', { headers: authHeader() });
}

export async function createTrailerApi(payload: Partial<Trailer> & {
  slug: string;
  title: string;
  publisher: string;
  description: string;
  genre: string;
  release_date: string;
  thumbnail_url: string;
  video_url: string;
  featured?: boolean;
}) {
  return apiFetch<{ id: string }>('/api/trailers', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeader(),
  });
}
