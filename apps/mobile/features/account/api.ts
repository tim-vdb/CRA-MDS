import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
 
const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://cra-mds.vercel.app';
 
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            Cookie: authClient.getCookie(),
            Accept: 'application/json',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...init.headers,
        },
        credentials: 'omit',
        redirect: 'manual',
    });
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) throw new Error('Session expirée');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}
 
export async function deleteAccount(): Promise<void> {
    await apiFetch('/api/account', { method: 'DELETE' });
}
 
export async function updateName(name: string): Promise<void> {
    // Better Auth exposes PATCH /api/auth/update-user
    const res = await fetch(`${API_URL}/api/auth/update-user`, {
        method: 'POST',
        headers: {
            Cookie: authClient.getCookie(),
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'omit',
        redirect: 'manual',
        body: JSON.stringify({ name }),
    });
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) throw new Error('Session expirée');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}