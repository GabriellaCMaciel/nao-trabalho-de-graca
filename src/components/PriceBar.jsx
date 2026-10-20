import { formatBRL } from '../domain/money.js'

/**
 * Barra fixa no rodapé do celular: o preço por hora fica sempre à vista enquanto você
 * preenche o formulário. No desktop o resultado já fica ao lado, então a barra some (CSS).
 * Não é uma região "aria-live": o cartão principal já anuncia as mudanças.
 */
export default function PriceBar({ hourly }) {
  return (
    <div className="pricebar">
      <p>
        <span className="pricebar__label">Cobre por hora</span>
        <strong className="pricebar__value">{formatBRL(hourly)}</strong>
      </p>
      <a className="pricebar__link" href="#resultado">
        Ver detalhes
      </a>
    </div>
  )
}
