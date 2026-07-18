import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type CommunePopulationFilters, communePopulationRepository } from '@/data/repositories/communePopulation.repository'
import { type DemographicPopulationFilters, demographicPopulationRepository } from '@/data/repositories/demographicPopulation.repository'
import { type SectorPopulationFilters, sectorPopulationRepository } from '@/data/repositories/sectorPopulation.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CommunePopulationFormValues } from '../schemas/communePopulation.schema'
import type { DemographicPopulationEditValues } from '../schemas/demographicPopulation.schema'
import type { SectorPopulationFormValues } from '../schemas/sectorPopulation.schema'

// --- Comunal ---
export function useCommunePopulation(filters?: CommunePopulationFilters) {
  return useQuery({ queryKey: queryKeys.communePopulation.list(filters), queryFn: () => communePopulationRepository.list(filters) })
}
export function useCreateCommunePopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CommunePopulationFormValues) => communePopulationRepository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.communePopulation.all }),
  })
}
export function useUpdateCommunePopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CommunePopulationFormValues }) => communePopulationRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.communePopulation.all }),
  })
}
export function useDeleteCommunePopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => communePopulationRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.communePopulation.all }),
  })
}

// --- Por sector ---
export function useSectorPopulation(filters?: SectorPopulationFilters) {
  return useQuery({ queryKey: queryKeys.sectorPopulation.list(filters), queryFn: () => sectorPopulationRepository.list(filters) })
}
export function useCreateSectorPopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SectorPopulationFormValues) => sectorPopulationRepository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sectorPopulation.all }),
  })
}
export function useUpdateSectorPopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SectorPopulationFormValues }) => sectorPopulationRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sectorPopulation.all }),
  })
}
export function useDeleteSectorPopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sectorPopulationRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sectorPopulation.all }),
  })
}

// --- Demográfica ---
export function useDemographicPopulation(filters?: DemographicPopulationFilters) {
  return useQuery({
    queryKey: queryKeys.demographicPopulation.list(filters),
    queryFn: () => demographicPopulationRepository.list(filters),
  })
}
export function useUpdateDemographicPopulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DemographicPopulationEditValues }) => demographicPopulationRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.demographicPopulation.all }),
  })
}
