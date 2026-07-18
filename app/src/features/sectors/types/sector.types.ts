import type { NivelRiesgo } from '@/types/enums'

export interface SectorWithStats {
  id: string
  name: string
  tipo: string
  poblacion: number
  poblacionFmt: string
  casos: number
  tasaLabel: string
  riesgo: NivelRiesgo | null
  enfermedadPrincipal: string | null
}
