import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer.jsx'

describe('Footer', () => {
  it('avisa que é uma estimativa e cita o ano das regras', () => {
    render(<Footer />)
    expect(screen.getByText(/Estimativa para planejamento, com as regras de 2026/)).toBeInTheDocument()
    expect(screen.getByText(/Não substitui um contador/)).toBeInTheDocument()
  })

  it('lista as premissas e informa que nada sai do navegador', () => {
    render(<Footer />)
    expect(screen.getByText('O que essa conta assume')).toBeInTheDocument()
    expect(screen.getByText(/Nada do que você digita é enviado/)).toBeInTheDocument()
    expect(screen.getByText(/CNAE/)).toBeInTheDocument()
  })

  it('é o rodapé (contentinfo) da página', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
