import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCras, updateInvoiceAmount, upsertActivityInvoice } from './api';

export function useCras(month: number, year: number) {
    return useQuery({
        queryKey: ['cras', month, year],
        queryFn: () => fetchCras(month, year),
    });
}

export function useUpsertActivityInvoice(month: number, year: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ activityId, clientId, amountHT }: {
            activityId: string;
            clientId: string;
            amountHT: number;
        }) => upsertActivityInvoice(activityId, clientId, amountHT),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cras', month, year] }),
    });
}

export function useUpdateInvoiceAmount(month: number, year: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ invoiceId, amountHT }: { invoiceId: string; amountHT: number }) =>
            updateInvoiceAmount(invoiceId, amountHT),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cras', month, year] }),
    });
}