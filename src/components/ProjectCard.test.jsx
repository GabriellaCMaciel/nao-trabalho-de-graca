import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../App.jsx'

const limpo = (el) => el.textContent.replaceAll(String.fromCharCode(160), ' ')

describe('ProjectCard no App', () => {
  it('calcula o projeto com 40 h e 20% de margem a partir do preço por hora', () => {
    render(<App />)
    // R$ 59,85 × 40 = R$ 2.394,00; margem de 20% = R$ 478,80; total R$ 2.872,80
    expect(limpo(screen.getByText(/Cobre pelo projeto/))).toMatch(/R\$ 2\.872,80/)
  })

  it('atualiza o total ao mudar as horas', async () => {
    const user = userEvent.setup()
    render(<App />)
    const horas = screen.getByLabelText('Horas estimadas')
    await user.clear(horas)
    await user.type(horas, '10')
    // 59,85 × 10 = 598,50; margem 119,70; total 718,20
    expect(limpo(screen.getByText(/Cobre pelo projeto/))).toMatch(/R\$ 718,20/)
  })

  it('erro nas horas do projeto não esconde o preço por hora', async () => {
    const user = userEvent.setup()
    render(<App />)
    const horas = screen.getByLabelText('Horas estimadas')
    await user.clear(horas)
    await user.type(horas, 'abc')

    expect(horas).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/Seu preço como MEI/)).toBeInTheDocument() // resultado principal segue visível
    expect(screen.queryByText(/Cobre pelo projeto/)).not.toBeInTheDocument()
  })
})
