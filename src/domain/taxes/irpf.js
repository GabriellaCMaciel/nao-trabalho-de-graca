import { IRPF_FAIXAS, IRPF_REDUTOR } from '../tax2026.js'
import { round2 } from '../money.js'

/**
 * Imposto de renda mensal (tabela progressiva) ANTES do redutor de 2026.
 * @param {number} base rendimento menos as deduções legais (INSS, livro-caixa...)
 */
export function irpfTabela(base) {
  if (!(base > 0)) return 0
  const faixa = IRPF_FAIXAS.find((f) => base <= f.ate)
  return Math.max(0, base * faixa.aliquota - faixa.deduzir)
}

/**
 * Redutor de 2026: quem recebe até R$ 5.000 por mês não paga nada; de R$ 5.000 a R$ 7.350 o
 * desconto vai diminuindo; acima disso vale a tabela inteira. O redutor nunca passa do imposto devido.
 * @param {number} rendimento rendimento tributável bruto do mês (antes das deduções)
 * @param {number} imposto    imposto calculado na tabela
 */
export function irpfRedutor(rendimento, imposto) {
  const { ISENCAO_ATE, REDUCAO_MAXIMA, TETO_REDUTOR, CONSTANTE, COEFICIENTE } = IRPF_REDUTOR
  let redutor = 0
  if (rendimento <= ISENCAO_ATE) redutor = REDUCAO_MAXIMA
  else if (rendimento <= TETO_REDUTOR) redutor = CONSTANTE - COEFICIENTE * rendimento
  return Math.max(0, Math.min(redutor, imposto))
}

/**
 * Imposto de renda mensal já com o redutor.
 * @param {number} base       rendimento menos deduções (define o imposto da tabela)
 * @param {number} rendimento rendimento bruto (define o redutor)
 */
export function irpfMensal(base, rendimento = base) {
  const tabela = irpfTabela(base)
  return round2(tabela - irpfRedutor(rendimento, tabela))
}
