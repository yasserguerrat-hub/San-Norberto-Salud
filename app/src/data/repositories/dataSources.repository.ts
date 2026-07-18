import { dataSourcesFixture } from '@/data/fixtures/dataSources.fixtures'
import type { DataSource } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...dataSourcesFixture]
const base = createInMemoryRepository<DataSource>(store)

export interface DataSourceFilters {
  search?: string
}

export const dataSourcesRepository = {
  ...base,
  list(filters?: DataSourceFilters) {
    return base.list((row) => {
      if (!filters?.search) return true
      const q = filters.search.toLowerCase()
      return row.institucion.toLowerCase().includes(q) || row.titulo.toLowerCase().includes(q)
    })
  },
}
