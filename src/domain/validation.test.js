import { describe, it, expect } from 'vitest'
import { validateInputs, ENTRADAS_PADRAO } from './validation.js'

describe('validateInputs', () => {
  it('aceita os valores padrão do formulário', () => {
    const r = validateInputs(ENTRADAS_PADRAO)
    expect(r.errors).toEqual({})
    expect(r.isValid).toBe(true)
    expect(r.values.desiredNet).toBe(5000)
    expect(r.values.regime).toBe('mei')
  })

  it('entende vírgula decimal e ponto de milhar', () => {
    const r = validateInputs({ ...ENTRADAS_PADRAO, desiredNet: '7.500,50', fixedCosts: '1.200' })
    expect(r.values.desiredNet).toBe(7500.5)
    expect(r.values.fixedCosts).toBe(1200)
  })

  it('rejeita texto, vazio e notação científica', () => {
    for (const ruim of ['abc', '', '   ', '1e9', '<script>']) {
      const r = validateInputs({ ...ENTRADAS_PADRAO, desiredNet: ruim })
      expect(r.errors.desiredNet).toBeTruthy()
      expect(r.values.desiredNet).toBeUndefined()
    }
  })

  it('rejeita valores fora dos limites', () => {
    expect(validateInputs({ ...ENTRADAS_PADRAO, desiredNet: '0' }).errors.desiredNet).toBeTruthy()
    expect(validateInputs({ ...ENTRADAS_PADRAO, desiredNet: '999999999' }).errors.desiredNet).toBeTruthy()
    expect(validateInputs({ ...ENTRADAS_PADRAO, hoursPerDay: '25' }).errors.hoursPerDay).toBeTruthy()
    expect(validateInputs({ ...ENTRADAS_PADRAO, billablePercent: '5' }).errors.billablePercent).toBeTruthy()
  })

  it('exige número inteiro onde faz sentido', () => {
    const r = validateInputs({ ...ENTRADAS_PADRAO, workDaysPerWeek: '4,5' })
    expect(r.errors.workDaysPerWeek).toMatch(/inteiro/)
  })

  it('só aceita opções conhecidas nos campos de seleção', () => {
    expect(validateInputs({ ...ENTRADAS_PADRAO, regime: 'lucro-real' }).errors.regime).toBeTruthy()
    expect(validateInputs({ ...ENTRADAS_PADRAO, inssPlan: '__proto__' }).errors.inssPlan).toBeTruthy()
    expect(validateInputs({ ...ENTRADAS_PADRAO, regime: 'simples' }).values.regime).toBe('simples')
  })

  it('barra folgas que ocupam o ano inteiro', () => {
    const r = validateInputs({
      ...ENTRADAS_PADRAO,
      workDaysPerWeek: '1',
      vacationDays: '30',
      holidays: '15',
      sickDays: '10',
    })
    expect(r.errors.vacationDays).toMatch(/não podem ocupar/)
  })

  it('ignora chaves desconhecidas e não quebra com entrada vazia', () => {
    const r = validateInputs({ ...ENTRADAS_PADRAO, hack: 'x', constructor: 'y' })
    expect(r.values.hack).toBeUndefined()
    expect(validateInputs().isValid).toBe(false)
  })
})
