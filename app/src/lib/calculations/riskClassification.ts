import type { NivelRiesgo } from '@/types/enums'
import type { RiskThreshold } from '@/types/database.types'

// Umbrales por defecto (RF-07), iguales a los usados en el prototipo visual de referencia.
// bajo: tasa < 25 · medio: 25–50 · alto: 50–150 · extremo: > 150 (por 100.000 hab.)
export const UMBRAL_RIESGO_GLOBAL_DEFECTO: Pick<
  RiskThreshold,
  'umbral_bajo_max' | 'umbral_medio_max' | 'umbral_alto_max'
> = {
  umbral_bajo_max: 25,
  umbral_medio_max: 50,
  umbral_alto_max: 150,
}

export function clasificarRiesgo(
  tasa: number,
  umbral: Pick<RiskThreshold, 'umbral_bajo_max' | 'umbral_medio_max' | 'umbral_alto_max'> = UMBRAL_RIESGO_GLOBAL_DEFECTO,
): NivelRiesgo {
  if (tasa < umbral.umbral_bajo_max) return 'bajo'
  if (tasa <= umbral.umbral_medio_max) return 'medio'
  if (tasa <= umbral.umbral_alto_max) return 'alto'
  return 'extremo'
}
