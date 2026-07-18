import { sectorPopulationFixture } from '@/data/fixtures/sectorPopulation.fixtures'
import type { SectorPopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...sectorPopulationFixture]
const base = createInMemoryRepository<SectorPopulation>(store)

export interface SectorPopulationFilters {
  anio?: number
  sectorId?: string
}

export const sectorPopulationRepository = {
  ...base,
  list(filters?: SectorPopulationFilters) {
    return base.list((row) => {
      if (filters?.anio && row.anio !== filters.anio) return false
      if (filters?.sectorId && row.sector_id !== filters.sectorId) return false
      return true
    })
  },
}
