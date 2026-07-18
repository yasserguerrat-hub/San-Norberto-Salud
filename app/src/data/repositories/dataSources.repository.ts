import { IS_DEMO_DATA } from '@/app/config/constants'
import { dataSourcesFixture } from '@/data/fixtures/dataSources.fixtures'
import type { DataSource } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface DataSourceFilters {
  search?: string
}

export const dataSourcesRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<DataSource>([...dataSourcesFixture])
      return {
        ...base,
        list(filters?: DataSourceFilters) {
          return base.list((row) => {
            if (!filters?.search) return true
            const q = filters.search.toLowerCase()
            return row.institucion.toLowerCase().includes(q) || row.titulo.toLowerCase().includes(q)
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<DataSource>('data_sources')
      return {
        ...base,
        list(filters?: DataSourceFilters) {
          return base.list((query) =>
            filters?.search ? query.or(`institucion.ilike.%${filters.search}%,titulo.ilike.%${filters.search}%`) : query,
          )
        },
      }
    })()
