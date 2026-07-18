import { describe, expect, it } from 'vitest'
import { MENSAJE_POBLACION_INSUFICIENTE, calcularTasaPor100k } from '../rate'

describe('calcularTasaPor100k', () => {
  it('calcula la tasa por 100.000 habitantes', () => {
    const resultado = calcularTasaPor100k(28, 31200)
    expect(resultado.suficiente).toBe(true)
    expect(resultado.tasa).toBeCloseTo(89.74, 1)
  })

  it('indica población insuficiente cuando la población es 0', () => {
    const resultado = calcularTasaPor100k(10, 0)
    expect(resultado.suficiente).toBe(false)
    expect(resultado.tasa).toBeNull()
    expect(resultado.mensaje).toBe(MENSAJE_POBLACION_INSUFICIENTE)
  })

  it('indica población insuficiente cuando no hay población asignada', () => {
    const resultado = calcularTasaPor100k(10, null)
    expect(resultado.suficiente).toBe(false)
    expect(resultado.tasa).toBeNull()
  })

  it('indica población insuficiente cuando la población es negativa', () => {
    const resultado = calcularTasaPor100k(10, -5)
    expect(resultado.suficiente).toBe(false)
  })
})
