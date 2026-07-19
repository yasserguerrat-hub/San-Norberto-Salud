import { IS_DEMO_DATA } from '@/app/config/constants'
import { demographicPopulationFixture } from '@/data/fixtures/demographicPopulation.fixtures'
import type { DemographicPopulation } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface DemographicPopulationFilters {
  anio?: number
  /** undefined = sin filtro · null = solo registros de toda la comuna · string = un sector. */
  sectorId?: string | null
  genderId?: string
}

export const demographicPopulationRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<DemographicPopulation>([...demographicPopulationFixture])
      return {
        ...base,
        list(filters?: DemographicPopulationFilters) {
          return base.list((row) => {
            if (filters?.anio && row.anio !== filters.anio) return false
            if (filters?.sectorId !== undefined && row.sector_id !== filters.sectorId) return false
            if (filters?.genderId && row.gender_id !== filters.genderId) return false
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<DemographicPopulation>('demographic_population')
      return {
        ...base,
        list(filters?: DemographicPopulationFilters) {
          return base.list((query) => {
            if (filters?.anio) query = query.eq('anio', filters.anio)
            if (filters?.sectorId !== undefined) {
              query = filters.sectorId === null ? query.is('sector_id', null) : query.eq('sector_id', filters.sectorId)
            }
            if (filters?.genderId) query = query.eq('gender_id', filters.genderId)
            return query
          })
        },
      }
    })()
