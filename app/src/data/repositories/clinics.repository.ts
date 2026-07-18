import { clinicsFixture } from '@/data/fixtures/clinics.fixtures'
import type { Clinic } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...clinicsFixture]
const base = createInMemoryRepository<Clinic>(store)

export interface ClinicFilters {
  search?: string
  sectorId?: string
  estado?: Clinic['estado']
}

export const clinicsRepository = {
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
