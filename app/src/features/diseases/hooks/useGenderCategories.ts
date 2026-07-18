import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { GenderCategoryFormValues } from '../schemas/genderCategory.schema'

export function useGenderCategories() {
  return useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
}

export function useCreateGenderCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: GenderCategoryFormValues) => genderCategoriesRepository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.genderCategories.all }),
  })
}

export function useUpdateGenderCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GenderCategoryFormValues }) => genderCategoriesRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.genderCategories.all }),
  })
}

export function useDeleteGenderCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => genderCategoriesRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.genderCategories.all }),
  })
}
