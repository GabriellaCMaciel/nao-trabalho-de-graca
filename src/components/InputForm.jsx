import ChoiceGroup from './ChoiceGroup.jsx'
import Field from './Field.jsx'
import '../styles/form.css'

const REGIMES = [
  { value: 'mei', label: 'MEI', description: 'Valor fixo por mês. Limite de R$ 81 mil por ano.' },
  {
    value: 'autonomo',
    label: 'Autônomo',
    description: 'Sem CNPJ. Paga INSS e imposto de renda sobre o que recebe.',
  },
  {
    value: 'simples',
    label: 'Simples Nacional',
    description: 'Microempresa. O imposto cai quando o Fator R chega a 28%.',
  },
]

const PLANOS_INSS = [
  {
    value: 'normal',
    label: '20% do que você recebe',
    description: 'Conta para a aposentadoria por tempo de contribuição.',
  },
  {
    value: 'simplificado',
    label: '11% do salário mínimo',
    description: 'Mais barato, mas não conta para a aposentadoria por tempo de contribuição.',
  },
]

const MODOS_PRO_LABORE = [
  {
    value: 'fatorR',
    label: 'Ajustar para 28% do faturamento',
    description: 'Você retira mais pró-labore e o DAS usa o Anexo III, bem mais barato.',
  },
  {
    value: 'minimo',
    label: 'Um salário mínimo',
    description: 'Retirada menor, mas o DAS costuma cair no Anexo V.',
  },
]

/**
 * @param {object} props
 * @param {Record<string,string>} props.form    texto de cada campo
 * @param {Record<string,string>} props.errors  mensagens (só dos campos já tocados)
 * @param {(campo: string, valor: string) => void} props.onChange
 * @param {(campo: string) => void} props.onBlur
 */
export default function InputForm({ form, errors, onChange, onBlur }) {
  // Atalho para não repetir as mesmas props em cada campo.
  const campo = (name) => ({
    id: name,
    value: form[name],
    error: errors[name],
    onChange: (valor) => onChange(name, valor),
    onBlur: () => onBlur(name),
  })

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Seus dados">
      <fieldset className="group">
        <legend className="group__title">Quanto você quer ganhar</legend>
        <Field
          {...campo('desiredNet')}
          label="Líquido por mês"
          prefix="R$"
          hint="O que sobra no seu bolso depois de impostos e custos."
        />
        <Field
          {...campo('fixedCosts')}
          label="Custos fixos por mês"
          prefix="R$"
          hint="Internet, ferramentas, coworking. Tudo que você paga para trabalhar."
        />
        <Field
          {...campo('accountantCost')}
          label="Contador, se for Simples Nacional"
          prefix="R$"
          hint="Empresa no Simples precisa de contador. Pergunte o valor mensal e coloque aqui. MEI e autônomo não usam."
        />
      </fieldset>

      <fieldset className="group">
        <legend className="group__title">Seu tempo</legend>
        <div className="group__row">
          <Field {...campo('workDaysPerWeek')} label="Dias por semana" suffix="dias" />
          <Field {...campo('hoursPerDay')} label="Horas por dia" suffix="h" />
        </div>
        <Field
          {...campo('billablePercent')}
          label="Tempo que vira trabalho cobrável"
          suffix="%"
          hint="Proposta, reunião, estudo e cliente que some não entram nessa conta."
        />
        <div className="group__row group__row--3">
          <Field {...campo('vacationDays')} label="Férias" suffix="dias úteis" />
          <Field {...campo('holidays')} label="Feriados" suffix="dias úteis" />
          <Field {...campo('sickDays')} label="Imprevistos" suffix="dias" />
        </div>
      </fieldset>

      <fieldset className="group">
        <legend className="group__title">Como você trabalha</legend>
        <ChoiceGroup
          name="regime"
          legend="Regime"
          options={REGIMES}
          value={form.regime}
          onChange={(valor) => onChange('regime', valor)}
        />
        {form.regime === 'autonomo' && (
          <ChoiceGroup
            name="inssPlan"
            legend="INSS do autônomo"
            options={PLANOS_INSS}
            value={form.inssPlan}
            onChange={(valor) => onChange('inssPlan', valor)}
          />
        )}
        {form.regime === 'simples' && (
          <ChoiceGroup
            name="proLaboreMode"
            legend="Pró-labore"
            options={MODOS_PRO_LABORE}
            value={form.proLaboreMode}
            onChange={(valor) => onChange('proLaboreMode', valor)}
          />
        )}
      </fieldset>
    </form>
  )
}
