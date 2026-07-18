import { IS_DEMO_DATA } from '@/app/config/constants'
import { demographicPopulationFixture } from '@/data/fixtures/demographicPopulation.fixtures'
import type { DemographicPopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface DemographicPopulationFilters {
  anio?: number
  sectorId?: string
  ageRangeId?: string
  genderId?: string
}

export const demographicPopulationRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<DemographicPopulation>([...demographicPopulationFixture])
      return {
        ...base,
        list(filters?: DemographicPopulationFilters) {
          return base.list((row) => {
            if (filters?.anio && row.anio !== filters.anio) return false
            if (filters?.sectorId && row.sector_id !== filters.sectorId) return false
            if (filters?.ageRangeId && row.age_range_id !== filters.ageRangeId) return false
            if (filters?.genderId && row.gender_id !== filters.genderId) return false
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<DemographicPopulation>('demographic_population')
      return {
        ...base,
        list(filters?: DemographicPopulationFilters) {
          return base.list((query) => {
            if (filters?.anio) query = query.eq('anio', filters.anio)
            if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId)
            if (filters?.ageRangeId) query = query.eq('age_range_id', filters.ageRangeId)
            if (filters?.genderId) query = query.eq('gender_id', filters.genderId)
            return query
          })
        },
      }
    })()
