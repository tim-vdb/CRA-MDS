import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { signIn, useSession } from '@/lib/auth-client';

export const unstable_settings = {
  anchor: '(tabs)',
};

const queryClient = new QueryClient();

function AuthGuard({ onReady }: { onReady: () => void }) {
  const { data: session, isPending } = useSession();
  const hasAutoSignedIn = useRef(false);

  // Connexion automatique au compte fixe
  useEffect(() => {
    if (isPending || session || hasAutoSignedIn.current) return;
    hasAutoSignedIn.current = true;
    signIn.email({ email: 'john-doe@cra.fr', password: 'password123' })
      .catch(() => { hasAutoSignedIn.current = false; });
  }, [isPending, session]);

  useEffect(() => {
    if (isPending || !session) return;
    onReady();
  }, [session, isPending]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard onReady={() => setReady(true)} />
        {!ready ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        )}
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
