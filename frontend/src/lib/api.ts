export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000';

type ApiSuccess<T> = { success: true; data: T };

async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const msg = extractErrorMessage(body) || `Request failed with ${res.status}`;
    throw new Error(msg);
  }

  return (body as T) ?? (await res.text() as unknown as T);
}

function extractErrorMessage(body: any): string | undefined {
  if (!body) return undefined;
  // NestJS error shapes: { message: string | string[], error?: string, statusCode }
  if (typeof body.message === 'string') return body.message;
  if (Array.isArray(body.message)) return body.message.join(', ');
  if (typeof body.error === 'string') return body.error;
  if (typeof body.data === 'string') return body.data;
  return undefined;
}

export type RegisterPayload = { email: string; password: string };
export type LoginPayload = { email: string; password: string };
export type UserDTO = { _id: string; email: string; createdAt: string };

export async function registerUser(payload: RegisterPayload): Promise<ApiSuccess<UserDTO>> {
  return fetchJson<ApiSuccess<UserDTO>>('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<ApiSuccess<UserDTO>> {
  return fetchJson<ApiSuccess<UserDTO>>('/user/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
