import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActivities, upsertActivity, fetchChartData } from './api';

export function useActivities(month: number, year: number) {
    return useQuery({
        queryKey: ['activities', month, year],
        queryFn: () => fetchActivities(month, year),
    });
}

export function useChartData(month: number, year: number) {
    return useQuery({
        queryKey: ['activities-chart', month, year],
        queryFn: () => fetchChartData(month, year),
    });
}

export function useUpsertActivity(month: number, year: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ clientId, date, daysWorked }: { clientId: string; date: string; daysWorked: number }) =>
            upsertActivity(clientId, date, daysWorked),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['activities', month, year] });
            qc.invalidateQueries({ queryKey: ['activities-chart', month, year] });
        },
    });
}
