import { formatBRL, formatPercent } from '../domain/money.js'

const MENSAGENS = {
  ok: {
    titulo: 'Dentro do limite do MEI',
    texto: 'Esse faturamento cabe no MEI. Acompanhe o total do ano para não ser pego de surpresa.',
  },
  warning: {
    titulo: 'Perto do limite do MEI',
    texto: 'Você usaria 80% ou mais do limite. Vale planejar a mudança para microempresa antes de passar de R$ 81 mil.',
  },
  over: {
    titulo: 'Acima do limite do MEI',
    texto:
      'Esse preço só cabe se você virar microempresa. Até 20% acima do limite (R$ 97.200), a saída do MEI vale a partir do ano seguinte e você paga imposto sobre o excesso.',
  },
  overRetroactive: {
    titulo: 'Muito acima do limite do MEI',
    texto:
      'Passou de 20% acima do limite (R$ 97.200). Nesse caso o desenquadramento é retroativo e traz cobrança de impostos. Veja o Simples Nacional.',
  },
}

/**
 * Aviso do limite anual do MEI para o preço calculado.
 * @param {{ limit: ReturnType<import('../domain/regimes/meiLimit.js').meiLimitStatus>, annualGross: number }} props
 */
export default function MeiAlert({ limit, annualGross }) {
  const { titulo, texto } = MENSAGENS[limit.status]
  const bloqueado = limit.status === 'over' || limit.status === 'overRetroactive'

  return (
    <section
      className={`alert alert--${limit.status}`}
      aria-labelledby="mei-alert-title"
      role="status" // anuncia a mudança de situação sem tirar o foco de quem está digitando
    >
      <h2 id="mei-alert-title" className="alert__title">
        {titulo}
      </h2>
      <p>{texto}</p>

      <div
        className="alert__meter"
        role="img"
        aria-label={`Uso do limite anual: ${formatPercent(limit.usedPercent)}`}
      >
        <span style={{ width: `${Math.min(limit.usedPercent, 1) * 100}%` }} />
      </div>
      <p className="alert__numbers">
        {formatBRL(annualGross)} de {formatBRL(limit.limit)} por ano ({formatPercent(limit.usedPercent)}).{' '}
        {bloqueado
          ? `Excesso de ${formatBRL(limit.excess)}.`
          : `Sobram ${formatBRL(limit.remaining)}. Média máxima de ${formatBRL(limit.monthlyLimit)} por mês.`}
      </p>
      <p className="alert__numbers">Confirme a regra vigente no Portal do Empreendedor ou com um contador.</p>
    </section>
  )
}
