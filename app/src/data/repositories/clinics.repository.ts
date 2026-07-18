import { IS_DEMO_DATA } from '@/app/config/constants'
import { clinicsFixture } from '@/data/fixtures/clinics.fixtures'
import type { Clinic } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface ClinicFilters {
  search?: string
  sectorId?: string
  estado?: Clinic['estado']
}

export const clinicsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<Clinic>([...clinicsFixture])
      return {
        ...base,
        list(filters?: ClinicFilters) {
          return base.list((clinic) => {
            if (filters?.sectorId && clinic.sector_id !== filters.sectorId) return false
            if (filters?.estado && clinic.estado !== filters.estado) return false
            if (filters?.search) {
              const q = filters.search.toLowerCase()
              if (!clinic.nombre.toLowerCase().includes(q) && !clinic.nombre_corto.toLowerCase().includes(q)) {
                return false
              }
            }
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<Clinic>('clinics')
      return {
        ...base,
        list(filters?: ClinicFilters) {
          return base.list((query) => {
            if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId)
            if (filters?.estado) query = query.eq('estado', filters.estado)
            if (filters?.search) {
              query = query.or(`nombre.ilike.%${filters.search}%,nombre_corto.ilike.%${filters.search}%`)
            }
            return query
          })
        },
      }
    })()
