import { formatBRL } from '../domain/money.js'
import { REGIME_LABELS } from '../domain/regimes/index.js'

const MOTIVOS = {
  'mei-limit': 'Passa do limite de R$ 81 mil por ano do MEI',
  'simples-limit': 'Passa do limite de R$ 4,8 milhões por ano do Simples',
  unreachable: 'Não foi possível calcular',
}

/**
 * Compara o preço necessário nos três regimes, para o mesmo líquido desejado.
 * Clicar no nome do regime troca o regime usado no resto da tela.
 *
 * @param {object} props
 * @param {Record<string, object>} props.byRegime  resultado de priceForRegime por regime
 * @param {string|null} props.best                 regime viável com menor preço por hora
 * @param {string} props.selected                  regime escolhido agora
 * @param {boolean} props.semContador              true se o contador está em R$ 0
 * @param {(regime: string) => void} props.onSelect
 */
export default function RegimeComparison({ byRegime, best, selected, semContador, onSelect }) {
  const linhas = Object.values(byRegime)

  return (
    <section className="panel" aria-labelledby="compare-title">
      <h2 id="compare-title" className="panel__title">
        Comparar os regimes
      </h2>
      <p className="panel__lead">Mesmo líquido desejado, três formas de trabalhar.</p>

      <table className="compare">
        <caption className="visually-hidden">Preço necessário por regime</caption>
        <thead>
          <tr>
            <th scope="col">Regime</th>
            <th scope="col">Por mês</th>
            <th scope="col">Por hora</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((r) => {
            const escolhido = r.regime === selected
            return (
              <tr key={r.regime} className={escolhido ? 'is-selected' : undefined}>
                <th scope="row">
                  <button type="button" className="compare__pick" aria-pressed={escolhido} onClick={() => onSelect(r.regime)}>
                    {REGIME_LABELS[r.regime]}
                  </button>
                  <span className={`compare__status${r.feasible ? '' : ' is-blocked'}`}>
                    {!r.feasible ? MOTIVOS[r.reasons[0]] : r.regime === best ? 'Menor preço por hora' : 'Cabe nos seus limites'}
                  </span>
                </th>
                <td>{r.grossMonthly ? formatBRL(r.grossMonthly) : '-'}</td>
                <td className="compare__hour">{r.hourly ? formatBRL(r.hourly) : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {semContador && (
        <p className="panel__note">
          O Simples Nacional exige contador. Informe o valor no formulário para a comparação ficar justa.
        </p>
      )}
    </section>
  )
}
