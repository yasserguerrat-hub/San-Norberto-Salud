import type { HealthRecord } from '@/types/database.types'

interface RecordKey {
  clinic_id?: string | null
  sector_id: string
  disease_id: string
  age_range_id: string
  gender_id: string
  mes: number
  anio: number
}

// RF-10: antes de guardar, verificar duplicados por combinación de clínica/sector, enfermedad,
// edad, género, mes y año, mostrando el registro existente si hay coincidencia.
export function findDuplicateRecord(candidate: RecordKey, existing: HealthRecord[], excludeId?: string): HealthRecord | null {
  return (
    existing.find(
      (record) =>
        record.id !== excludeId &&
        (record.clinic_id ?? null) === (candidate.clinic_id ?? null) &&
        record.sector_id === candidate.sector_id &&
        record.disease_id === candidate.disease_id &&
        record.age_range_id === candidate.age_range_id &&
        record.gender_id === candidate.gender_id &&
        record.mes === candidate.mes &&
        record.anio === candidate.anio,
    ) ?? null
  )
}
