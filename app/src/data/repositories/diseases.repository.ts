import { IS_DEMO_DATA } from '@/app/config/constants'
import { diseasesFixture } from '@/data/fixtures/diseases.fixtures'
import type { Disease } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface DiseaseFilters {
  search?: string
  tipo?: Disease['tipo']
  estado?: Disease['estado']
}

export const diseasesRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<Disease>([...diseasesFixture])
      return {
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
    })()
  : (() => {
      const base = createSupabaseRepository<Disease>('diseases')
      return {
        ...base,
        list(filters?: DiseaseFilters) {
          return base.list((query) => {
            if (filters?.tipo) query = query.eq('tipo', filters.tipo)
            if (filters?.estado) query = query.eq('estado', filters.estado)
            if (filters?.search) query = query.ilike('nombre', `%${filters.search}%`)
            return query
          })
        },
      }
    })()
