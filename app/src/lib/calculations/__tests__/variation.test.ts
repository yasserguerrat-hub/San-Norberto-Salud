import { describe, expect, it } from 'vitest'
import { MENSAJE_BASE_CERO, calcularVariacionPorcentual } from '../variation'

describe('calcularVariacionPorcentual', () => {
  it('calcula un incremento porcentual', () => {
    const resultado = calcularVariacionPorcentual(176, 150)
    expect(resultado.calculable).toBe(true)
    expect(resultado.variacionPct).toBeCloseTo(17.33, 1)
  })

  it('calcula una disminución porcentual', () => {
    const resultado = calcularVariacionPorcentual(90, 150)
    expect(resultado.calculable).toBe(true)
    expect(resultado.variacionPct).toBeCloseTo(-40, 1)
  })

  it('muestra un aviso especial cuando el valor anterior es cero', () => {
    const resultado = calcularVariacionPorcentual(12, 0)
    expect(resultado.calculable).toBe(false)
    expect(resultado.variacionPct).toBeNull()
    expect(resultado.mensaje).toBe(MENSAJE_BASE_CERO)
  })
})
