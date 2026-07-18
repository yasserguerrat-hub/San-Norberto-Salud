import { describe, expect, it } from 'vitest'
import { UMBRAL_RIESGO_GLOBAL_DEFECTO, clasificarRiesgo } from '../riskClassification'

describe('clasificarRiesgo', () => {
  it('clasifica como bajo por debajo del umbral bajo', () => {
    expect(clasificarRiesgo(10)).toBe('bajo')
    expect(clasificarRiesgo(24.9)).toBe('bajo')
  })

  it('clasifica como medio en el rango medio', () => {
    expect(clasificarRiesgo(25)).toBe('medio')
    expect(clasificarRiesgo(50)).toBe('medio')
  })

  it('clasifica como alto en el rango alto', () => {
    expect(clasificarRiesgo(50.1)).toBe('alto')
    expect(clasificarRiesgo(150)).toBe('alto')
  })

  it('clasifica como extremo por sobre el umbral alto', () => {
    expect(clasificarRiesgo(150.1)).toBe('extremo')
    expect(clasificarRiesgo(500)).toBe('extremo')
  })

  it('respeta umbrales personalizados', () => {
    const umbralPersonalizado = { umbral_bajo_max: 10, umbral_medio_max: 20, umbral_alto_max: 30 }
    expect(clasificarRiesgo(15, umbralPersonalizado)).toBe('medio')
    expect(clasificarRiesgo(35, umbralPersonalizado)).toBe('extremo')
  })

  it('exporta el umbral global por defecto usado en el prototipo', () => {
    expect(UMBRAL_RIESGO_GLOBAL_DEFECTO).toEqual({
      umbral_bajo_max: 25,
      umbral_medio_max: 50,
      umbral_alto_max: 150,
    })
  })
})
