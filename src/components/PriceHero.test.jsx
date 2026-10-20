import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PriceHero from './PriceHero.jsx'
import { calculatePricing } from '../domain/pricing.js'
import { ENTRADAS_PADRAO, validateInputs } from '../domain/validation.js'

const pricingPadrao = () => calculatePricing(validateInputs(ENTRADAS_PADRAO).values)

// O Intl usa espaço inquebrável entre "R$" e o valor.
const texto = (el) => el.textContent.replaceAll(String.fromCharCode(160), ' ')

describe('PriceHero', () => {
  it('mostra o preço por hora, o preço do dia e o faturamento mensal', () => {
    const p = pricingPadrao()
    render(<PriceHero result={p.selected} workload={p.workload} />)

    expect(texto(screen.getByText(/R\$\s59,85/))).toBe('R$ 59,85')
    expect(screen.getByText(/dia inteiro de trabalho/).textContent).toMatch(/478,80/)
    expect(screen.getByText('Faturar por mês').nextSibling.textContent).toMatch(/5\.386,05/)
    expect(screen.getByText('Horas cobráveis por mês').nextSibling.textContent).toBe('90 h')
  })

  it('anuncia o preço para leitores de tela (região aria-live)', () => {
    const p = pricingPadrao()
    render(<PriceHero result={p.selected} workload={p.workload} />)
    const regiao = screen.getByText(/Cobre/).closest('[aria-live]')
    expect(regiao).toHaveAttribute('aria-live', 'polite')
    expect(texto(regiao)).toMatch(/Cobre R\$ 59,85 por hora/)
  })

  it('explica quando não existe preço possível', () => {
    render(<PriceHero result={{ regime: 'mei', feasible: false, reasons: ['unreachable'] }} workload={{}} />)
    expect(screen.getByText('Não deu para calcular')).toBeInTheDocument()
  })
})
