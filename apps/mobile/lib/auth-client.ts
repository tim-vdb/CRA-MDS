import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Read apiUrl from every place Expo might expose it (varies between
// Expo Go / dev build / manifest versions).
const extra =
    Constants.expoConfig?.extra ??
    (Constants as { manifest2?: { extra?: { expoClient?: { extra?: Record<string, unknown> } } } })
        .manifest2?.extra?.expoClient?.extra ??
    {};

const API_URL: string = (extra.apiUrl as string | undefined) ?? 'https://cra-mds.vercel.app';

// TEMP diagnostic — remove once confirmed. Shows what the app actually loaded.
console.log('🔗 [auth-client] API_URL =', API_URL);

export const authClient = createAuthClient({
    baseURL: API_URL,
    plugins: [
        expoClient({
            scheme: 'crasolutions',
            storagePrefix: 'crasolutions',
            storage: SecureStore,
        }),
    ],
});

export const { signIn, signOut, useSession } = authClient;
