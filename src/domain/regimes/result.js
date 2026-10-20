import { round2 } from '../money.js'

/**
 * Formato de resultado igual para todos os regimes (MEI, autônomo, Simples),
 * assim a tela e o solver não precisam saber os detalhes de cada um.
 *
 * @param {object} p
 * @param {string} p.regime
 * @param {number} p.grossMonthly                   faturamento mensal
 * @param {{key:string,label:string,value:number}[]} p.taxes  impostos e contribuições, item a item
 * @param {number} p.fixedCosts                     custos fixos mensais do negócio
 * @param {object} [p.extra]                        dados específicos do regime
 */
export function buildResult({ regime, grossMonthly, taxes, fixedCosts, extra = {} }) {
  const taxTotal = round2(taxes.reduce((soma, t) => soma + t.value, 0))
  return {
    regime,
    grossMonthly,
    taxes,
    taxTotal,
    fixedCosts,
    /** O que sobra no seu bolso: faturamento − impostos − custos fixos. */
    netMonthly: round2(grossMonthly - taxTotal - fixedCosts),
    effectiveRate: grossMonthly > 0 ? taxTotal / grossMonthly : 0,
    ...extra,
  }
}
