import { inssAutonomo } from '../taxes/inss.js'
import { irpfMensal } from '../taxes/irpf.js'
import { buildResult } from './result.js'

/**
 * Autônomo (pessoa física, sem CNPJ): paga INSS como contribuinte individual e
 * Imposto de Renda mensal (carnê-leão) sobre o que recebe.
 *
 * Simplificações assumidas (a tela avisa):
 * - Os custos fixos entram como despesa dedutível (livro-caixa), limitados ao que foi recebido.
 * - Sem dependentes nem outras deduções.
 * - O redutor de 2026 é testado sobre o rendimento bruto, o que é a leitura mais prudente.
 *
 * @param {number} grossMonthly
 * @param {{ fixedCosts: number, inssPlan: 'normal'|'simplificado' }} params
 */
export function calculateAutonomo(grossMonthly, { fixedCosts, inssPlan }) {
  const inss = inssAutonomo(grossMonthly, inssPlan)
  const livroCaixa = Math.min(fixedCosts, grossMonthly)
  const base = Math.max(0, grossMonthly - inss - livroCaixa)
  const irpf = irpfMensal(base, grossMonthly)

  return buildResult({
    regime: 'autonomo',
    grossMonthly,
    fixedCosts,
    taxes: [
      { key: 'inss', label: 'INSS (autônomo)', value: inss },
      { key: 'irpf', label: 'Imposto de Renda (carnê-leão)', value: irpf },
    ],
    extra: { irpfBase: base },
  })
}
