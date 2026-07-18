import { useQuery } from '@tanstack/react-query'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { riskThresholdsRepository } from '@/data/repositories/riskThresholds.repository'
import { sectorPopulationRepository } from '@/data/repositories/sectorPopulation.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { buildDashboardViewModel } from '../lib/buildDashboardViewModel'
import type { DashboardFilters } from '../types/dashboard.types'

function previousPeriod(mes: number, anio: number) {
  return mes === 1 ? { mes: 12, anio: anio - 1 } : { mes: mes - 1, anio }
}

export function useDashboardData(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      const prev = previousPeriod(filters.mes, filters.anio)

      const [records, previousRecords, pendingRecords, diseases, sectors, clinics, sectorPopulation, riskThresholds, genders, ageRanges] =
        await Promise.all([
          healthRecordsRepository.list({ anio: filters.anio, mes: filters.mes, estado: 'aprobado' }),
          healthRecordsRepository.list({ anio: prev.anio, mes: prev.mes, estado: 'aprobado' }),
          healthRecordsRepository.list({ anio: filters.anio, mes: filters.mes, estado: 'pendiente' }),
          diseasesRepository.list(),
          sectorsRepository.list(),
          clinicsRepository.list(),
          sectorPopulationRepository.list({ anio: filters.anio }),
          riskThresholdsRepository.list(),
          genderCategoriesRepository.list(),
          ageRangesRepository.list(),
        ])

      return buildDashboardViewModel({
        filters,
        records,
        previousRecords,
        pendingRecords,
        diseases,
        sectors,
        clinics,
        sectorPopulation,
        riskThresholds,
        genders,
        ageRanges,
      })
    },
  })
}

export { previousPeriod }
