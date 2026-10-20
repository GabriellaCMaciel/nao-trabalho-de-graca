import { parseDecimal } from './money.js'

/**
 * Validação das entradas do formulário.
 * O formulário guarda TEXTO (o que a pessoa digitou). Aqui o texto vira número,
 * com limites seguros, e cada campo inválido recebe uma mensagem em português.
 * Nada digitado chega ao cálculo sem passar por aqui.
 */

export const REGIMES = ['mei', 'autonomo', 'simples']
export const PLANOS_INSS = ['normal', 'simplificado']
export const MODOS_PRO_LABORE = ['fatorR', 'minimo']

/** Valores iniciais do formulário (sempre texto). */
export const ENTRADAS_PADRAO = {
  regime: 'mei',
  desiredNet: '5000',
  fixedCosts: '300',
  workDaysPerWeek: '5',
  hoursPerDay: '8',
  billablePercent: '60',
  vacationDays: '20',
  holidays: '10',
  sickDays: '5',
  inssPlan: 'normal',
  proLaboreMode: 'fatorR',
  projectHours: '40',
  riskMargin: '20',
}

const NUMERICOS = {
  desiredNet: { label: 'Líquido desejado por mês', min: 1, max: 150_000 },
  fixedCosts: { label: 'Custos fixos por mês', min: 0, max: 100_000 },
  workDaysPerWeek: { label: 'Dias de trabalho por semana', min: 1, max: 7, inteiro: true },
  hoursPerDay: { label: 'Horas de trabalho por dia', min: 1, max: 16 },
  billablePercent: { label: 'Horas faturáveis (%)', min: 10, max: 100 },
  vacationDays: { label: 'Dias úteis de férias', min: 0, max: 120, inteiro: true },
  holidays: { label: 'Dias úteis de feriados', min: 0, max: 60, inteiro: true },
  sickDays: { label: 'Dias de imprevistos e doença', min: 0, max: 60, inteiro: true },
  projectHours: { label: 'Horas estimadas do projeto', min: 1, max: 10_000 },
  riskMargin: { label: 'Margem de risco (%)', min: 0, max: 200 },
}

const SELECOES = {
  regime: { label: 'Regime', opcoes: REGIMES },
  inssPlan: { label: 'Plano de INSS', opcoes: PLANOS_INSS },
  proLaboreMode: { label: 'Pró-labore', opcoes: MODOS_PRO_LABORE },
}

const SEMANAS_POR_ANO = 52
const fmt = (n) => n.toLocaleString('pt-BR')

/**
 * @param {Record<string, unknown>} bruto  texto do formulário
 * @returns {{ values: Record<string, number|string>, errors: Record<string, string>, isValid: boolean }}
 */
export function validateInputs(bruto = {}) {
  const values = {}
  const errors = {}

  // Só lemos as chaves conhecidas: qualquer outra coisa é ignorada.
  for (const [campo, regra] of Object.entries(NUMERICOS)) {
    const texto = bruto[campo]
    if (texto === undefined || texto === null || String(texto).trim() === '') {
      errors[campo] = `Informe ${regra.label.toLowerCase()}.`
      continue
    }
    const n = parseDecimal(texto)
    if (Number.isNaN(n)) {
      errors[campo] = `${regra.label}: digite apenas números (ex.: 1.500,50).`
    } else if (n < regra.min || n > regra.max) {
      errors[campo] = `${regra.label} deve estar entre ${fmt(regra.min)} e ${fmt(regra.max)}.`
    } else if (regra.inteiro && !Number.isInteger(n)) {
      errors[campo] = `${regra.label} deve ser um número inteiro.`
    } else {
      values[campo] = n
    }
  }

  for (const [campo, regra] of Object.entries(SELECOES)) {
    const escolhido = bruto[campo]
    if (regra.opcoes.includes(escolhido)) values[campo] = escolhido
    else errors[campo] = `${regra.label}: escolha uma das opções disponíveis.`
  }

  // Regra entre campos: precisa sobrar tempo de trabalho no ano.
  if (!errors.workDaysPerWeek && !errors.vacationDays && !errors.holidays && !errors.sickDays) {
    const dias = values.workDaysPerWeek * SEMANAS_POR_ANO
    const folgas = values.vacationDays + values.holidays + values.sickDays
    if (folgas >= dias) {
      errors.vacationDays = `Férias, feriados e imprevistos (${folgas} dias) não podem ocupar todos os ${dias} dias de trabalho do ano.`
    }
  }

  return { values, errors, isValid: Object.keys(errors).length === 0 }
}
