import { calculateAutonomo } from './autonomo.js'
import { calculateMei } from './mei.js'
import { calculateSimples } from './simples.js'

export const REGIME_LABELS = {
  mei: 'MEI',
  autonomo: 'Autônomo (sem CNPJ)',
  simples: 'Simples Nacional (ME)',
}

/**
 * Ponto único de entrada para calcular qualquer regime.
 * @param {'mei'|'autonomo'|'simples'} regime
 * @param {number} grossMonthly faturamento mensal
 * @param {{ fixedCosts: number, inssPlan: string, proLaboreMode: string }} params
 */
export function calculateRegime(regime, grossMonthly, params) {
  switch (regime) {
    case 'mei':
      return calculateMei(grossMonthly, params)
    case 'autonomo':
      return calculateAutonomo(grossMonthly, params)
    case 'simples':
      return calculateSimples(grossMonthly, params)
    default:
      throw new Error(`Regime desconhecido: ${regime}`)
  }
}
