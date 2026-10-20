import { describe, it, expect } from 'vitest'
import { meiLimitStatus } from './meiLimit.js'

describe('meiLimitStatus', () => {
  it('abaixo de 80% está tudo certo', () => {
    const r = meiLimitStatus(60_000)
    expect(r.status).toBe('ok')
    expect(r.remaining).toBe(21_000)
  })

  it('a partir de 80% do limite já avisa', () => {
    expect(meiLimitStatus(64_800).status).toBe('warning')
    expect(meiLimitStatus(64_799).status).toBe('ok')
  })

  it('exatamente no limite ainda é permitido (só avisa)', () => {
    const r = meiLimitStatus(81_000)
    expect(r.status).toBe('warning')
    expect(r.excess).toBe(0)
    expect(r.remaining).toBe(0)
  })

  it('passou até 20%: desenquadramento no ano seguinte', () => {
    const r = meiLimitStatus(90_000)
    expect(r.status).toBe('over')
    expect(r.excess).toBe(9_000)
  })

  it('passou mais de 20%: desenquadramento retroativo', () => {
    expect(meiLimitStatus(97_200).status).toBe('over') // exatamente 20%
    expect(meiLimitStatus(97_201).status).toBe('overRetroactive')
  })

  it('informa o limite mensal médio de R$ 6.750', () => {
    expect(meiLimitStatus(0).monthlyLimit).toBe(6_750)
  })
})
