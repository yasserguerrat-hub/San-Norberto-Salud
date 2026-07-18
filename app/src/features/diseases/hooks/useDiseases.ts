import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type DiseaseFilters, diseasesRepository } from '@/data/repositories/diseases.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { DiseaseFormValues } from '../schemas/disease.schema'

export function useDiseases(filters?: DiseaseFilters) {
  return useQuery({ queryKey: queryKeys.diseases.list(filters), queryFn: () => diseasesRepository.list(filters) })
}

export function useCreateDisease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DiseaseFormValues) => diseasesRepository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.diseases.all }),
  })
}

export function useUpdateDisease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DiseaseFormValues }) => diseasesRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.diseases.all }),
  })
}

export function useDeleteDisease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => diseasesRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.diseases.all }),
  })
}
