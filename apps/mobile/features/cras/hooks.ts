import { useQuery } from '@tanstack/react-query';
import { fetchCras } from './api';
 
export function useCras(month: number, year: number) {
    return useQuery({
        queryKey: ['cras', month, year],
        queryFn: () => fetchCras(month, year),
    });
}