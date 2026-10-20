import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import MeiAlert from './MeiAlert.jsx'
import App from '../App.jsx'
import { meiLimitStatus } from '../domain/regimes/meiLimit.js'

const monta = (anual) => render(<MeiAlert limit={meiLimitStatus(anual)} annualGross={anual} />)

describe('MeiAlert', () => {
  it('abaixo de 80%: dentro do limite', () => {
    monta(60_000)
    expect(screen.getByRole('heading', { name: 'Dentro do limite do MEI' })).toBeInTheDocument()
    expect(screen.getByText(/Sobram/)).toBeInTheDocument()
  })

  it('a partir de 80%: perto do limite', () => {
    monta(70_000)
    expect(screen.getByRole('heading', { name: 'Perto do limite do MEI' })).toBeInTheDocument()
  })

  it('acima do limite: avisa do excesso e da regra dos 20%', () => {
    monta(90_000)
    expect(screen.getByRole('heading', { name: 'Acima do limite do MEI' })).toBeInTheDocument()
    expect(screen.getByText(/Excesso de/)).toBeInTheDocument()
    expect(screen.getByText(/97\.200/)).toBeInTheDocument()
  })

  it('mais de 20% acima: retroativo', () => {
    monta(120_000)
    expect(screen.getByRole('heading', { name: 'Muito acima do limite do MEI' })).toBeInTheDocument()
    expect(screen.getByText(/retroativo/)).toBeInTheDocument()
  })

  it('sempre manda confirmar a regra com um contador', () => {
    monta(10_000)
    expect(screen.getByText(/contador/)).toBeInTheDocument()
  })
})

describe('App com o alerta do MEI', () => {
  it('aparece só no MEI e some nos outros regimes', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: /limite do MEI/ })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /autônomo/i }))
    expect(screen.queryByRole('heading', { name: /limite do MEI/ })).not.toBeInTheDocument()
  })

  it('subir o líquido desejado faz o alerta mudar para acima do limite', async () => {
    const user = userEvent.setup()
    render(<App />)
    const campo = screen.getByLabelText('Líquido por mês')
    await user.clear(campo)
    await user.type(campo, '7000')
    expect(screen.getByRole('heading', { name: 'Acima do limite do MEI' })).toBeInTheDocument()
  })
})
