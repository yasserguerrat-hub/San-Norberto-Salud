import type { AgeRange, Clinic, Disease, GenderCategory, HealthRecord, Sector } from '@/types/database.types'
import type { EstadoFilaImportacion } from '@/types/enums'
import { findDuplicateRecord } from './findDuplicateRecord'
import { normalizeText } from './normalizeText'

export interface ParsedImportRow {
  numero_fila: number
  datosOriginales: Record<string, string>
  estado: EstadoFilaImportacion
  errores: string[]
  esPosibleDuplicado: boolean
  resuelto: {
    disease_id: string
    age_range_id: string
    gender_id: string
    clinic_id: string | null
    sector_id: string
    mes: number
    anio: number
    cantidad_casos: number
  } | null
  duplicadoDe?: HealthRecord
  incluida: boolean
}

interface ParseContext {
  diseases: Disease[]
  ageRanges: AgeRange[]
  genders: GenderCategory[]
  sectors: Sector[]
  clinics: Clinic[]
  existingRecords: HealthRecord[]
}

export function parseImportRows(rows: Record<string, string>[], ctx: ParseContext): ParsedImportRow[] {
  return rows.map((raw, index) => {
    const errores: string[] = []

    const disease = ctx.diseases.find((d) => normalizeText(d.nombre) === normalizeText(raw.enfermedad))
    if (!disease) errores.push(`Enfermedad "${raw.enfermedad ?? ''}" no coincide con el catálogo`)

    const ageRange = ctx.ageRanges.find((a) => normalizeText(a.nombre) === normalizeText(raw.rango_edad))
    if (!ageRange) errores.push(`Rango de edad "${raw.rango_edad ?? ''}" no coincide con el catálogo`)

    const gender = ctx.genders.find((g) => normalizeText(g.nombre) === normalizeText(raw.genero))
    if (!gender) errores.push(`Género "${raw.genero ?? ''}" no coincide con el catálogo`)

    const clinic = raw.clinica
      ? ctx.clinics.find((c) => normalizeText(c.nombre_corto) === normalizeText(raw.clinica) || normalizeText(c.nombre) === normalizeText(raw.clinica))
      : undefined
    if (raw.clinica && !clinic) errores.push(`Clínica "${raw.clinica}" no coincide con el catálogo`)

    const sectorFromInput = raw.sector ? ctx.sectors.find((s) => normalizeText(s.nombre) === normalizeText(raw.sector)) : undefined
    const sector = clinic ? ctx.sectors.find((s) => s.id === clinic.sector_id) : sectorFromInput
    if (!clinic && raw.sector && !sectorFromInput) errores.push(`Sector "${raw.sector}" no coincide con el catálogo`)
    if (!clinic && !raw.sector) errores.push('Indica una clínica o un sector')

    const mes = Number(raw.mes)
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) errores.push('Mes inválido (debe ser 1-12)')

    const anio = Number(raw.anio)
    if (!Number.isInteger(anio) || anio < 2020 || anio > 2100) errores.push('Año inválido')

    const casos = Number(raw.casos)
    if (!Number.isInteger(casos) || casos < 0) errores.push('La cantidad de casos debe ser un entero no negativo')

    const resuelto =
      disease && ageRange && gender && sector && errores.length === 0
        ? {
            disease_id: disease.id,
            age_range_id: ageRange.id,
            gender_id: gender.id,
            clinic_id: clinic?.id ?? null,
            sector_id: sector.id,
            mes,
            anio,
            cantidad_casos: casos,
          }
        : null

    let duplicadoDe: HealthRecord | undefined
    if (resuelto) {
      duplicadoDe = findDuplicateRecord(resuelto, ctx.existingRecords) ?? undefined
    }

    const estado: EstadoFilaImportacion = errores.length > 0 ? 'error' : duplicadoDe ? 'advertencia' : 'valida'

    return {
      numero_fila: index + 2,
      datosOriginales: raw,
      estado,
      errores,
      esPosibleDuplicado: !!duplicadoDe,
      resuelto,
      duplicadoDe,
      incluida: estado === 'valida',
    }
  })
}
