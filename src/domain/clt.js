import { FGTS_ALIQUOTA, IRPF_DESCONTO_SIMPLIFICADO } from './tax2026.js'
import { round2 } from './money.js'
import { inssClt } from './taxes/inss.js'
import { irpfMensal } from './taxes/irpf.js'

/**
 * Quanto sobra de um pagamento mensal de empregado CLT depois de INSS e Imposto de Renda.
 * Na folha, o IR usa a maior dedução entre o INSS e o desconto simplificado.
 * @param {number} bruto
 */
export function cltNetMonthly(bruto) {
  if (!(bruto > 0)) return 0
  const inss = inssClt(bruto)
  const base = Math.max(0, bruto - Math.max(inss, IRPF_DESCONTO_SIMPLIFICADO))
  return round2(bruto - inss - irpfMensal(base, bruto))
}

/**
 * Tudo que um salário CLT entrega em um ano, em valor líquido.
 *
 * Simplificações: o 13º é tratado como um mês avulso e o 1/3 de férias é somado ao salário do mês
 * de férias (que é como a folha tributa). O FGTS não vai para a conta, mas é seu e conta como valor.
 *
 * @param {number} salario bruto mensal
 */
export function cltAnnualValue(salario) {
  const mensal = cltNetMonthly(salario)
  const mesDeFerias = cltNetMonthly(salario + salario / 3)
  const decimoTerceiro = mensal

  const salariosLiquidos = 11 * mensal + mesDeFerias
  const fgts = round2((12 * salario + salario + salario / 3) * FGTS_ALIQUOTA)

  return {
    salario,
    monthlyNet: mensal,
    feriasBonusNet: round2(mesDeFerias - mensal),
    thirteenthNet: decimoTerceiro,
    fgts,
    annualCash: round2(salariosLiquidos + decimoTerceiro),
    annualValue: round2(salariosLiquidos + decimoTerceiro + fgts),
  }
}

/**
 * Qual salário CLT entrega, no ano, o mesmo valor que o seu líquido desejado como freelancer?
 * Compara "12 vezes o líquido desejado" com salário + 13º + 1/3 de férias + FGTS.
 *
 * @param {number} desiredNetMonthly líquido mensal desejado
 */
export function calculateCltEquivalent(desiredNetMonthly) {
  const alvoAnual = desiredNetMonthly * 12

  let baixo = 0
  let alto = 1_000_000
  for (let i = 0; i < 60; i++) {
    const meio = (baixo + alto) / 2
    if (cltAnnualValue(meio).annualValue >= alvoAnual) alto = meio
    else baixo = meio
  }

  const salario = round2(alto)
  return { ...cltAnnualValue(salario), target: round2(alvoAnual) }
}
