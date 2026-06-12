import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccount, updateName } from './api';
 
export function useUpdateName() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (name: string) => updateName(name),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['session'] }),
    });
}
 
export function useDeleteAccount() {
    return useMutation({ mutationFn: deleteAccount });
}