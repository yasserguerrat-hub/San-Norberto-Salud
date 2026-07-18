import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { riskThresholdsRepository } from '@/data/repositories/riskThresholds.repository'
import { sectorPopulationRepository } from '@/data/repositories/sectorPopulation.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import { buildSectorStats } from '../lib/buildSectorStats'
import type { SectorFormValues } from '../schemas/sector.schema'

const SECTORS_WITH_STATS_KEY = ['sectors-with-stats']

/** Estadísticas por sector para el período más reciente con datos (junio 2026, ver fixtures). */
export function useSectorsWithStats() {
  return useQuery({
    queryKey: [...SECTORS_WITH_STATS_KEY, { anio: 2026, mes: 6 }],
    queryFn: async () => {
      const [sectors, records, sectorPopulation, diseases, riskThresholds] = await Promise.all([
        sectorsRepository.list(),
        healthRecordsRepository.list({ anio: 2026, mes: 6, estado: 'aprobado' }),
        sectorPopulationRepository.list({ anio: 2026 }),
        diseasesRepository.list(),
        riskThresholdsRepository.list(),
      ])

      return buildSectorStats({ sectors, records, sectorPopulation, diseases, riskThresholds })
    },
  })
}

/** Catálogo crudo de sectores (RF-05), para el formulario de alta/edición. */
export function useSectorsCatalog() {
  return useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
}

function toSectorInput(values: SectorFormValues) {
  return {
    nombre: values.nombre,
    tipo: values.tipo,
    descripcion: values.descripcion || null,
    coordenadas: values.lat !== undefined && values.lng !== undefined ? { lat: values.lat, lng: values.lng } : null,
    estado: values.estado,
  }
}

function invalidateSectors(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.sectors.all })
  queryClient.invalidateQueries({ queryKey: SECTORS_WITH_STATS_KEY })
}

export function useCreateSector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SectorFormValues) => sectorsRepository.create(toSectorInput(input)),
    onSuccess: () => invalidateSectors(queryClient),
  })
}

export function useUpdateSector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SectorFormValues }) => sectorsRepository.update(id, toSectorInput(input)),
    onSuccess: () => invalidateSectors(queryClient),
  })
}

export function useDeleteSector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sectorsRepository.remove(id),
    onSuccess: () => invalidateSectors(queryClient),
  })
}
