import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PriceBar from './PriceBar.jsx'
import App from '../App.jsx'

describe('PriceBar', () => {
  it('mostra o preço por hora e um link para os detalhes', () => {
    render(<PriceBar hourly={59.85} />)
    expect(screen.getByText('Cobre por hora')).toBeInTheDocument()
    expect(screen.getByText(/59,85/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver detalhes' })).toHaveAttribute('href', '#resultado')
  })

  it('o link do App aponta para uma região que existe', () => {
    render(<App />)
    const alvo = document.getElementById('resultado')
    expect(alvo).not.toBeNull()
  })
})
