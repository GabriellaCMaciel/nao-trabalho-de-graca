/**
 * Tabelas e constantes tributárias de 2026.
 *
 * ⚠️ Este é o ÚNICO arquivo que precisa ser revisado todo mês de janeiro (salário mínimo,
 * teto do INSS, faixas do IRPF, Simples). O resto do código só lê estes valores.
 *
 * Fontes consultadas em 20/10/2026:
 * - Salário mínimo, MEI e INSS: Decreto 12.797/2025, Sebrae e tabela INSS 2026 (Contabilizei).
 * - IRPF e redutor até R$ 7.350: orientação da Receita Federal para 2026 (publicada pelo COAD).
 * - Simples Nacional (Anexos III e V, Fator R): LC 123/2006 e LC 155/2016 (tabelas em Trivium Contábil).
 */

export const ANO_BASE = 2026
export const SALARIO_MINIMO = 1621
export const TETO_INSS = 8475.55

/** MEI: o DAS é fixo (5% do salário mínimo de INSS + ISS de R$ 5 para serviços). */
export const MEI = {
  LIMITE_ANUAL: 81_000,
  INSS_PERCENTUAL: 0.05,
  ISS_SERVICOS: 5,
  /** Passou de 80% do limite: já vale um aviso. */
  PERCENTUAL_ALERTA: 0.8,
  /** Até 20% acima do limite o desenquadramento vale só a partir do ano seguinte; acima disso, é retroativo. */
  TOLERANCIA_EXCESSO: 0.2,
}

/** INSS de empregado (CLT): alíquotas progressivas, cada uma só sobre a sua faixa. */
export const INSS_CLT_FAIXAS = [
  { ate: 1621, aliquota: 0.075 },
  { ate: 2902.84, aliquota: 0.09 },
  { ate: 4354.27, aliquota: 0.12 },
  { ate: TETO_INSS, aliquota: 0.14 },
]

/** INSS de contribuinte individual (autônomo e pró-labore de sócio). */
export const INSS_INDIVIDUAL = {
  PLANO_NORMAL: 0.2, // sobre o valor recebido, entre o mínimo e o teto
  PLANO_SIMPLIFICADO: 0.11, // sobre o salário mínimo (sem aposentadoria por tempo de contribuição)
  PRO_LABORE: 0.11, // sócio do Simples contribui 11% sobre o pró-labore
}

/** IRPF mensal: tabela progressiva com parcela a deduzir. */
export const IRPF_FAIXAS = [
  { ate: 2428.8, aliquota: 0, deduzir: 0 },
  { ate: 2826.65, aliquota: 0.075, deduzir: 182.16 },
  { ate: 3751.05, aliquota: 0.15, deduzir: 394.16 },
  { ate: 4664.68, aliquota: 0.225, deduzir: 675.49 },
  { ate: Infinity, aliquota: 0.275, deduzir: 908.73 },
]

/** Redutor de 2026: zera o imposto até R$ 5.000 e diminui gradualmente até R$ 7.350. */
export const IRPF_REDUTOR = {
  ISENCAO_ATE: 5000,
  REDUCAO_MAXIMA: 312.89,
  TETO_REDUTOR: 7350,
  CONSTANTE: 978.62,
  COEFICIENTE: 0.133145,
}

/** Simples Nacional: teto anual e regra do Fator R (folha ÷ receita ≥ 28% → Anexo III). */
export const SIMPLES = {
  LIMITE_ANUAL: 4_800_000,
  FATOR_R_MINIMO: 0.28,
}

/** Faixas de receita bruta dos últimos 12 meses (RBT12), com alíquota nominal e parcela a deduzir. */
export const SIMPLES_ANEXO_III = [
  { ate: 180_000, aliquota: 0.06, deduzir: 0 },
  { ate: 360_000, aliquota: 0.112, deduzir: 9_360 },
  { ate: 720_000, aliquota: 0.135, deduzir: 17_640 },
  { ate: 1_800_000, aliquota: 0.16, deduzir: 35_640 },
  { ate: 3_600_000, aliquota: 0.21, deduzir: 125_640 },
  { ate: 4_800_000, aliquota: 0.33, deduzir: 648_000 },
]

export const SIMPLES_ANEXO_V = [
  { ate: 180_000, aliquota: 0.155, deduzir: 0 },
  { ate: 360_000, aliquota: 0.18, deduzir: 4_500 },
  { ate: 720_000, aliquota: 0.195, deduzir: 9_900 },
  { ate: 1_800_000, aliquota: 0.205, deduzir: 17_100 },
  { ate: 3_600_000, aliquota: 0.23, deduzir: 62_100 },
  { ate: 4_800_000, aliquota: 0.305, deduzir: 540_000 },
]
