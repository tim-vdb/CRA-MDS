import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { listClients } from '@/features/clients/api';

export const unstable_settings = {
  anchor: '(tabs)',
};

const queryClient = new QueryClient();

function AuthGuard() {
  const { data: session, isPending } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      hasRedirected.current = false;
      router.replace('/(auth)/login');
      return;
    }

    if (session && inAuthGroup && !hasRedirected.current) {
      hasRedirected.current = true;
      // First-visit check: redirect to clients if no clients exist yet
      listClients()
        .then((clients) => {
          if (clients.length === 0) {
            router.replace('/(tabs)/clients');
          } else {
            router.replace('/(tabs)/dashboard');
          }
        })
        .catch(() => {
          // Fallback to dashboard on error
          router.replace('/(tabs)/dashboard');
        });
    }
  }, [session, isPending, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
