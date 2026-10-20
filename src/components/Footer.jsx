import { ANO_BASE } from '../domain/tax2026.js'

/**
 * Aviso de estimativa e as premissas da conta. Quem usa a calculadora precisa saber
 * o que ela simplifica para não tomar uma decisão grande em cima de um número aproximado.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Estimativa para planejamento, com as regras de {ANO_BASE}. Não substitui um contador: confirme os valores
        antes de fechar contrato ou abrir empresa.
      </p>

      <details className="details">
        <summary>O que essa conta assume</summary>
        <ul className="footer__list">
          <li>O faturamento é o mesmo todo mês. No Simples Nacional, a receita dos últimos 12 meses é esse valor vezes 12.</li>
          <li>
            MEI: usa o DAS de prestação de serviços. Confirme se a sua atividade (CNAE) pode ser MEI antes de contar com
            esse regime.
          </li>
          <li>
            Autônomo: os custos fixos entram como despesa dedutível (livro-caixa), sem dependentes nem outras deduções.
          </li>
          <li>
            Simples Nacional: atividade intelectual sujeita ao Fator R, sem funcionários. O sócio retira pró-labore e o
            resto sai como distribuição de lucros, isenta nesses valores.
          </li>
          <li>
            Ficam de fora: ISS municipal fora do Simples, reforma tributária, retenções feitas pelo cliente e outras
            particularidades do seu caso.
          </li>
          <li>Tudo é calculado no seu navegador. Nada do que você digita é enviado ou guardado.</li>
        </ul>
      </details>
    </footer>
  )
}
