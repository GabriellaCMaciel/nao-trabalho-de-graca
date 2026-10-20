import { formatBRL } from '../domain/money.js'

/**
 * "E se fosse CLT?": o salário de carteira que entregaria o mesmo valor no ano.
 * @param {{ clt: object, grossMonthly?: number, desiredNet: number }} props
 */
export default function CltCard({ clt, grossMonthly, desiredNet }) {
  const vezes = grossMonthly ? grossMonthly / clt.salario : null

  return (
    <section className="panel" aria-labelledby="clt-title">
      <h2 id="clt-title" className="panel__title">
        E se fosse CLT?
      </h2>
      <p>
        Ganhar {formatBRL(desiredNet)} limpos por mês como freelancer equivale a um salário CLT de{' '}
        <strong className="panel__highlight">{formatBRL(clt.salario)}</strong> por mês.
      </p>

      <ul className="taxlist">
        <li>
          <span>Líquido mensal depois de INSS e imposto</span>
          <span>{formatBRL(clt.monthlyNet)}</span>
        </li>
        <li>
          <span>13º salário líquido</span>
          <span>{formatBRL(clt.thirteenthNet)}</span>
        </li>
        <li>
          <span>Um terço de férias líquido</span>
          <span>{formatBRL(clt.feriasBonusNet)}</span>
        </li>
        <li>
          <span>FGTS depositado por ano</span>
          <span>{formatBRL(clt.fgts)}</span>
        </li>
      </ul>

      {vezes && (
        <p className="panel__note">
          Como freelancer você precisa faturar cerca de {vezes.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}{' '}
          vezes esse salário, porque paga seus próprios impostos, custos, férias e o tempo sem cliente.
        </p>
      )}
      <p className="panel__note">
        Estimativa: o 13º é tratado como um mês avulso e o desconto de imposto segue a tabela de 2026.
      </p>
    </section>
  )
}
