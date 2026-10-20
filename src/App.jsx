import { useMemo, useState } from 'react'
import Breakdown from './components/Breakdown.jsx'
import CltCard from './components/CltCard.jsx'
import InputForm from './components/InputForm.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import RegimeComparison from './components/RegimeComparison.jsx'
import MeiAlert from './components/MeiAlert.jsx'
import PriceHero from './components/PriceHero.jsx'
import { calculatePricing } from './domain/pricing.js'
import { ENTRADAS_PADRAO, validateInputs } from './domain/validation.js'
import './styles/layout.css'

const CAMPOS_DO_PROJETO = ['projectHours', 'riskMargin']

export default function App() {
  const [form, setForm] = useState(ENTRADAS_PADRAO)
  const [touched, setTouched] = useState({})

  const validation = useMemo(() => validateInputs(form), [form])

  // Erro nos campos do projeto não deve esconder o preço por hora: eles só afetam o cartão do projeto.
  const coreValid = Object.keys(validation.errors).every((campo) => CAMPOS_DO_PROJETO.includes(campo))

  // O cálculo só roda com dados válidos; useMemo evita refazer a conta a cada renderização.
  const pricing = useMemo(
    () => (coreValid ? calculatePricing(validation.values) : null),
    [coreValid, validation],
  )

  // Só mostramos o erro de um campo depois que a pessoa mexeu nele.
  const visibleErrors = Object.fromEntries(
    Object.entries(validation.errors).filter(([campo]) => touched[campo]),
  )

  const handleChange = (campo, valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setTouched((atual) => ({ ...atual, [campo]: true }))
  }
  const handleBlur = (campo) => setTouched((atual) => (atual[campo] ? atual : { ...atual, [campo]: true }))

  return (
    <div className="page">
      <header className="masthead">
        <h1>Quanto cobrar por hora</h1>
        <p>
          Diga quanto quer ganhar limpo no mês. A conta devolve o preço por hora, já com imposto, férias e o
          tempo que você não consegue cobrar.
        </p>
      </header>

      <div className="layout">
        <InputForm form={form} errors={visibleErrors} onChange={handleChange} onBlur={handleBlur} />
        <section className="results" aria-label="Resultado">
          {pricing ? (
            <>
              <PriceHero result={pricing.selected} workload={pricing.workload} />
              {pricing.selected.meiLimit && (
                <MeiAlert limit={pricing.selected.meiLimit} annualGross={pricing.selected.annualGross} />
              )}
              {pricing.selected.calc && <Breakdown result={pricing.selected} />}
              <CltCard
                clt={pricing.clt}
                grossMonthly={pricing.selected.grossMonthly}
                desiredNet={validation.values.desiredNet}
              />
              {pricing.selected.hourly && (
                <ProjectCard
                  hourly={pricing.selected.hourly}
                  values={validation.values}
                  form={form}
                  errors={visibleErrors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
              <RegimeComparison
                byRegime={pricing.byRegime}
                best={pricing.best}
                selected={validation.values.regime}
                semContador={validation.values.accountantCost === 0}
                onSelect={(regime) => handleChange('regime', regime)}
              />
            </>
          ) : (
            <p className="results__empty">
              Preencha os campos com números válidos para ver o seu preço por hora.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
