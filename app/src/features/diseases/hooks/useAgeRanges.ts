import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AgeRangeFormValues } from '../schemas/ageRange.schema'

export function useAgeRanges() {
  return useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
}

export function useCreateAgeRange() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AgeRangeFormValues) => ageRangesRepository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ageRanges.all }),
  })
}

export function useUpdateAgeRange() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AgeRangeFormValues }) => ageRangesRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ageRanges.all }),
  })
}

export function useDeleteAgeRange() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ageRangesRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ageRanges.all }),
  })
}
