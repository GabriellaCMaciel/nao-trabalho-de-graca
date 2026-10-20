import { describe, it, expect } from 'vitest'
import { irpfTabela, irpfRedutor, irpfMensal } from './irpf.js'

// Exemplos publicados pela Receita Federal para 2026.
describe('irpfTabela (sem redutor)', () => {
  it('base de R$ 3.892,80 → R$ 200,39', () => {
    expect(irpfTabela(3892.8)).toBeCloseTo(200.39, 2)
  })
  it('base de R$ 5.392,80 → R$ 574,29', () => {
    expect(irpfTabela(5392.8)).toBeCloseTo(574.29, 2)
  })
  it('até R$ 2.428,80 é isento', () => {
    expect(irpfTabela(2428.8)).toBe(0)
    expect(irpfTabela(0)).toBe(0)
  })
})

describe('irpfRedutor', () => {
  it('até R$ 5.000 o redutor cobre todo o imposto (até R$ 312,89)', () => {
    expect(irpfRedutor(5000, 312.89)).toBeCloseTo(312.89, 2)
    expect(irpfRedutor(3000, 50)).toBe(50)
  })
  it('em R$ 6.000: redutor de R$ 179,75 (exemplo da Receita)', () => {
    expect(irpfRedutor(6000, 574.29)).toBeCloseTo(179.75, 2)
  })
  it('acima de R$ 7.350 não há redutor', () => {
    expect(irpfRedutor(7351, 900)).toBe(0)
  })
  it('é contínuo na passagem de R$ 5.000', () => {
    expect(irpfRedutor(5000.01, 999)).toBeCloseTo(irpfRedutor(5000, 999), 1)
  })
})

describe('irpfMensal (com redutor)', () => {
  it('rendimento de R$ 6.000 (base R$ 5.392,80) → R$ 394,54', () => {
    expect(irpfMensal(5392.8, 6000)).toBe(394.54)
  })
  it('quem ganha até R$ 5.000 não paga nada', () => {
    expect(irpfMensal(4392.8, 5000)).toBe(0)
    expect(irpfMensal(2000, 2000)).toBe(0)
  })
  it('renda alta paga a tabela cheia', () => {
    expect(irpfMensal(10_000, 10_000)).toBeCloseTo(10_000 * 0.275 - 908.73, 2)
  })
  it('nunca fica negativo', () => {
    expect(irpfMensal(0, 0)).toBe(0)
  })
})
