// RF-13 / RF-14: tasa por cada 100.000 habitantes.
// Tasa = (cantidad de casos / población correspondiente) × 100.000
// Si no existe población compatible, no se calcula la tasa: se debe indicar explícitamente
// "Datos de población insuficientes" en la UI en vez de mostrar un valor engañoso.

export const MENSAJE_POBLACION_INSUFICIENTE = 'Datos de población insuficientes'

export interface ResultadoTasa {
  suficiente: boolean
  tasa: number | null
  mensaje?: string
}

export function calcularTasaPor100k(
  casos: number,
  poblacion: number | null | undefined,
): ResultadoTasa {
  if (poblacion == null || poblacion <= 0) {
    return { suficiente: false, tasa: null, mensaje: MENSAJE_POBLACION_INSUFICIENTE }
  }

  return { suficiente: true, tasa: (casos / poblacion) * 100_000 }
}
