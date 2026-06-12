import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function LoginScreen() {
    const [loading, setLoading] = useState<'google' | 'github' | null>(null);

    async function handleOAuth(provider: 'google' | 'github') {
        setLoading(provider);
        try {
            // The expo plugin opens the system browser and handles the
            // deep-link round-trip + session storage automatically.
            await authClient.signIn.social({
                provider,
                callbackURL: '/(tabs)',
            });
        } catch (err) {
            console.error('OAuth error:', err);
        } finally {
            setLoading(null);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CRA Solutions</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

            <Pressable
                style={[styles.button, styles.google]}
                onPress={() => handleOAuth('google')}
                disabled={loading !== null}
            >
                {loading === 'google'
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Continuer avec Google</Text>
                }
            </Pressable>

            <Pressable
                style={[styles.button, styles.github]}
                onPress={() => handleOAuth('github')}
                disabled={loading !== null}
            >
                {loading === 'github'
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Continuer avec GitHub</Text>
                }
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 32,
    },
    button: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    google: {
        backgroundColor: '#4285F4',
    },
    github: {
        backgroundColor: '#24292e',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});
