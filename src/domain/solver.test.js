import { describe, it, expect } from 'vitest'
import { solveGrossForNet } from './solver.js'

describe('solveGrossForNet', () => {
  it('inverte uma função simples (imposto fixo de 10%)', () => {
    const g = solveGrossForNet((x) => x * 0.9, 900)
    expect(g).toBeCloseTo(1000, 2)
  })

  it('devolve o menor faturamento que atinge o alvo (centavos)', () => {
    const liquido = (x) => x - 86.05 - 300
    const g = solveGrossForNet(liquido, 5000)
    expect(g).toBe(5386.05)
    expect(liquido(g - 0.01)).toBeLessThan(5000)
  })

  it('funciona quando o imposto dá um salto no meio do caminho', () => {
    // Abaixo de R$ 5.000 paga 6%; a partir daí paga 15% sobre tudo (salto, como na troca de anexo).
    const liquido = (x) => (x <= 5000 ? x * 0.94 : x * 0.85)
    const g = solveGrossForNet(liquido, 4000)
    expect(g).toBeCloseTo(4000 / 0.94, 1) // acha a solução antes do salto
    // Antes do salto o máximo é R$ 4.700; para R$ 4.800 só existe solução depois dele.
    const g2 = solveGrossForNet(liquido, 4800)
    expect(g2).toBeCloseTo(4800 / 0.85, 1)
  })

  it('devolve null quando o alvo é inalcançável ou inválido', () => {
    expect(solveGrossForNet((x) => x * 0.5, 1e9)).toBeNull()
    expect(solveGrossForNet((x) => x, 0)).toBeNull()
    expect(solveGrossForNet((x) => x, -5)).toBeNull()
  })
})
