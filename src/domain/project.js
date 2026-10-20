import { ceil2 } from './money.js'

/**
 * Preço de um projeto fechado: horas estimadas × preço/hora, mais uma margem de risco
 * para cobrir imprevistos (escopo que cresce, retrabalho, cliente demorando a responder).
 *
 * @param {object} p
 * @param {number} p.hourly       preço por hora do regime escolhido
 * @param {number} p.projectHours horas que você estima gastar
 * @param {number} p.riskMargin   margem de risco em % (ex.: 20)
 */
export function calculateProjectPrice({ hourly, projectHours, riskMargin }) {
  const base = ceil2(hourly * projectHours)
  const riskAmount = ceil2(base * (riskMargin / 100))
  return { base, riskAmount, total: ceil2(base + riskAmount) }
}
