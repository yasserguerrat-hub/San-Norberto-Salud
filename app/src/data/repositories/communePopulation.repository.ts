import { IS_DEMO_DATA } from '@/app/config/constants'
import { communePopulationFixture } from '@/data/fixtures/communePopulation.fixtures'
import type { CommunePopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface CommunePopulationFilters {
  anio?: number
}

export const communePopulationRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<CommunePopulation>([...communePopulationFixture])
      return {
        ...base,
        list(filters?: CommunePopulationFilters) {
          return base.list((row) => (filters?.anio ? row.anio === filters.anio : true))
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<CommunePopulation>('commune_population')
      return {
        ...base,
        list(filters?: CommunePopulationFilters) {
          return base.list((query) => (filters?.anio ? query.eq('anio', filters.anio) : query))
        },
      }
    })()
