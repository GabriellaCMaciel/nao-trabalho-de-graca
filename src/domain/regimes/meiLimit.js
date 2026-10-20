import { MEI } from '../tax2026.js'

/**
 * Situação do faturamento anual em relação ao limite do MEI (R$ 81 mil em 2026).
 *
 * - ok:              abaixo de 80% do limite
 * - warning:         entre 80% e 100%: perto do limite, vale planejar a mudança
 * - over:            passou até 20% do limite: sai do MEI só no ano seguinte, pagando imposto sobre o excesso
 * - overRetroactive: passou mais de 20%: o desenquadramento vale desde o mês em que estourou
 *
 * Confirme sempre a regra vigente no Portal do Empreendedor ou com um contador.
 *
 * @param {number} annualGross faturamento anual
 */
export function meiLimitStatus(annualGross) {
  const limit = MEI.LIMITE_ANUAL
  const used = annualGross / limit
  const excess = Math.max(0, annualGross - limit)

  let status = 'ok'
  if (used > 1 + MEI.TOLERANCIA_EXCESSO) status = 'overRetroactive'
  else if (used > 1) status = 'over'
  else if (used >= MEI.PERCENTUAL_ALERTA) status = 'warning'

  return {
    status,
    limit,
    usedPercent: used,
    excess,
    /** Quanto ainda cabe no ano antes de estourar (zero se já estourou). */
    remaining: Math.max(0, limit - annualGross),
    /** Faturamento mensal médio máximo para ficar no MEI. */
    monthlyLimit: limit / 12,
  }
}
