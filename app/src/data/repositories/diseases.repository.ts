import { diseasesFixture } from '@/data/fixtures/diseases.fixtures'
import type { Disease } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...diseasesFixture]
const base = createInMemoryRepository<Disease>(store)

export interface DiseaseFilters {
  search?: string
  tipo?: Disease['tipo']
  estado?: Disease['estado']
}

export const diseasesRepository = {
  ...base,
  list(filters?: DiseaseFilters) {
    return base.list((disease) => {
      if (filters?.tipo && disease.tipo !== filters.tipo) return false
      if (filters?.estado && disease.estado !== filters.estado) return false
      if (filters?.search && !disease.nombre.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  },
}
