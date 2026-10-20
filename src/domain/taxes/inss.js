import { INSS_CLT_FAIXAS, INSS_INDIVIDUAL, SALARIO_MINIMO, TETO_INSS } from '../tax2026.js'
import { clamp, round2 } from '../money.js'

/**
 * INSS de empregado (CLT): progressivo, cada alíquota só vale para a parte do salário da sua faixa.
 * Acima do teto não desconta mais nada.
 * @param {number} salario bruto mensal
 */
export function inssClt(salario) {
  if (!(salario > 0)) return 0
  const base = Math.min(salario, TETO_INSS)
  let total = 0
  let inicioDaFaixa = 0
  for (const { ate, aliquota } of INSS_CLT_FAIXAS) {
    if (base <= inicioDaFaixa) break
    total += (Math.min(base, ate) - inicioDaFaixa) * aliquota
    inicioDaFaixa = ate
  }
  return round2(total)
}

/**
 * INSS de autônomo (contribuinte individual).
 * - normal: 20% sobre o que recebeu, com base entre o salário mínimo e o teto.
 * - simplificado: 11% do salário mínimo (não conta para aposentadoria por tempo de contribuição).
 * @param {number} receita bruta mensal
 * @param {'normal'|'simplificado'} plano
 */
export function inssAutonomo(receita, plano = 'normal') {
  if (!(receita > 0)) return 0
  if (plano === 'simplificado') return round2(SALARIO_MINIMO * INSS_INDIVIDUAL.PLANO_SIMPLIFICADO)
  const base = clamp(receita, SALARIO_MINIMO, TETO_INSS)
  return round2(base * INSS_INDIVIDUAL.PLANO_NORMAL)
}

/**
 * INSS do sócio sobre o pró-labore: 11%, limitado ao teto.
 * @param {number} proLabore valor mensal
 */
export function inssProLabore(proLabore) {
  if (!(proLabore > 0)) return 0
  return round2(Math.min(proLabore, TETO_INSS) * INSS_INDIVIDUAL.PRO_LABORE)
}
