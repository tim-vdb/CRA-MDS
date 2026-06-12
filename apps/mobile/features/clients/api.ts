import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
import type { Client, ClientFormInput } from './types';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://cra-mds.vercel.app';

// Single authenticated fetch helper. The expo plugin stores the session cookie
// in SecureStore; it must be attached manually with credentials:'omit'.
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const cookie = authClient.getCookie();

    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            Cookie: cookie,
            Accept: 'application/json',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...init.headers,
        },
        credentials: 'omit',
        // A 3xx here means the server bounced us to /login (no session).
        redirect: 'manual',
    });

    if (res.status === 0 || (res.status >= 300 && res.status < 400)) {
        throw new Error('Session expirée, reconnecte-toi.');
    }
    if (!res.ok) {
        // Try to surface the API's error code (e.g. SIRET_ALREADY_EXISTS).
        let detail = `HTTP ${res.status}`;
        try {
            const body = await res.json();
            if (body?.code) detail = String(body.code);
            else if (body?.message) detail = String(body.message);
        } catch {
            // body wasn't JSON — keep the HTTP status
        }
        throw new Error(detail);
    }

    return res;
}

export async function listClients(): Promise<Client[]> {
    const res = await apiFetch('/api/clients');
    return res.json();
}

export async function getClient(id: string): Promise<Client> {
    const res = await apiFetch(`/api/clients/${id}`);
    return res.json();
}

export async function createClient(input: ClientFormInput): Promise<{ id: string }> {
    const res = await apiFetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(input),
    });
    return res.json();
}

export async function updateClient(id: string, input: ClientFormInput): Promise<void> {
    await apiFetch(`/api/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    });
}

export async function deleteClient(id: string): Promise<void> {
    await apiFetch(`/api/clients/${id}`, { method: 'DELETE' });
}

export async function toggleClient(id: string): Promise<void> {
    await apiFetch(`/api/clients/${id}/toggle`, { method: 'PATCH' });
}
