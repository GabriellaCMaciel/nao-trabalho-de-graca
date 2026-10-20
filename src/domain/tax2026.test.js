import { describe, it, expect } from 'vitest'
import {
  INSS_CLT_FAIXAS,
  IRPF_FAIXAS,
  SIMPLES,
  SIMPLES_ANEXO_III,
  SIMPLES_ANEXO_V,
  TETO_INSS,
} from './tax2026.js'

const crescente = (faixas) => faixas.every((f, i) => i === 0 || f.ate > faixas[i - 1].ate)

describe('tabelas de 2026', () => {
  it('têm faixas em ordem crescente', () => {
    for (const t of [INSS_CLT_FAIXAS, IRPF_FAIXAS, SIMPLES_ANEXO_III, SIMPLES_ANEXO_V]) {
      expect(crescente(t)).toBe(true)
    }
  })

  it('a última faixa do INSS é o teto e a do Simples é o limite anual', () => {
    expect(INSS_CLT_FAIXAS.at(-1).ate).toBe(TETO_INSS)
    expect(SIMPLES_ANEXO_III.at(-1).ate).toBe(SIMPLES.LIMITE_ANUAL)
    expect(SIMPLES_ANEXO_V.at(-1).ate).toBe(SIMPLES.LIMITE_ANUAL)
  })

  it('o Anexo V é mais caro que o III (alíquota efetiva) nas cinco primeiras faixas', () => {
    // Na 6ª faixa (acima de R$ 3,6 mi/ano) a tabela real inverte levemente; não afeta freelancers.
    const efetiva = (f) => f.aliquota - f.deduzir / f.ate
    for (let i = 0; i < 5; i++) {
      expect(efetiva(SIMPLES_ANEXO_V[i])).toBeGreaterThan(efetiva(SIMPLES_ANEXO_III[i]))
    }
  })

  it('a parcela a deduzir do IRPF mantém a tabela contínua entre as faixas', () => {
    // No limite de cada faixa, as duas fórmulas vizinhas precisam dar (quase) o mesmo imposto.
    for (let i = 0; i < IRPF_FAIXAS.length - 1; i++) {
      const limite = IRPF_FAIXAS[i].ate
      const atual = limite * IRPF_FAIXAS[i].aliquota - IRPF_FAIXAS[i].deduzir
      const proxima = limite * IRPF_FAIXAS[i + 1].aliquota - IRPF_FAIXAS[i + 1].deduzir
      expect(Math.abs(atual - proxima)).toBeLessThan(0.05)
    }
  })
})
