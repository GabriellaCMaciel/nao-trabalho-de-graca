import { describe, it, expect } from 'vitest'
import { calculateCltEquivalent, cltAnnualValue, cltNetMonthly } from './clt.js'

describe('cltNetMonthly', () => {
  it('R$ 3.000: INSS de R$ 248,60 e sem IR', () => {
    expect(cltNetMonthly(3000)).toBe(2751.4)
  })

  it('R$ 10.000: INSS no teto e IR pela tabela cheia', () => {
    // INSS 988,09 → base 9.011,91 → IR 1.569,55
    expect(cltNetMonthly(10_000)).toBeCloseTo(10_000 - 988.09 - 1569.55, 1)
  })

  it('o líquido sempre cresce quando o bruto cresce', () => {
    let anterior = 0
    for (let s = 500; s <= 30_000; s += 250) {
      const liquido = cltNetMonthly(s)
      expect(liquido).toBeGreaterThanOrEqual(anterior)
      anterior = liquido
    }
  })

  it('zero ou negativo vira zero', () => {
    expect(cltNetMonthly(0)).toBe(0)
    expect(cltNetMonthly(-1)).toBe(0)
  })
})

describe('cltAnnualValue', () => {
  it('soma 13º, férias com 1/3 e FGTS ao salário dos 12 meses', () => {
    const r = cltAnnualValue(3000)
    expect(r.thirteenthNet).toBe(2751.4)
    expect(r.feriasBonusNet).toBe(880) // 1/3 de R$ 3.000 = R$ 1.000, menos R$ 120 de INSS
    expect(r.fgts).toBe(3200) // 8% × (12 × 3.000 + 3.000 + 1.000)
    expect(r.annualValue).toBeCloseTo(r.annualCash + r.fgts, 1)
    expect(r.annualCash).toBeGreaterThan(12 * r.monthlyNet)
  })
})

describe('calculateCltEquivalent', () => {
  it('o valor anual do salário encontrado bate com o alvo (até R$ 1)', () => {
    for (const liquido of [2000, 5000, 10_000, 25_000]) {
      const r = calculateCltEquivalent(liquido)
      expect(Math.abs(r.annualValue - liquido * 12)).toBeLessThan(1)
    }
  })

  it('o salário CLT equivalente é menor que o líquido desejado (13º, férias e FGTS ajudam)', () => {
    const r = calculateCltEquivalent(5000)
    expect(r.salario).toBeLessThan(5000)
    expect(r.salario).toBeGreaterThan(3000)
  })

  it('quanto maior o líquido desejado, maior o salário equivalente', () => {
    expect(calculateCltEquivalent(8000).salario).toBeGreaterThan(calculateCltEquivalent(4000).salario)
  })
})
