import { formatBRL, formatPercent } from '../domain/money.js'
import { REGIME_LABELS } from '../domain/regimes/index.js'
import '../styles/results.css'

const horas = (n) => `${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h`

/**
 * O número que importa: quanto cobrar por hora no regime escolhido.
 * @param {{ result: object, workload: object }} props  result vem de priceForRegime
 */
export default function PriceHero({ result, workload }) {
  if (result.reasons?.includes('unreachable')) {
    return (
      <section className="hero" aria-labelledby="hero-title">
        <h2 id="hero-title" className="hero__title">
          Não deu para calcular
        </h2>
        <p className="hero__daily">
          Com esses dados não existe um preço possível. Confira se sobram horas cobráveis no ano e se o líquido
          desejado é realista.
        </p>
      </section>
    )
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <h2 id="hero-title" className="hero__title">
        Seu preço como {REGIME_LABELS[result.regime]}
      </h2>

      {/* aria-live: leitores de tela anunciam o novo preço quando você muda um campo */}
      <p className="hero__price" aria-live="polite" aria-atomic="true">
        <span className="visually-hidden">Cobre </span>
        <span className="hero__value">{formatBRL(result.hourly)}</span>
        <span className="hero__unit"> por hora</span>
      </p>
      <p className="hero__daily">
        Para fechar um dia inteiro de trabalho: <strong>{formatBRL(result.daily)}</strong>
      </p>

      <dl className="hero__stats">
        <div>
          <dt>Faturar por mês</dt>
          <dd>{formatBRL(result.grossMonthly)}</dd>
        </div>
        <div>
          <dt>Horas cobráveis por mês</dt>
          <dd>{horas(workload.billableHoursPerMonth)}</dd>
        </div>
        <div>
          <dt>Imposto sobre o faturamento</dt>
          <dd>{formatPercent(result.calc.effectiveRate)}</dd>
        </div>
      </dl>
    </section>
  )
}
