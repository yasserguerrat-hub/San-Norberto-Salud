import { MENSAJE_POBLACION_INSUFICIENTE, calcularTasaPor100k } from '@/lib/calculations/rate'
import { clasificarRiesgo } from '@/lib/calculations/riskClassification'
import { calcularVariacionPorcentual } from '@/lib/calculations/variation'
import { GENDER_CHART_COLORS } from '@/lib/chart-colors'
import { formatMonthYear } from '@/lib/formatters/date'
import { formatNumber, formatPercent, formatRate } from '@/lib/formatters/number'
import type {
  AgeRange,
  Clinic,
  Disease,
  GenderCategory,
  HealthRecord,
  RiskThreshold,
  Sector,
  SectorPopulation,
} from '@/types/database.types'
import type { DashboardFilters, DashboardViewModel } from '../types/dashboard.types'

interface BuildDashboardViewModelInput {
  filters: DashboardFilters
  records: HealthRecord[]
  previousRecords: HealthRecord[]
  pendingRecords: HealthRecord[]
  diseases: Disease[]
  sectors: Sector[]
  clinics: Clinic[]
  sectorPopulation: SectorPopulation[]
  riskThresholds: RiskThreshold[]
  genders: GenderCategory[]
  ageRanges: AgeRange[]
}

function sumCasos(records: HealthRecord[]): number {
  return records.reduce((total, record) => total + record.cantidad_casos, 0)
}

function resolveThreshold(riskThresholds: RiskThreshold[], diseaseId: string | null) {
  const specific = diseaseId
    ? riskThresholds.find((row) => row.ambito === 'enfermedad' && row.disease_id === diseaseId)
    : undefined
  return specific ?? riskThresholds.find((row) => row.ambito === 'global')
}

export function buildDashboardViewModel(input: BuildDashboardViewModelInput): DashboardViewModel {
  const { filters, records, previousRecords, pendingRecords, diseases, sectors, clinics, sectorPopulation, riskThresholds, genders, ageRanges } =
    input

  const totalCasosActual = sumCasos(records)
  const totalCasosAnterior = sumCasos(previousRecords)

  // --- Casos por enfermedad ---
  const diseaseChart = diseases
    .map((disease) => {
      const value = sumCasos(records.filter((r) => r.disease_id === disease.id))
      return {
        diseaseId: disease.id,
        label: disease.nombre,
        value,
        active: filters.diseaseId === 'todas' || filters.diseaseId === disease.id,
      }
    })
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value)

  const topEnfermedad = diseaseChart[0] ?? null

  // --- Distribución por sexo/género ---
  const totalGenero = totalCasosActual || 1
  const genderChart = genders.map((gender, index) => {
    const value = sumCasos(records.filter((r) => r.gender_id === gender.id))
    return {
      genderId: gender.id,
      label: gender.nombre,
      value,
      pct: Math.round((value / totalGenero) * 100),
      color: GENDER_CHART_COLORS[index % GENDER_CHART_COLORS.length],
    }
  })

  // --- Rango de edad más afectado ---
  const edadTotals = ageRanges.map((age) => ({
    age,
    value: sumCasos(records.filter((r) => r.age_range_id === age.id)),
  }))
  const topEdad = edadTotals.reduce((a, b) => (b.value > a.value ? b : a), edadTotals[0])
  const topEdadPct = totalCasosActual > 0 ? Math.round((topEdad.value / totalCasosActual) * 100) : 0

  // --- Ranking de sectores por tasa de riesgo ---
  const sectorPopulationBySector = new Map(sectorPopulation.map((row) => [row.sector_id, row.poblacion]))

  const sectorRankingUnsorted = sectors.map((sector) => {
    const registrosSector = records.filter((r) => r.sector_id === sector.id)

    // La tasa siempre es de UNA enfermedad (nunca la suma de enfermedades no relacionadas,
    // ver PRD 9.1): si hay un filtro de enfermedad activo se usa esa; si no, se usa la
    // enfermedad de mayor incidencia del propio sector (equivalente a "enfermedad principal").
    const porEnfermedad = new Map<string, number>()
    for (const record of registrosSector) {
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
    const enfermedadPrincipal = diseases.find((d) => d.id === enfermedadPrincipalId)?.nombre ?? null

    const diseaseIdParaTasa = filters.diseaseId === 'todas' ? enfermedadPrincipalId : filters.diseaseId
    const casos = diseaseIdParaTasa ? (porEnfermedad.get(diseaseIdParaTasa) ?? 0) : 0

    const poblacion = sectorPopulationBySector.get(sector.id) ?? null
    const tasaResultado = calcularTasaPor100k(casos, poblacion)
    const threshold = resolveThreshold(riskThresholds, diseaseIdParaTasa)
    const riesgo = tasaResultado.suficiente && threshold ? clasificarRiesgo(tasaResultado.tasa!, threshold) : null

    return {
      sectorId: sector.id,
      name: sector.nombre,
      tipo: sector.tipo === 'urbano' ? 'Urbano' : 'Rural',
      poblacion: poblacion ?? 0,
      poblacionFmt: poblacion != null ? formatNumber(poblacion) : '—',
      casos,
      tasaLabel: tasaResultado.suficiente ? formatRate(tasaResultado.tasa!) : MENSAJE_POBLACION_INSUFICIENTE,
      riesgo,
      enfermedadPrincipal,
      isFilterActive: filters.sectorId === sector.id,
      _tasaOrdenamiento: tasaResultado.suficiente ? tasaResultado.tasa! : -1,
    }
  })

  const sectorRanking = [...sectorRankingUnsorted]
    .sort((a, b) => b._tasaOrdenamiento - a._tasaOrdenamiento)
    .map(({ _tasaOrdenamiento, ...row }) => row)

  const topRiesgoSector = sectorRanking[0] ?? null

  // --- KPIs ---
  const variacion = calcularVariacionPorcentual(totalCasosActual, totalCasosAnterior)

  const kpis = [
    { label: 'Total de casos', value: formatNumber(totalCasosActual), sub: formatMonthYear(filters.mes, filters.anio) },
    { label: 'Clínicas activas', value: formatNumber(clinics.length), sub: `${clinics.length} centros de salud` },
    { label: 'Sectores', value: formatNumber(sectors.length), sub: 'Comuna de Melipilla' },
    { label: 'Enfermedades registradas', value: formatNumber(diseases.length), sub: 'catálogo activo' },
    {
      label: 'Mayor incidencia',
      value: topEnfermedad?.label ?? '—',
      sub: topEnfermedad ? `${formatNumber(topEnfermedad.value)} casos` : 'Sin datos del período',
    },
    {
      label: 'Sector de mayor riesgo',
      value: topRiesgoSector?.name ?? '—',
      sub: topRiesgoSector?.riesgo ? `Riesgo ${topRiesgoSector.riesgo}` : 'Sin datos suficientes',
    },
    {
      label: 'Rango de edad más afectado',
      value: topEdad?.age.nombre ?? '—',
      sub: totalCasosActual > 0 ? `${topEdadPct}% de los casos` : 'Sin datos del período',
    },
    {
      label: 'Variación vs. mes anterior',
      value: variacion.calculable ? formatPercent(variacion.variacionPct!) : 'N/D',
      sub: variacion.calculable ? 'vs. período previo' : (variacion.mensaje ?? ''),
    },
    { label: 'Pendientes de aprobación', value: formatNumber(pendingRecords.length), sub: 'registros por revisar' },
  ]

  // --- Callouts contextuales ---
  let enfermedadInfo: string | null = null
  if (filters.diseaseId !== 'todas') {
    const disease = diseases.find((d) => d.id === filters.diseaseId)
    const casos = sumCasos(records.filter((r) => r.disease_id === filters.diseaseId))
    const poblacionComuna = sectorPopulation.reduce((total, row) => total + row.poblacion, 0)
    const tasaComuna = calcularTasaPor100k(casos, poblacionComuna)
    enfermedadInfo = disease
      ? `${disease.nombre}: ${formatNumber(casos)} casos · tasa ${
          tasaComuna.suficiente ? `${formatRate(tasaComuna.tasa!)} por 100.000 hab.` : MENSAJE_POBLACION_INSUFICIENTE
        }`
      : null
  }

  let sectorFiltroInfo: string | null = null
  if (filters.sectorId !== 'todos') {
    const row = sectorRanking.find((r) => r.sectorId === filters.sectorId)
    if (row) {
      sectorFiltroInfo = `${row.name}: ${formatNumber(row.casos)} casos${row.enfermedadPrincipal ? ` de ${row.enfermedadPrincipal}` : ''} · tasa ${row.tasaLabel} · riesgo ${row.riesgo ?? 'sin datos'}`
    }
  }

  return {
    kpis,
    diseaseChart,
    genderChart,
    sectorRanking,
    enfermedadInfo,
    sectorFiltroInfo,
    periodoLabel: formatMonthYear(filters.mes, filters.anio),
  }
}
