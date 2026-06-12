import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    listClients,
    createClient,
    updateClient,
    deleteClient,
    toggleClient,
} from './api';
import type { ClientFormInput } from './types';

const CLIENTS_KEY = ['clients'] as const;

export function useClients() {
    return useQuery({
        queryKey: CLIENTS_KEY,
        queryFn: listClients,
    });
}

export function useCreateClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: ClientFormInput) => createClient(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
    });
}

export function useUpdateClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ClientFormInput }) =>
            updateClient(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
    });
}

export function useDeleteClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteClient(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
    });
}

export function useToggleClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => toggleClient(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
    });
}
