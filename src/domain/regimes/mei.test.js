import { describe, it, expect } from 'vitest'
import { calculateMei, DAS_MEI_SERVICOS } from './mei.js'

describe('calculateMei', () => {
  it('o DAS de serviços em 2026 é R$ 86,05 (5% de R$ 1.621 + R$ 5 de ISS)', () => {
    expect(DAS_MEI_SERVICOS).toBe(86.05)
  })

  it('desconta só o DAS e os custos fixos', () => {
    const r = calculateMei(5000, { fixedCosts: 300 })
    expect(r.taxTotal).toBe(86.05)
    expect(r.netMonthly).toBe(4613.95)
    expect(r.taxes).toHaveLength(1)
  })

  it('o imposto é fixo: faturar mais não aumenta o DAS', () => {
    expect(calculateMei(2000, { fixedCosts: 0 }).taxTotal).toBe(calculateMei(6750, { fixedCosts: 0 }).taxTotal)
  })

  it('calcula a alíquota efetiva sobre o faturamento', () => {
    const r = calculateMei(6750, { fixedCosts: 0 })
    expect(r.effectiveRate).toBeCloseTo(86.05 / 6750, 6)
  })

  it('sem faturamento ainda paga o DAS e a alíquota efetiva é zero', () => {
    const r = calculateMei(0, { fixedCosts: 100 })
    expect(r.netMonthly).toBe(-186.05)
    expect(r.effectiveRate).toBe(0)
  })
})
