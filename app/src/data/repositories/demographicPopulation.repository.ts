import { demographicPopulationFixture } from '@/data/fixtures/demographicPopulation.fixtures'
import type { DemographicPopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...demographicPopulationFixture]
const base = createInMemoryRepository<DemographicPopulation>(store)

export interface DemographicPopulationFilters {
  anio?: number
  sectorId?: string
  ageRangeId?: string
  genderId?: string
}

export const demographicPopulationRepository = {
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
