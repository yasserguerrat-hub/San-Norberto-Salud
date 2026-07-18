import { IS_DEMO_DATA } from '@/app/config/constants'
import { sectorPopulationFixture } from '@/data/fixtures/sectorPopulation.fixtures'
import type { SectorPopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface SectorPopulationFilters {
  anio?: number
  sectorId?: string
}

export const sectorPopulationRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<SectorPopulation>([...sectorPopulationFixture])
      return {
        ...base,
        list(filters?: SectorPopulationFilters) {
          return base.list((row) => {
            if (filters?.anio && row.anio !== filters.anio) return false
            if (filters?.sectorId && row.sector_id !== filters.sectorId) return false
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<SectorPopulation>('sector_population')
      return {
        ...base,
        list(filters?: SectorPopulationFilters) {
          return base.list((query) => {
            if (filters?.anio) query = query.eq('anio', filters.anio)
            if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId)
            return query
          })
        },
      }
    })()
