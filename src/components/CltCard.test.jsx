import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CltCard from './CltCard.jsx'
import { calculatePricing } from '../domain/pricing.js'
import { ENTRADAS_PADRAO, validateInputs } from '../domain/validation.js'

const limpo = (el) => el.textContent.replaceAll(String.fromCharCode(160), ' ')

describe('CltCard', () => {
  const p = calculatePricing(validateInputs(ENTRADAS_PADRAO).values)

  it('mostra o salário CLT equivalente e os extras da carteira', () => {
    render(<CltCard clt={p.clt} grossMonthly={p.selected.grossMonthly} desiredNet={5000} />)
    expect(screen.getByRole('heading', { name: 'E se fosse CLT?' })).toBeInTheDocument()
    expect(limpo(screen.getByText(/Ganhar/))).toMatch(/R\$ 5\.000,00 limpos/)
    expect(screen.getByText('13º salário líquido')).toBeInTheDocument()
    expect(screen.getByText('FGTS depositado por ano')).toBeInTheDocument()
  })

  it('explica quantas vezes o salário precisa faturar', () => {
    render(<CltCard clt={p.clt} grossMonthly={p.selected.grossMonthly} desiredNet={5000} />)
    expect(screen.getByText(/vezes esse salário/)).toBeInTheDocument()
  })

  it('sem faturamento calculado, omite a comparação de vezes', () => {
    render(<CltCard clt={p.clt} desiredNet={5000} />)
    expect(screen.queryByText(/vezes esse salário/)).not.toBeInTheDocument()
  })
})
