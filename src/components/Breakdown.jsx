import { formatBRL, formatPercent } from '../domain/money.js'

/**
 * Para onde vai cada real que você fatura: imposto, custos fixos e o que sobra para você.
 * A barra é só visual (role="img" com texto equivalente); a legenda traz os valores exatos.
 * @param {{ result: object }} props  result vem de priceForRegime
 */
export default function Breakdown({ result }) {
  const { calc, grossMonthly } = result

  const partes = [
    { key: 'net', label: 'Fica com você', value: Math.max(0, calc.netMonthly) },
    { key: 'tax', label: 'Impostos e contribuições', value: calc.taxTotal },
    { key: 'cost', label: 'Custos fixos', value: calc.fixedCosts },
  ].map((p) => ({ ...p, share: grossMonthly > 0 ? p.value / grossMonthly : 0 }))

  const descricao =
    'Do faturamento: ' + partes.map((p) => `${formatPercent(p.share)} ${p.label.toLowerCase()}`).join(', ') + '.'

  return (
    <section className="panel" aria-labelledby="breakdown-title">
      <h2 id="breakdown-title" className="panel__title">
        Para onde vai o seu faturamento
      </h2>

      <div className="bar" role="img" aria-label={descricao}>
        {partes.map((p) => (
          <span key={p.key} className={`bar__seg bar__seg--${p.key}`} style={{ width: `${p.share * 100}%` }} />
        ))}
      </div>

      <ul className="legend">
        {partes.map((p) => (
          <li key={p.key}>
            <span className={`legend__swatch bar__seg--${p.key}`} aria-hidden="true" />
            <span className="legend__label">{p.label}</span>
            <span className="legend__value">{formatBRL(p.value)}</span>
            <span className="legend__share">{formatPercent(p.share)}</span>
          </li>
        ))}
      </ul>

      <details className="details">
        <summary>Ver os impostos item a item</summary>
        <ul className="taxlist">
          {calc.taxes.map((t) => (
            <li key={t.key}>
              <span>{t.label}</span>
              <span>{formatBRL(t.value)}</span>
            </li>
          ))}
        </ul>
        {calc.regime === 'simples' && (
          <p className="details__note">
            Pró-labore de {formatBRL(calc.proLabore)}: Fator R de {formatPercent(calc.fatorR)}, então o DAS usa o
            Anexo {calc.anexo} ({formatPercent(calc.aliquotaDas)} do faturamento).
          </p>
        )}
      </details>
    </section>
  )
}
