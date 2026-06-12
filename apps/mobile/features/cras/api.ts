import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
import type { CraClient } from './types';
 
const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://cra-mds.vercel.app';
 
async function apiFetch(path: string): Promise<Response> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { Cookie: authClient.getCookie(), Accept: 'application/json' },
        credentials: 'omit',
        redirect: 'manual',
    });
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) throw new Error('Session expirée');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}
 
export async function fetchCras(month: number, year: number): Promise<CraClient[]> {
    const res = await apiFetch(`/api/cras?month=${month}&year=${year}`);
    return res.json();
}