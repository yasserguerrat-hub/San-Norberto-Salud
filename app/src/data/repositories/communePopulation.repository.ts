import { communePopulationFixture } from '@/data/fixtures/communePopulation.fixtures'
import type { CommunePopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...communePopulationFixture]
const base = createInMemoryRepository<CommunePopulation>(store)

export interface CommunePopulationFilters {
  anio?: number
}

export const communePopulationRepository = {
  ...base,
  list(filters?: CommunePopulationFilters) {
    return base.list((row) => (filters?.anio ? row.anio === filters.anio : true))
  },
}
