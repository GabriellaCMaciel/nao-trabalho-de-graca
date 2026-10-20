import { describe, it, expect } from 'vitest'
import { calculatePricing, priceForRegime } from './pricing.js'
import { validateInputs, ENTRADAS_PADRAO } from './validation.js'
import { calculateWorkload } from './workload.js'

const entradas = (extra = {}) => {
  const r = validateInputs({ ...ENTRADAS_PADRAO, ...extra })
  if (!r.isValid) throw new Error(JSON.stringify(r.errors))
  return r.values
}

describe('priceForRegime', () => {
  it('MEI com os valores padrão: R$ 5.386,05 por mês e R$ 59,85 por hora', () => {
    const v = entradas()
    const r = priceForRegime('mei', v, calculateWorkload(v))
    expect(r.grossMonthly).toBe(5386.05)
    expect(r.annualGross).toBeCloseTo(64_632.6, 2)
    expect(r.hourly).toBe(59.85) // 64.632,60 ÷ 1.080 h = 59,845 → sobe para o centavo
    expect(r.daily).toBeCloseTo(478.8, 2) // 59,85 × 8 h
    expect(r.feasible).toBe(true)
  })

  it.each(['mei', 'autonomo', 'simples'])('%s: o líquido atinge o alvo e não passa muito dele', (regime) => {
    const v = entradas({ regime })
    const r = priceForRegime(regime, v, calculateWorkload(v))
    expect(r.calc.netMonthly).toBeGreaterThanOrEqual(v.desiredNet)
    expect(r.calc.netMonthly - v.desiredNet).toBeLessThan(1) // minimalidade (centavos de folga)
  })

  it('MEI vira inviável quando o preço necessário passa do limite anual', () => {
    const v = entradas({ desiredNet: '9000' })
    const r = priceForRegime('mei', v, calculateWorkload(v))
    expect(r.feasible).toBe(false)
    expect(r.reasons).toContain('mei-limit')
    expect(r.meiLimit.status).toBe('overRetroactive')
  })

  it('cobrar mais horas faturáveis reduz o preço por hora', () => {
    const a = entradas({ billablePercent: '50' })
    const b = entradas({ billablePercent: '80' })
    const pa = priceForRegime('mei', a, calculateWorkload(a)).hourly
    const pb = priceForRegime('mei', b, calculateWorkload(b)).hourly
    expect(pb).toBeLessThan(pa)
  })

  it('o contador só pesa no Simples Nacional', () => {
    const sem = entradas({ accountantCost: '0' })
    const com = entradas({ accountantCost: '300' })
    const w = calculateWorkload(sem)
    expect(priceForRegime('simples', com, w).hourly).toBeGreaterThan(priceForRegime('simples', sem, w).hourly)
    expect(priceForRegime('mei', com, w).hourly).toBe(priceForRegime('mei', sem, w).hourly)
    expect(priceForRegime('autonomo', com, w).hourly).toBe(priceForRegime('autonomo', sem, w).hourly)
  })

  it('devolve inviável se não houver horas faturáveis', () => {
    const v = entradas()
    const r = priceForRegime('mei', v, { billableHoursPerYear: 0 })
    expect(r.feasible).toBe(false)
    expect(r.reasons).toContain('unreachable')
  })
})

describe('calculatePricing', () => {
  it('calcula os três regimes e escolhe o mais barato entre os viáveis', () => {
    const r = calculatePricing(entradas({ regime: 'simples' }))
    expect(Object.keys(r.byRegime).sort()).toEqual(['autonomo', 'mei', 'simples'])
    expect(r.selected).toBe(r.byRegime.simples)

    const viaveis = Object.values(r.byRegime).filter((x) => x.feasible)
    const menor = Math.min(...viaveis.map((x) => x.hourly))
    expect(r.byRegime[r.best].hourly).toBe(menor)
  })

  it('inclui o salário CLT equivalente ao líquido desejado', () => {
    const r = calculatePricing(entradas({ desiredNet: '5000' }))
    expect(r.clt.salario).toBeGreaterThan(3000)
    expect(r.clt.salario).toBeLessThan(5000)
  })

  it('com líquido alto, o MEI sai da disputa e o melhor é outro regime', () => {
    const r = calculatePricing(entradas({ desiredNet: '12000' }))
    expect(r.byRegime.mei.feasible).toBe(false)
    expect(r.best).not.toBe('mei')
    expect(r.best).not.toBeNull()
  })

  it('o Fator R automático sai mais barato que pró-labore mínimo no Simples', () => {
    const auto = calculatePricing(entradas({ desiredNet: '10000', proLaboreMode: 'fatorR' }))
    const minimo = calculatePricing(entradas({ desiredNet: '10000', proLaboreMode: 'minimo' }))
    expect(auto.byRegime.simples.hourly).toBeLessThan(minimo.byRegime.simples.hourly)
  })
})
