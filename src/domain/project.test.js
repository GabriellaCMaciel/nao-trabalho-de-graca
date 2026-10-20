import { describe, it, expect } from 'vitest'
import { calculateProjectPrice } from './project.js'

describe('calculateProjectPrice', () => {
  it('40 horas a R$ 100 com 20% de margem → R$ 4.800', () => {
    expect(calculateProjectPrice({ hourly: 100, projectHours: 40, riskMargin: 20 })).toEqual({
      base: 4000,
      riskAmount: 800,
      total: 4800,
    })
  })

  it('margem zero não acrescenta nada', () => {
    const r = calculateProjectPrice({ hourly: 59.85, projectHours: 10, riskMargin: 0 })
    expect(r.riskAmount).toBe(0)
    expect(r.total).toBe(r.base)
  })

  it('arredonda sempre para cima, em centavos', () => {
    const r = calculateProjectPrice({ hourly: 33.333, projectHours: 3, riskMargin: 15 })
    expect(r.base).toBe(100)
    expect(r.riskAmount).toBe(15)
    expect(r.total).toBe(115)
  })
})
