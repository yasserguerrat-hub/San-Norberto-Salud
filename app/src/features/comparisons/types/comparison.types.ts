import type { NivelRiesgo } from '@/types/enums'

export interface ComparisonFilters {
  modo: 'clinicas' | 'sectores'
  diseaseId: string
  mes: number
  anio: number
}

export interface ComparisonRow {
  id: string
  nombre: string
  casos: number
  poblacion: number | null
  tasaLabel: string
  tasaValor: number | null
  riesgo: NivelRiesgo | null
}
