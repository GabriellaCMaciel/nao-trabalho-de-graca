import { SALARIO_MINIMO, SIMPLES, SIMPLES_ANEXO_III, SIMPLES_ANEXO_V } from '../tax2026.js'
import { inssProLabore } from '../taxes/inss.js'
import { irpfMensal } from '../taxes/irpf.js'
import { round2 } from '../money.js'
import { buildResult } from './result.js'

/**
 * Alíquota efetiva do Simples: (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12.
 * RBT12 é a receita bruta dos últimos 12 meses.
 * @param {number} rbt12
 * @param {'III'|'V'} anexo
 */
export function aliquotaEfetivaSimples(rbt12, anexo) {
  const tabela = anexo === 'III' ? SIMPLES_ANEXO_III : SIMPLES_ANEXO_V
  const faixa = tabela.find((f) => rbt12 <= f.ate) ?? tabela.at(-1)
  if (!(rbt12 > 0)) return tabela[0].aliquota
  return (rbt12 * faixa.aliquota - faixa.deduzir) / rbt12
}

/**
 * Pró-labore que o sócio retira.
 * - fatorR: o mínimo para a folha chegar a 28% do faturamento (e nunca menos que um salário mínimo).
 * - minimo: só um salário mínimo.
 */
export function proLabore(grossMonthly, modo) {
  if (modo === 'minimo') return SALARIO_MINIMO
  return Math.max(SALARIO_MINIMO, Math.ceil(grossMonthly * SIMPLES.FATOR_R_MINIMO * 100 - 1e-7) / 100)
}

/**
 * Microempresa no Simples Nacional, atividade intelectual (software, design, consultoria...).
 *
 * - O Fator R (pró-labore ÷ faturamento) decide o anexo: ≥ 28% → Anexo III (a partir de 6%);
 *   abaixo disso → Anexo V (a partir de 15,5%).
 * - Além do DAS, o sócio paga INSS (11%) e Imposto de Renda sobre o pró-labore.
 * - O restante do lucro sai como distribuição de lucros, que está isenta de IR nos valores usuais
 *   de freelancer (a nova retenção de 10% só vale acima de R$ 50 mil por mês, por empresa).
 * - Simplificação: a "folha" do Fator R considera só o pró-labore, sem funcionários.
 * - Custos de contabilidade entram nos custos fixos (informe um contador, ele é obrigatório).
 *
 * @param {number} grossMonthly
 * @param {{ fixedCosts: number, proLaboreMode: 'fatorR'|'minimo' }} params
 */
export function calculateSimples(grossMonthly, { fixedCosts, proLaboreMode }) {
  const rbt12 = grossMonthly * 12 // assume faturamento estável ao longo do ano
  const retirada = proLabore(grossMonthly, proLaboreMode)
  const fatorR = grossMonthly > 0 ? retirada / grossMonthly : 1
  const anexo = fatorR + 1e-9 >= SIMPLES.FATOR_R_MINIMO ? 'III' : 'V'
  const aliquotaEfetiva = aliquotaEfetivaSimples(rbt12, anexo)

  const das = round2(grossMonthly * aliquotaEfetiva)
  const inss = inssProLabore(retirada)
  const irpf = irpfMensal(Math.max(0, retirada - inss), retirada)

  return buildResult({
    regime: 'simples',
    grossMonthly,
    fixedCosts,
    taxes: [
      { key: 'das', label: `DAS Simples (Anexo ${anexo})`, value: das },
      { key: 'inss', label: 'INSS sobre o pró-labore', value: inss },
      { key: 'irpf', label: 'IR sobre o pró-labore', value: irpf },
    ],
    extra: {
      anexo,
      fatorR,
      proLabore: retirada,
      aliquotaDas: aliquotaEfetiva,
      exceedsLimit: rbt12 > SIMPLES.LIMITE_ANUAL,
    },
  })
}
