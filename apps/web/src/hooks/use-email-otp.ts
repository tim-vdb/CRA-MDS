import { useState } from 'react';

type OtpType = 'email-verification' | 'forget-password' | 'sign-in';

interface ApiErrorShape {
    message?: string;
    error?: string;
}

async function postJson<TBody>(endpoint: string, payload: TBody) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
    });

    const data = (await response.json().catch(() => ({}))) as ApiErrorShape;

    if (!response.ok) {
        throw new Error(data?.message ?? data?.error ?? 'Request failed.');
    }

    return data;
}

export default function useEmailOtp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendVerificationOtp = async (email: string, type: OtpType) => {
        setLoading(true);
        setError(null);

        try {
            return await postJson('/api/auth/email-otp/send-verification-otp', { email, type });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to send OTP.';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const verifyEmailOtp = async (email: string, otp: string) => {
        setLoading(true);
        setError(null);

        try {
            return await postJson('/api/auth/email-otp/verify-email', { email, otp });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to verify OTP.';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordWithOtp = async (email: string, otp: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            return await postJson('/api/auth/email-otp/reset-password', { email, otp, password });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to reset password.';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendVerificationOtp,
        verifyEmailOtp,
        resetPasswordWithOtp,
        loading,
        error,
    };
}
