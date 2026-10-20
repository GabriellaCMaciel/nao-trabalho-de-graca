import { describe, it, expect } from 'vitest'
import { inssClt, inssAutonomo, inssProLabore } from './inss.js'

describe('inssClt', () => {
  it('salário de R$ 3.000: exemplo conferido (faixa a faixa = parcela a deduzir)', () => {
    expect(inssClt(3000)).toBe(248.6)
  })
  it('um salário mínimo paga 7,5%', () => {
    expect(inssClt(1621)).toBe(121.57)
  })
  it('acima do teto, o desconto fica travado no máximo', () => {
    expect(inssClt(8475.55)).toBe(inssClt(50_000))
    expect(inssClt(50_000)).toBeCloseTo(988.09, 1)
  })
  it('zero ou negativo não paga', () => {
    expect(inssClt(0)).toBe(0)
    expect(inssClt(-10)).toBe(0)
  })
})

describe('inssAutonomo', () => {
  it('plano normal: 20% do que recebeu, com piso no mínimo', () => {
    expect(inssAutonomo(5000)).toBe(1000)
    expect(inssAutonomo(1000)).toBe(324.2) // base sobe para o salário mínimo
  })
  it('plano normal: limitado ao teto', () => {
    expect(inssAutonomo(30_000)).toBe(1695.11)
  })
  it('plano simplificado: 11% do salário mínimo, não importa a renda', () => {
    expect(inssAutonomo(1500, 'simplificado')).toBe(178.31)
    expect(inssAutonomo(20_000, 'simplificado')).toBe(178.31)
  })
  it('sem receita, sem contribuição', () => {
    expect(inssAutonomo(0)).toBe(0)
  })
})

describe('inssProLabore', () => {
  it('11% do pró-labore', () => {
    expect(inssProLabore(5000)).toBe(550)
  })
  it('limitado ao teto', () => {
    expect(inssProLabore(20_000)).toBe(932.31)
  })
})
