/**
 * Hooks React Query pour les catégories — pattern queryOptions/factory (TanStack Query v5+)
 *
 * Ces hooks sont intentionnellement fins : toute la logique (queryKey, queryFn,
 * staleTime, invalidation, optimistic update) est centralisée dans
 * src/front/lib/query-options/categories.ts
 *
 * Avantages :
 * - Une seule source de vérité pour les clés de cache
 * - prefetchQuery / hydration SSR en 1 ligne depuis n'importe où
 * - Ajout de staleTime / gcTime / select une seule fois dans le factory
 * - Moins de boilerplate, plus cohérent sur un gros projet
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { categoryMutations, categoryQueries } from "@/front/lib/query-options/categories"

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Récupère toutes les catégories */
export const useCategories = () => useQuery(categoryQueries.lists())

/** Récupère une catégorie par son ID */
export const useCategoryById = (id: string) => useQuery(categoryQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Crée une nouvelle catégorie */
export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation(categoryMutations.create(queryClient))
}

/** Met à jour une catégorie existante */
export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation(categoryMutations.update(queryClient))
}

/** Supprime une catégorie (optimistic update inclus) */
export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation(categoryMutations.delete(queryClient))
}
