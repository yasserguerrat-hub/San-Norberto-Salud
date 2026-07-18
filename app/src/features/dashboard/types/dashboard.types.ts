import type { NivelRiesgo } from '@/types/enums'

export interface DashboardFilters {
  mes: number
  anio: number
  sectorId: string | 'todos'
  diseaseId: string | 'todas'
}

export interface DashboardKpi {
  label: string
  value: string
  sub: string
}

export interface DashboardDiseaseDatum {
  diseaseId: string
  label: string
  value: number
  active: boolean
}

export interface DashboardGenderDatum {
  genderId: string
  label: string
  value: number
  pct: number
  color: string
}

export interface DashboardSectorRankingRow {
  sectorId: string
  name: string
  tipo: string
  poblacion: number
  poblacionFmt: string
  casos: number
  tasaLabel: string
  riesgo: NivelRiesgo | null
  enfermedadPrincipal: string | null
  isFilterActive: boolean
}

export interface DashboardViewModel {
  kpis: DashboardKpi[]
  diseaseChart: DashboardDiseaseDatum[]
  genderChart: DashboardGenderDatum[]
  sectorRanking: DashboardSectorRankingRow[]
  enfermedadInfo: string | null
  sectorFiltroInfo: string | null
  periodoLabel: string
}
