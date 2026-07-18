import { useQuery } from '@tanstack/react-query'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { riskThresholdsRepository } from '@/data/repositories/riskThresholds.repository'
import { sectorPopulationRepository } from '@/data/repositories/sectorPopulation.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { buildSectorStats } from '../lib/buildSectorStats'

/** Estadísticas por sector para el período más reciente con datos (junio 2026, ver fixtures). */
export function useSectorsWithStats() {
  return useQuery({
    queryKey: ['sectors-with-stats', { anio: 2026, mes: 6 }],
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
