import { sectorsFixture } from '@/data/fixtures/sectors.fixtures'
import type { Sector } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...sectorsFixture]
const base = createInMemoryRepository<Sector>(store)

export interface SectorFilters {
  search?: string
  tipo?: Sector['tipo']
}

export const sectorsRepository = {
  ...base,
  list(filters?: SectorFilters) {
    return base.list((sector) => {
      if (filters?.tipo && sector.tipo !== filters.tipo) return false
      if (filters?.search && !sector.nombre.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  },
}
