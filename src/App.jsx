import { useMemo, useState } from 'react'
import InputForm from './components/InputForm.jsx'
import { ENTRADAS_PADRAO, validateInputs } from './domain/validation.js'
import './styles/layout.css'

export default function App() {
  const [form, setForm] = useState(ENTRADAS_PADRAO)
  const [touched, setTouched] = useState({})

  const validation = useMemo(() => validateInputs(form), [form])

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
          <p>{validation.isValid ? 'Dados válidos. O resultado aparece aqui.' : 'Corrija os campos destacados.'}</p>
        </section>
      </div>
    </div>
  )
}
