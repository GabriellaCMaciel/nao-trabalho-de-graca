import { MEI, SALARIO_MINIMO } from '../tax2026.js'
import { round2 } from '../money.js'
import { buildResult } from './result.js'

/** DAS mensal do MEI de serviços: 5% do salário mínimo (INSS) + R$ 5 de ISS. Valor fixo. */
export const DAS_MEI_SERVICOS = round2(SALARIO_MINIMO * MEI.INSS_PERCENTUAL + MEI.ISS_SERVICOS)

/**
 * MEI paga um valor fixo por mês, qualquer que seja o faturamento (dentro do limite anual).
 * Não há imposto de renda sobre a parte isenta do lucro, que cobre todo o faturamento permitido
 * ao MEI quando essa é a única renda da pessoa.
 *
 * @param {number} grossMonthly
 * @param {{ fixedCosts: number }} params
 */
export function calculateMei(grossMonthly, { fixedCosts }) {
  return buildResult({
    regime: 'mei',
    grossMonthly,
    fixedCosts,
    taxes: [{ key: 'das', label: 'DAS-MEI (INSS + ISS)', value: DAS_MEI_SERVICOS }],
  })
}
