import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
import type { User } from './types';
 
const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://cra-mds.vercel.app';
 
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: { Cookie: authClient.getCookie(), Accept: 'application/json', ...init.headers },
        credentials: 'omit',
        redirect: 'manual',
    });
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) throw new Error('Session expirée');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}
 
export async function listUsers(): Promise<User[]> {
    const res = await apiFetch('/api/users');
    return res.json();
}
 
 