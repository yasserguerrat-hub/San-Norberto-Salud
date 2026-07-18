import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ClinicFilters, clinicsRepository } from '@/data/repositories/clinics.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { ClinicFormValues } from '../schemas/clinic.schema'

export function useClinics(filters?: ClinicFilters) {
  return useQuery({
    queryKey: queryKeys.clinics.list(filters),
    queryFn: () => clinicsRepository.list(filters),
  })
}

export function useCreateClinic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClinicFormValues) => clinicsRepository.create({ ...input, coordenadas: null }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clinics.all }),
  })
}

export function useUpdateClinic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClinicFormValues }) => clinicsRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clinics.all }),
  })
}

export function useDeleteClinic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clinicsRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clinics.all }),
  })
}
