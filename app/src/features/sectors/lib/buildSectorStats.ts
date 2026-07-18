import { MENSAJE_POBLACION_INSUFICIENTE, calcularTasaPor100k } from '@/lib/calculations/rate'
import { clasificarRiesgo } from '@/lib/calculations/riskClassification'
import { formatNumber, formatRate } from '@/lib/formatters/number'
import type { Disease, HealthRecord, RiskThreshold, Sector, SectorPopulation } from '@/types/database.types'
import type { SectorWithStats } from '../types/sector.types'

interface BuildSectorStatsInput {
  sectors: Sector[]
  records: HealthRecord[]
  sectorPopulation: SectorPopulation[]
  diseases: Disease[]
  riskThresholds: RiskThreshold[]
}

function resolveThreshold(riskThresholds: RiskThreshold[], diseaseId: string | null) {
  const specific = diseaseId
    ? riskThresholds.find((row) => row.ambito === 'enfermedad' && row.disease_id === diseaseId)
    : undefined
  return specific ?? riskThresholds.find((row) => row.ambito === 'global')
}

export function buildSectorStats({ sectors, records, sectorPopulation, diseases, riskThresholds }: BuildSectorStatsInput): SectorWithStats[] {
  const populationBySector = new Map(sectorPopulation.map((row) => [row.sector_id, row.poblacion]))

  return sectors.map((sector) => {
    const sectorRecords = records.filter((r) => r.sector_id === sector.id)

    // La tasa es siempre de UNA enfermedad (ver PRD 9.1): se usa la de mayor incidencia
    // del sector ("enfermedad principal"), nunca la suma de enfermedades no relacionadas.
    const porEnfermedad = new Map<string, number>()
    for (const record of sectorRecords) {
      porEnfermedad.set(record.disease_id, (porEnfermedad.get(record.disease_id) ?? 0) + record.cantidad_casos)
    }
    let enfermedadPrincipalId: string | null = null
    let maxCasos = -1
    for (const [diseaseId, value] of porEnfermedad) {
      if (value > maxCasos) {
        maxCasos = value
        enfermedadPrincipalId = diseaseId
      }
    }

    const casos = enfermedadPrincipalId ? (porEnfermedad.get(enfermedadPrincipalId) ?? 0) : 0
    const poblacion = populationBySector.get(sector.id) ?? null
    const tasaResultado = calcularTasaPor100k(casos, poblacion)
    const threshold = resolveThreshold(riskThresholds, enfermedadPrincipalId)
    const riesgo = tasaResultado.suficiente && threshold ? clasificarRiesgo(tasaResultado.tasa!, threshold) : null

    return {
      id: sector.id,
      name: sector.nombre,
      tipo: sector.tipo === 'urbano' ? 'Urbano' : 'Rural',
      poblacion: poblacion ?? 0,
      poblacionFmt: poblacion != null ? formatNumber(poblacion) : '—',
      casos,
      tasaLabel: tasaResultado.suficiente ? formatRate(tasaResultado.tasa!) : MENSAJE_POBLACION_INSUFICIENTE,
      riesgo,
      enfermedadPrincipal: diseases.find((d) => d.id === enfermedadPrincipalId)?.nombre ?? null,
    }
  })
}
