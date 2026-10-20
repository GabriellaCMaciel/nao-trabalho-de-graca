import { describe, it, expect } from 'vitest'
import { round2, ceil2, clamp, parseDecimal, formatBRL, formatPercent } from './money.js'

// O Intl usa espaço "inquebrável" entre R$ e o valor; normalizamos para comparar.
const plain = (s) => s.replaceAll(String.fromCharCode(160), ' ')

describe('round2 / ceil2 / clamp', () => {
  it('arredonda para centavos sem erro de ponto flutuante', () => {
    expect(round2(1.005)).toBe(1.01)
    expect(round2(0.1 + 0.2)).toBe(0.3)
  })
  it('ceil2 sempre sobe, mas ignora ruído de ponto flutuante', () => {
    expect(ceil2(10.001)).toBe(10.01)
    expect(ceil2(10.01)).toBe(10.01)
    expect(ceil2(0.1 + 0.2)).toBe(0.3)
  })
  it('ceil2 nunca devolve -0 (que apareceria como "-R$ 0,00")', () => {
    expect(Object.is(ceil2(0), 0)).toBe(true)
    expect(Object.is(ceil2(-0.000001), 0)).toBe(true)
  })
  it('clamp limita o valor ao intervalo', () => {
    expect(clamp(5, 0, 3)).toBe(3)
    expect(clamp(-1, 0, 3)).toBe(0)
    expect(clamp(2, 0, 3)).toBe(2)
  })
})

describe('parseDecimal', () => {
  it.each([
    ['1.234,56', 1234.56],
    ['1234,5', 1234.5],
    ['1234.56', 1234.56],
    ['1.234', 1234],
    ['R$ 5.000,00', 5000],
    ['0,5', 0.5],
    ['  80  ', 80],
  ])('lê %s como %d', (text, expected) => {
    expect(parseDecimal(text)).toBe(expected)
  })

  it.each(['', '   ', 'abc', '1e5', '1,2,3', '--5', '-5', '5%', '0x10', 'Infinity', '1..2'])(
    'rejeita %j',
    (text) => {
      expect(parseDecimal(text)).toBeNaN()
    },
  )

  it('rejeita tipos que não são texto nem número', () => {
    expect(parseDecimal(null)).toBeNaN()
    expect(parseDecimal(undefined)).toBeNaN()
    expect(parseDecimal({})).toBeNaN()
    expect(parseDecimal(Infinity)).toBeNaN()
  })
})

describe('formatadores', () => {
  it('formata reais em pt-BR', () => {
    expect(plain(formatBRL(1234.5))).toBe('R$ 1.234,50')
  })
  it('formata porcentagem em pt-BR', () => {
    expect(formatPercent(0.0925)).toBe('9,25%')
  })
  it('não quebra com valores inválidos', () => {
    expect(plain(formatBRL(NaN))).toBe('R$ 0,00')
  })
})
