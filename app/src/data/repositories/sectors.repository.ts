import { IS_DEMO_DATA } from '@/app/config/constants'
import { sectorsFixture } from '@/data/fixtures/sectors.fixtures'
import type { Sector } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface SectorFilters {
  search?: string
  tipo?: Sector['tipo']
}

export const sectorsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<Sector>([...sectorsFixture])
      return {
        ...base,
        list(filters?: SectorFilters) {
          return base.list((sector) => {
            if (filters?.tipo && sector.tipo !== filters.tipo) return false
            if (filters?.search && !sector.nombre.toLowerCase().includes(filters.search.toLowerCase())) return false
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<Sector>('sectors')
      return {
        ...base,
        list(filters?: SectorFilters) {
          return base.list((query) => {
            if (filters?.tipo) query = query.eq('tipo', filters.tipo)
            if (filters?.search) query = query.ilike('nombre', `%${filters.search}%`)
            return query
          })
        },
      }
    })()
