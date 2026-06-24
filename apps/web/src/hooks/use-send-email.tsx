
import { useState } from 'react';

export default function useSendEmail(endpoint = '/api/emails/welcome') {
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);

    const sendEmail = async (payload?: unknown) => {
        setIsSending(true);
        setSendError(null);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload !== undefined ? JSON.stringify(payload) : undefined,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de l\'email.');
            }

            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur réseau.';
            setSendError(message);
            return null;
        } finally {
            setIsSending(false);
        }
    };

    return { sendEmail, isSending, sendError };
}

