import { MENSAJE_POBLACION_INSUFICIENTE, calcularTasaPor100k } from '@/lib/calculations/rate'
import { clasificarRiesgo, UMBRAL_RIESGO_GLOBAL_DEFECTO } from '@/lib/calculations/riskClassification'
import { formatRate } from '@/lib/formatters/number'
import type { Clinic, HealthRecord, RiskThreshold, Sector, SectorPopulation } from '@/types/database.types'
import type { ComparisonFilters, ComparisonRow } from '../types/comparison.types'

interface BuildComparisonRowsInput {
  filters: ComparisonFilters
  records: HealthRecord[]
  clinics: Clinic[]
  sectors: Sector[]
  sectorPopulation: SectorPopulation[]
  riskThresholds: RiskThreshold[]
}

export function buildComparisonRows({ filters, records, clinics, sectors, sectorPopulation, riskThresholds }: BuildComparisonRowsInput): ComparisonRow[] {
  const populationBySector = new Map(sectorPopulation.map((row) => [row.sector_id, row.poblacion]))
  const threshold =
    riskThresholds.find((row) => row.ambito === 'enfermedad' && row.disease_id === filters.diseaseId) ??
    riskThresholds.find((row) => row.ambito === 'global') ??
    { ...UMBRAL_RIESGO_GLOBAL_DEFECTO }

  const entities = filters.modo === 'clinicas' ? clinics : sectors

  return entities.map((entity) => {
    const casos =
      filters.modo === 'clinicas'
        ? records.filter((r) => r.clinic_id === entity.id).reduce((total, r) => total + r.cantidad_casos, 0)
        : records.filter((r) => r.sector_id === entity.id).reduce((total, r) => total + r.cantidad_casos, 0)

    const sectorId = filters.modo === 'clinicas' ? (entity as Clinic).sector_id : entity.id
    const poblacion = populationBySector.get(sectorId) ?? null

    const tasaResultado = calcularTasaPor100k(casos, poblacion)
    const riesgo = tasaResultado.suficiente ? clasificarRiesgo(tasaResultado.tasa!, threshold) : null

    return {
      id: entity.id,
      nombre: filters.modo === 'clinicas' ? (entity as Clinic).nombre_corto : entity.nombre,
      casos,
      poblacion,
      tasaLabel: tasaResultado.suficiente ? formatRate(tasaResultado.tasa!) : MENSAJE_POBLACION_INSUFICIENTE,
      tasaValor: tasaResultado.suficiente ? tasaResultado.tasa! : null,
      riesgo,
    }
  })
}
