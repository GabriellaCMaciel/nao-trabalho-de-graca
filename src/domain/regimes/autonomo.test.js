import { describe, it, expect } from 'vitest'
import { calculateAutonomo } from './autonomo.js'

const normal = { fixedCosts: 300, inssPlan: 'normal' }

describe('calculateAutonomo', () => {
  it('R$ 5.000: INSS de 20% e IR zerado pelo redutor de 2026', () => {
    const r = calculateAutonomo(5000, normal)
    expect(r.taxes.find((t) => t.key === 'inss').value).toBe(1000)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(0) // base R$ 3.700 → R$ 160,84, coberto pelo redutor
    expect(r.netMonthly).toBe(3700)
  })

  it('R$ 10.000: INSS travado no teto e IR pela tabela cheia', () => {
    const r = calculateAutonomo(10_000, normal)
    expect(r.taxes.find((t) => t.key === 'inss').value).toBe(1695.11)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(1292.61)
    expect(r.netMonthly).toBe(6712.28)
  })

  it('plano simplificado: INSS menor, mas IR aparece onde o normal zerava', () => {
    const r = calculateAutonomo(5000, { fixedCosts: 300, inssPlan: 'simplificado' })
    expect(r.taxes.find((t) => t.key === 'inss').value).toBe(178.31)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(29)
    expect(r.netMonthly).toBe(4492.69)
  })

  it('custos fixos maiores que o faturamento não geram base negativa', () => {
    const r = calculateAutonomo(1000, { fixedCosts: 5000, inssPlan: 'normal' })
    expect(r.irpfBase).toBe(0)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(0)
  })

  it('sem faturamento não há imposto', () => {
    const r = calculateAutonomo(0, normal)
    expect(r.taxTotal).toBe(0)
    expect(r.netMonthly).toBe(-300)
  })
})
