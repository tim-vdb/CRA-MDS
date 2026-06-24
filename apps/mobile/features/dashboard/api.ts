import Constants from 'expo-constants';
import { authClient } from '@/lib/auth-client';
import type { ActivityWithClient, ChartEntry } from './types';

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

export async function fetchActivities(month: number, year: number): Promise<ActivityWithClient[]> {
    const res = await apiFetch(`/api/activities?month=${month}&year=${year}`);
    return res.json();
}

export async function upsertActivity(clientId: string, date: string, daysWorked: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/activities`, {
        method: 'POST',
        headers: {
            Cookie: authClient.getCookie(),
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'omit',
        redirect: 'manual',
        body: JSON.stringify({ clientId, date, daysWorked }),
    });
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) throw new Error('Session expirée');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function fetchChartData(month: number, year: number): Promise<ChartEntry[]> {
    const res = await apiFetch(`/api/activities/chart?month=${month}&year=${year}`);
    return res.json();
}
