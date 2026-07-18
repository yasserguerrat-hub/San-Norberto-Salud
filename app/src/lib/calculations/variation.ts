// RF-15: variación porcentual entre períodos.
// Variación = ((valor actual - valor anterior) / valor anterior) × 100
// Si el valor anterior es cero, no se realiza la división: se muestra un aviso especial
// explicando que no es posible calcular una variación porcentual convencional.

export const MENSAJE_BASE_CERO =
  'No es posible calcular una variación porcentual convencional (el valor del período anterior es 0)'

export interface ResultadoVariacion {
  calculable: boolean
  variacionPct: number | null
  mensaje?: string
}

export function calcularVariacionPorcentual(actual: number, anterior: number): ResultadoVariacion {
  if (anterior === 0) {
    return { calculable: false, variacionPct: null, mensaje: MENSAJE_BASE_CERO }
  }

  return { calculable: true, variacionPct: ((actual - anterior) / anterior) * 100 }
}
