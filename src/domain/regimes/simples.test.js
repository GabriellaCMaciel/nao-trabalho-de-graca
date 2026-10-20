import { describe, it, expect } from 'vitest'
import { aliquotaEfetivaSimples, calculateSimples, proLabore } from './simples.js'

describe('aliquotaEfetivaSimples', () => {
  it('primeira faixa: alíquota nominal, sem dedução', () => {
    expect(aliquotaEfetivaSimples(120_000, 'III')).toBe(0.06)
    expect(aliquotaEfetivaSimples(120_000, 'V')).toBe(0.155)
  })
  it('R$ 420.000 no Anexo III → 9,30% (exemplo conferido)', () => {
    expect(aliquotaEfetivaSimples(420_000, 'III')).toBeCloseTo(0.093, 4)
  })
  it('R$ 360.000 no Anexo III → 8,6% (limite da 2ª faixa)', () => {
    expect(aliquotaEfetivaSimples(360_000, 'III')).toBeCloseTo(0.086, 6)
  })
  it('é contínua entre as faixas (sem salto no imposto)', () => {
    const antes = aliquotaEfetivaSimples(180_000, 'III')
    const depois = aliquotaEfetivaSimples(180_001, 'III')
    expect(Math.abs(depois - antes)).toBeLessThan(0.0001)
  })
  it('sem receita usa a menor alíquota', () => {
    expect(aliquotaEfetivaSimples(0, 'V')).toBe(0.155)
  })
})

describe('proLabore', () => {
  it('modo fatorR: 28% do faturamento, mas nunca abaixo do mínimo', () => {
    expect(proLabore(10_000, 'fatorR')).toBe(2800)
    expect(proLabore(3_000, 'fatorR')).toBe(1621)
  })
  it('modo minimo: sempre um salário mínimo', () => {
    expect(proLabore(50_000, 'minimo')).toBe(1621)
  })
})

describe('calculateSimples', () => {
  it('R$ 10.000 com Fator R: Anexo III a 6% e IR do pró-labore zerado', () => {
    const r = calculateSimples(10_000, { fixedCosts: 300, proLaboreMode: 'fatorR' })
    expect(r.anexo).toBe('III')
    expect(r.fatorR).toBeCloseTo(0.28, 6)
    expect(r.taxes.find((t) => t.key === 'das').value).toBe(600)
    expect(r.taxes.find((t) => t.key === 'inss').value).toBe(308)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(0)
    expect(r.netMonthly).toBe(8792)
  })

  it('mesmo faturamento com pró-labore mínimo cai no Anexo V e sobra menos', () => {
    const r = calculateSimples(10_000, { fixedCosts: 300, proLaboreMode: 'minimo' })
    expect(r.anexo).toBe('V')
    expect(r.taxes.find((t) => t.key === 'das').value).toBe(1550)
    expect(r.netMonthly).toBe(7971.69)
  })

  it('R$ 30.000: segunda faixa (8,6%) e IR cheio sobre o pró-labore', () => {
    const r = calculateSimples(30_000, { fixedCosts: 300, proLaboreMode: 'fatorR' })
    expect(r.taxes.find((t) => t.key === 'das').value).toBe(2580)
    expect(r.taxes.find((t) => t.key === 'inss').value).toBe(924)
    expect(r.taxes.find((t) => t.key === 'irpf').value).toBe(1147.17)
    expect(r.netMonthly).toBe(25_048.83)
  })

  it('faturamento baixo: pró-labore no mínimo já passa de 28%, então vale o Anexo III', () => {
    const r = calculateSimples(4_000, { fixedCosts: 0, proLaboreMode: 'minimo' })
    expect(r.fatorR).toBeCloseTo(1621 / 4000, 6)
    expect(r.anexo).toBe('III')
  })

  it('sinaliza quando passa do limite de R$ 4,8 milhões por ano', () => {
    expect(calculateSimples(400_000, { fixedCosts: 0, proLaboreMode: 'fatorR' }).exceedsLimit).toBe(false)
    expect(calculateSimples(400_001, { fixedCosts: 0, proLaboreMode: 'fatorR' }).exceedsLimit).toBe(true)
  })
})
