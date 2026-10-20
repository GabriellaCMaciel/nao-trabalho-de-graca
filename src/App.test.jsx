import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('formulário', () => {
  it('renderiza o título e os campos principais', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/não trabalho de graça/i)
    expect(screen.getByLabelText('Líquido por mês')).toHaveValue('5000')
    expect(screen.getByLabelText('Custos fixos por mês')).toBeInTheDocument()
  })

  it('tem a estrutura de regiões que leitores de tela usam para navegar', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Resumo do preço' })).toBeInTheDocument()
  })

  it('mostra o erro só depois que a pessoa mexe no campo e liga a mensagem ao campo', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByText(/digite apenas números/i)).not.toBeInTheDocument()

    const campo = screen.getByLabelText('Líquido por mês')
    await user.clear(campo)
    await user.type(campo, 'abc')

    expect(screen.getByText(/digite apenas números/i)).toBeInTheDocument()
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(campo).toHaveAccessibleDescription(/digite apenas números/i)
  })

  it('aceita vírgula decimal sem erro', async () => {
    const user = userEvent.setup()
    render(<App />)
    const campo = screen.getByLabelText('Líquido por mês')
    await user.clear(campo)
    await user.type(campo, '6.500,50')
    expect(campo).not.toHaveAttribute('aria-invalid')
  })

  it('só mostra as opções de INSS quando o regime é autônomo', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByText('INSS do autônomo')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /autônomo/i }))
    expect(screen.getByText('INSS do autônomo')).toBeInTheDocument()
  })

  it('só mostra as opções de pró-labore quando o regime é Simples Nacional', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByText('Pró-labore')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /simples nacional/i }))
    expect(screen.getByText('Pró-labore')).toBeInTheDocument()
  })
})
