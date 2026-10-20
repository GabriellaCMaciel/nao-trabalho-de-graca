import { calculateCltEquivalent } from './clt.js'
import { ceil2 } from './money.js'
import { calculateRegime } from './regimes/index.js'
import { meiLimitStatus } from './regimes/meiLimit.js'
import { solveGrossForNet } from './solver.js'
import { calculateWorkload } from './workload.js'
import { REGIMES } from './validation.js'

/**
 * Calcula, para UM regime, quanto faturar e quanto cobrar para sobrar o líquido desejado.
 *
 * @param {'mei'|'autonomo'|'simples'} regime
 * @param {object} v  entradas já validadas (ver validateInputs)
 * @param {ReturnType<typeof calculateWorkload>} workload
 */
export function priceForRegime(regime, v, workload) {
  // Só o Simples Nacional (empresa) exige contador; MEI e autônomo não entram nessa conta.
  const contador = regime === 'simples' ? v.accountantCost : 0
  const params = {
    fixedCosts: v.fixedCosts + contador,
    inssPlan: v.inssPlan,
    proLaboreMode: v.proLaboreMode,
  }
  const liquidoPara = (g) => calculateRegime(regime, g, params).netMonthly

  const grossMonthly = solveGrossForNet(liquidoPara, v.desiredNet)
  if (grossMonthly === null || !(workload.billableHoursPerYear > 0)) {
    return { regime, feasible: false, reasons: ['unreachable'] }
  }

  const calc = calculateRegime(regime, grossMonthly, params)
  const annualGross = grossMonthly * 12
  const hourly = ceil2(annualGross / workload.billableHoursPerYear)

  // Um preço só vale se o regime permitir faturar tanto.
  const reasons = []
  const meiLimit = regime === 'mei' ? meiLimitStatus(annualGross) : null
  if (meiLimit && (meiLimit.status === 'over' || meiLimit.status === 'overRetroactive')) {
    reasons.push('mei-limit')
  }
  if (regime === 'simples' && calc.exceedsLimit) reasons.push('simples-limit')

  return {
    regime,
    feasible: reasons.length === 0,
    reasons,
    grossMonthly,
    annualGross,
    hourly,
    /** Preço de um dia inteiro de trabalho: o preço/hora já embute o tempo não faturável. */
    daily: ceil2(hourly * v.hoursPerDay),
    calc,
    meiLimit,
  }
}

/**
 * Calcula os três regimes e indica o que sai mais barato para o cliente entre os viáveis.
 * @param {object} v entradas validadas
 */
export function calculatePricing(v) {
  const workload = calculateWorkload(v)
  const byRegime = Object.fromEntries(REGIMES.map((r) => [r, priceForRegime(r, v, workload)]))

  const viaveis = Object.values(byRegime).filter((r) => r.feasible)
  const best = viaveis.length ? viaveis.reduce((a, b) => (b.hourly < a.hourly ? b : a)).regime : null

  return {
    workload,
    byRegime,
    best,
    selected: byRegime[v.regime],
    /** Salário CLT que entregaria o mesmo valor no ano (13º, férias e FGTS incluídos). */
    clt: calculateCltEquivalent(v.desiredNet),
  }
}
