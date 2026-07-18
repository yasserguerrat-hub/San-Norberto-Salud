import { healthRecordsFixture } from '@/data/fixtures/healthRecords.fixtures'
import type { HealthRecord } from '@/types/database.types'
import type { EstadoRegistro } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...healthRecordsFixture]
const base = createInMemoryRepository<HealthRecord>(store)

export interface HealthRecordFilters {
  anio?: number
  mes?: number
  clinicId?: string
  sectorId?: string
  diseaseId?: string
  ageRangeId?: string
  genderId?: string
  estado?: EstadoRegistro
  /** Restringe a un usuario de clínica a sus propios registros (RF-03). */
  scopedClinicId?: string
}

export const healthRecordsRepository = {
  ...base,
  list(filters?: HealthRecordFilters) {
    return base.list((record) => {
      if (filters?.scopedClinicId && record.clinic_id !== filters.scopedClinicId) return false
      if (filters?.anio && record.anio !== filters.anio) return false
      if (filters?.mes && record.mes !== filters.mes) return false
      if (filters?.clinicId && record.clinic_id !== filters.clinicId) return false
      if (filters?.sectorId && record.sector_id !== filters.sectorId) return false
      if (filters?.diseaseId && record.disease_id !== filters.diseaseId) return false
      if (filters?.ageRangeId && record.age_range_id !== filters.ageRangeId) return false
      if (filters?.genderId && record.gender_id !== filters.genderId) return false
      if (filters?.estado && record.estado !== filters.estado) return false
      return true
    })
  },
}
