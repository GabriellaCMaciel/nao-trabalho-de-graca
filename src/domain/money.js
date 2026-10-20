/**
 * Utilitários de dinheiro e de leitura de números digitados em pt-BR.
 * Todos os cálculos usam "reais" como número comum (ex.: 1234.56) e só arredondam na exibição
 * ou ao final de cada imposto, que é como a Receita faz.
 */

/** Arredonda para centavos evitando erros de ponto flutuante (ex.: 1.005 → 1.01). */
export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

/** Arredonda para CIMA em centavos. O epsilon evita subir 1 centavo por ruído de ponto flutuante. */
export const ceil2 = (n) => Math.ceil(n * 100 - 1e-7) / 100

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

/**
 * Converte o texto digitado ("1.234,56", "1234,5", "1234.56") em número.
 * Regra pt-BR: o ponto é separador de milhar; a vírgula é o decimal.
 * Devolve NaN para qualquer coisa que não seja um número simples (nada de eval ou notação científica).
 * @param {string|number} text
 * @returns {number}
 */
export function parseDecimal(text) {
  if (typeof text === 'number') return Number.isFinite(text) ? text : NaN
  if (typeof text !== 'string') return NaN

  let s = text.replace(/R\$|\s/g, '')
  if (s === '') return NaN

  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '') // "1.234" → 1234
  }

  // Lista branca: dígitos com no máximo um ponto decimal.
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return NaN
  const n = Number(s)
  return Number.isFinite(n) ? n : NaN
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
})

/** 1234.5 → "R$ 1.234,50" */
export const formatBRL = (n) => brl.format(Number.isFinite(n) ? n : 0)

/** 0.0925 → "9,25%" */
export const formatPercent = (fraction) => pct.format(Number.isFinite(fraction) ? fraction : 0)
