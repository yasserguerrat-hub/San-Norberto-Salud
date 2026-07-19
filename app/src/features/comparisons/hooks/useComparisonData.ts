import { useQuery } from '@tanstack/react-query'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { riskThresholdsRepository } from '@/data/repositories/riskThresholds.repository'
import { sectorPopulationRepository } from '@/data/repositories/sectorPopulation.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { buildComparisonRows } from '../lib/buildComparisonRows'
import type { ComparisonFilters } from '../types/comparison.types'

export function useComparisonData(filters: ComparisonFilters) {
  return useQuery({
    queryKey: ['comparisons', filters],
    enabled: filters.diseaseId !== '',
    queryFn: async () => {
      const [records, clinics, sectors, sectorPopulation, riskThresholds] = await Promise.all([
        healthRecordsRepository.list({ anio: filters.anio, mes: filters.mes, estado: 'aprobado', diseaseId: filters.diseaseId }),
        clinicsRepository.list(),
        sectorsRepository.list(),
        sectorPopulationRepository.list({ anio: filters.anio }),
        riskThresholdsRepository.list(),
      ])

      return buildComparisonRows({ filters, records, clinics, sectors, sectorPopulation, riskThresholds })
    },
  })
}
