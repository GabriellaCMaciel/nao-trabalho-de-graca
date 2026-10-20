import { ceil2 } from './money.js'

const PASSO = 50
const LIMITE_MENSAL = 450_000

/**
 * Descobre o MENOR faturamento mensal que deixa pelo menos `alvo` de líquido no bolso.
 *
 * Por que não uma fórmula? Imposto depende do faturamento e o faturamento depende do imposto
 * (um círculo). Em vez de inverter as tabelas, varremos faturamentos de R$ 50 em R$ 50 até o
 * líquido bater o alvo e refinamos por bisseção dentro daquele degrau. Assim funciona mesmo
 * quando o imposto "dá saltos" (como na troca de Anexo pelo Fator R).
 *
 * @param {(faturamento: number) => number} liquidoPara  função que devolve o líquido para um faturamento
 * @param {number} alvo
 * @returns {number|null} faturamento mensal em reais e centavos, ou null se o alvo é inalcançável
 */
export function solveGrossForNet(liquidoPara, alvo, { passo = PASSO, limite = LIMITE_MENSAL } = {}) {
  if (!(alvo > 0)) return null

  let anterior = 0
  for (let g = passo; g <= limite; g += passo) {
    if (liquidoPara(g) >= alvo) {
      let baixo = anterior
      let alto = g
      for (let i = 0; i < 40; i++) {
        const meio = (baixo + alto) / 2
        if (liquidoPara(meio) >= alvo) alto = meio
        else baixo = meio
      }
      // Sobe para o centavo seguinte e garante que o alvo foi realmente atingido.
      let resposta = ceil2(alto)
      for (let t = 0; t < 100 && liquidoPara(resposta) < alvo; t++) resposta = ceil2(resposta + 0.01)
      return resposta
    }
    anterior = g
  }
  return null
}
