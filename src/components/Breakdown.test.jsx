import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Breakdown from './Breakdown.jsx'
import { calculatePricing } from '../domain/pricing.js'
import { ENTRADAS_PADRAO, validateInputs } from '../domain/validation.js'

const pricing = (extra = {}) => calculatePricing(validateInputs({ ...ENTRADAS_PADRAO, ...extra }).values)
const limpo = (el) => el.textContent.replaceAll(String.fromCharCode(160), ' ')

describe('Breakdown', () => {
  it('descreve a barra em texto e lista valores na legenda', () => {
    const p = pricing()
    render(<Breakdown result={p.selected} />)

    const barra = screen.getByRole('img')
    expect(barra).toHaveAttribute('aria-label', expect.stringMatching(/fica com você/i))

    const itens = screen.getAllByRole('listitem')
    expect(limpo(itens[0])).toMatch(/Fica com você\s*R\$ 5\.000,00/)
    expect(limpo(itens[1])).toMatch(/Impostos e contribuições\s*R\$ 86,05/)
    expect(limpo(itens[2])).toMatch(/Custos fixos\s*R\$ 300,00/)
  })

  it('as três partes somam 100% do faturamento', () => {
    const p = pricing({ regime: 'autonomo' })
    const { calc, grossMonthly } = p.selected
    expect(calc.netMonthly + calc.taxTotal + calc.fixedCosts).toBeCloseTo(grossMonthly, 2)
  })

  it('no Simples explica o Fator R e o anexo usado', () => {
    const p = pricing({ regime: 'simples', desiredNet: '8000' })
    render(<Breakdown result={p.selected} />)
    const nota = screen.getByText(/Fator R de/)
    expect(nota.textContent).toMatch(/Anexo III/)
    expect(within(document.body).getByText('DAS Simples (Anexo III)')).toBeInTheDocument()
  })

  it('o MEI não mostra nota de Fator R', () => {
    render(<Breakdown result={pricing().selected} />)
    expect(screen.queryByText(/Fator R/)).not.toBeInTheDocument()
  })
})
