# Não Trabalho de Graça

Calculadora de preço por hora para freelancers brasileiros.

Você diz quanto quer ganhar **limpo** no mês. A calculadora devolve quanto cobrar por hora, por dia e por projeto, já com imposto, férias, custos e o tempo que você não consegue faturar.

Funciona para três formas de trabalhar no Brasil (regras de **2026**):

| Regime | O que entra na conta |
| --- | --- |
| **MEI** | DAS fixo (5% do salário mínimo + ISS) e o limite de R$ 81 mil por ano, com aviso a partir de 80% |
| **Autônomo** | INSS (20% ou 11% do mínimo) e imposto de renda mensal com o redutor de 2026 |
| **Simples Nacional (ME)** | DAS pelo Anexo III ou V conforme o **Fator R**, mais INSS e IR sobre o pró-labore |

Também mostra:

- a comparação lado a lado dos três regimes, para o mesmo líquido desejado;
- o **salário CLT equivalente**, com 13º, férias com 1/3 e FGTS;
- o preço de um **projeto fechado**, com margem de risco;
- para onde vai cada real do faturamento (imposto, custos e o que sobra para você).

> É uma estimativa para planejamento. Não substitui um contador.

## Como rodar

Precisa do Node 22 (ou 20.19 ou mais novo).

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm test         # roda os testes
npm run lint     # confere o estilo do código
npm run build    # gera a versão de produção em dist/
```

## Como a conta funciona

O problema é um círculo: o imposto depende do quanto você fatura, e o quanto você precisa faturar depende do imposto. Em vez de inverter as tabelas, o `solver` testa faturamentos de R$ 50 em R$ 50 até o líquido bater o alvo e refina dentro desse degrau. Assim funciona até quando o imposto "dá um salto" (como na troca do Anexo V para o III pelo Fator R).

```
formulário (texto) → validação → horas cobráveis ─┐
                                                   ├→ preço por hora e por dia
                     solver ← cálculo do regime ←──┘
                       └→ faturamento mensal necessário
```

## Estrutura

```
src/
  domain/                  regras de negócio, sem nada de React (fácil de testar e de estudar)
    tax2026.js             TODAS as tabelas e constantes do ano
    money.js               arredondamento, leitura de "1.234,56" e formatação em reais
    validation.js          transforma o texto digitado em números seguros, com limites
    workload.js            horas cobráveis por ano
    taxes/inss.js          INSS de CLT, autônomo e pró-labore
    taxes/irpf.js          tabela do imposto de renda e redutor de 2026
    regimes/               mei.js, autonomo.js, simples.js e o aviso de limite do MEI
    solver.js              descobre o faturamento que entrega o líquido desejado
    pricing.js             junta tudo e calcula os três regimes
    clt.js                 salário CLT equivalente
    project.js             preço de projeto com margem de risco
  components/              telas em React (formulário, resultado, comparação, avisos)
  styles/                  tema Midnight, Pearl e Ocean em CSS puro (cores em tokens.css)
```

## Atualizando para um novo ano

Só o arquivo `src/domain/tax2026.js` precisa mudar: salário mínimo, teto do INSS, faixas do IRPF e do Simples. Depois rode `npm test`: os testes que usam valores conferidos (exemplos da Receita, por exemplo) avisam se algo deixou de bater. Se for criar `tax2027.js`, troque também os `import`.

## Segurança

- **Nada sai do navegador.** Não há servidor, requisição de rede nem armazenamento: o que você digita só existe na tela.
- **Entradas validadas.** O formulário guarda texto; `validation.js` converte com uma lista branca de caracteres, limites de valor e de tamanho. Nada digitado chega ao cálculo sem passar por ali.
- **Sem HTML dinâmico.** Nenhum `innerHTML`, `dangerouslySetInnerHTML`, `eval` ou similar. O React escapa tudo que é exibido.
- **CSP no build de produção.** Só scripts, estilos e fontes da própria origem; `connect-src 'none'` bloqueia qualquer chamada de rede. As fontes vêm empacotadas com o app.
- **Dependências.** `npm audit` roda no CI; o Dependabot abre PRs de atualização.

## Acessibilidade

Rótulos ligados aos campos, erros ligados por `aria-describedby`, resultado anunciado por leitores de tela, foco visível, respeito a `prefers-reduced-motion`, nenhuma informação só por cor e sem violações no axe-core nos cenários testados.

## Para estudar junto

Uma ordem sugerida, do mais simples ao mais completo:

1. `domain/money.js` e `domain/workload.js`: funções pequenas e puras.
2. `domain/taxes/irpf.js`: tabela progressiva e o redutor, com os exemplos da Receita nos testes.
3. `domain/regimes/mei.js`, depois `autonomo.js` e por fim `simples.js` (Fator R).
4. `domain/solver.js`: o único algoritmo "esperto" do projeto.
5. `domain/pricing.js`, `clt.js` e `project.js`.
6. `App.jsx` e os componentes: estado, `useMemo`, formulários controlados e acessibilidade.
