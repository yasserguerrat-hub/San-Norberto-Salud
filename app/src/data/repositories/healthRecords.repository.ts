import { IS_DEMO_DATA } from '@/app/config/constants'
import { healthRecordsFixture } from '@/data/fixtures/healthRecords.fixtures'
import type { HealthRecord } from '@/types/database.types'
import type { EstadoRegistro } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface HealthRecordFilters {
  anio?: number
  mes?: number
  clinicId?: string
  sectorId?: string
  diseaseId?: string
  ageRangeId?: string
  genderId?: string
  estado?: EstadoRegistro
  /** Restringe a un usuario de clínica a sus propios registros (RF-03). En Supabase esto ya lo
   * hace RLS; se mantiene como filtro explícito para vistas de administrador acotadas por URL. */
  scopedClinicId?: string
}

export const healthRecordsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<HealthRecord>([...healthRecordsFixture])
      return {
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
    })()
  : (() => {
      const base = createSupabaseRepository<HealthRecord>('health_records')
      return {
        ...base,
        list(filters?: HealthRecordFilters) {
          return base.list((query) => {
            if (filters?.scopedClinicId) query = query.eq('clinic_id', filters.scopedClinicId)
            if (filters?.anio) query = query.eq('anio', filters.anio)
            if (filters?.mes) query = query.eq('mes', filters.mes)
            if (filters?.clinicId) query = query.eq('clinic_id', filters.clinicId)
            if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId)
            if (filters?.diseaseId) query = query.eq('disease_id', filters.diseaseId)
            if (filters?.ageRangeId) query = query.eq('age_range_id', filters.ageRangeId)
            if (filters?.genderId) query = query.eq('gender_id', filters.genderId)
            if (filters?.estado) query = query.eq('estado', filters.estado)
            return query
          })
        },
      }
    })()
