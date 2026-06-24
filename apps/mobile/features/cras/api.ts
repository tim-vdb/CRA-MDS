import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
import type { CraClient } from './types';

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

export async function fetchCras(month: number, year: number): Promise<CraClient[]> {
    const res = await apiFetch(`/api/cras?month=${month}&year=${year}`);
    return res.json();
}

// Crée ou met à jour l'invoice d'une activité avec un montant facturé manuel.
export async function upsertActivityInvoice(
    activityId: string,
    clientId: string,
    amountHT: number
): Promise<void> {
    await apiFetch('/api/invoices', {
        method: 'POST',
        body: JSON.stringify({ activityId, clientId, amountHT }),
    });
}

// Met à jour le montant d'une invoice existante.
export async function updateInvoiceAmount(
    invoiceId: string,
    amountHT: number
): Promise<void> {
    await apiFetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        body: JSON.stringify({ amountHT }),
    });
}