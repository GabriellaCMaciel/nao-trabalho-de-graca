import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RegimeComparison from './RegimeComparison.jsx'
import App from '../App.jsx'
import { calculatePricing } from '../domain/pricing.js'
import { ENTRADAS_PADRAO, validateInputs } from '../domain/validation.js'

const pricing = (extra = {}) => calculatePricing(validateInputs({ ...ENTRADAS_PADRAO, ...extra }).values)

describe('RegimeComparison', () => {
  it('lista os três regimes e marca o de menor preço', () => {
    const p = pricing()
    render(<RegimeComparison byRegime={p.byRegime} best={p.best} selected="mei" semContador={false} onSelect={() => {}} />)

    const linhas = screen.getAllByRole('row').slice(1) // sem o cabeçalho
    expect(linhas).toHaveLength(3)
    expect(screen.getAllByText('Menor preço por hora')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'MEI' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('explica por que o MEI não serve quando passa do limite', () => {
    const p = pricing({ desiredNet: '9000' })
    render(<RegimeComparison byRegime={p.byRegime} best={p.best} selected="mei" semContador={false} onSelect={() => {}} />)
    const linhaMei = screen.getByRole('button', { name: 'MEI' }).closest('tr')
    expect(within(linhaMei).getByText(/limite de R\$ 81 mil/)).toBeInTheDocument()
  })

  it('avisa que falta informar o contador', () => {
    const p = pricing()
    render(<RegimeComparison byRegime={p.byRegime} best={p.best} selected="mei" semContador onSelect={() => {}} />)
    expect(screen.getByText(/exige contador/)).toBeInTheDocument()
  })

  it('clicar no regime avisa quem usa o componente', async () => {
    const onSelect = vi.fn()
    const p = pricing()
    render(<RegimeComparison byRegime={p.byRegime} best={p.best} selected="mei" semContador={false} onSelect={onSelect} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Autônomo (sem CNPJ)' }))
    expect(onSelect).toHaveBeenCalledWith('autonomo')
  })
})

describe('App com a comparação', () => {
  it('trocar o regime pela tabela atualiza o formulário e o resultado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Simples Nacional (ME)' }))
    expect(screen.getByRole('radio', { name: /simples nacional/i })).toBeChecked()
    expect(screen.getByRole('heading', { name: /Seu preço como Simples Nacional/ })).toBeInTheDocument()
  })
})
