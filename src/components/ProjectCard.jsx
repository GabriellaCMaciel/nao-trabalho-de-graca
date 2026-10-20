import { formatBRL } from '../domain/money.js'
import { calculateProjectPrice } from '../domain/project.js'
import Field from './Field.jsx'

/**
 * Preço de projeto fechado: horas estimadas × preço/hora + margem de risco.
 * Os campos ficam aqui, junto do resultado, mas o estado mora no App (um lugar só para tudo).
 *
 * @param {object} props
 * @param {number} props.hourly                       preço/hora do regime escolhido
 * @param {{ projectHours?: number, riskMargin?: number }} props.values  valores já validados
 */
export default function ProjectCard({ hourly, values, form, errors, onChange, onBlur }) {
  const valido = values.projectHours !== undefined && values.riskMargin !== undefined
  const preco = valido
    ? calculateProjectPrice({ hourly, projectHours: values.projectHours, riskMargin: values.riskMargin })
    : null

  return (
    <section className="panel" aria-labelledby="project-title">
      <h2 id="project-title" className="panel__title">
        Preço de um projeto fechado
      </h2>

      <div className="group__row">
        <Field
          id="projectHours"
          label="Horas estimadas"
          suffix="h"
          value={form.projectHours}
          error={errors.projectHours}
          onChange={(valor) => onChange('projectHours', valor)}
          onBlur={() => onBlur('projectHours')}
        />
        <Field
          id="riskMargin"
          label="Margem de risco"
          suffix="%"
          hint="Para escopo que cresce e retrabalho."
          value={form.riskMargin}
          error={errors.riskMargin}
          onChange={(valor) => onChange('riskMargin', valor)}
          onBlur={() => onBlur('riskMargin')}
        />
      </div>

      {preco && (
        <div aria-live="polite">
          <ul className="taxlist">
            <li>
              <span>Horas × preço por hora</span>
              <span>{formatBRL(preco.base)}</span>
            </li>
            <li>
              <span>Margem de risco</span>
              <span>{formatBRL(preco.riskAmount)}</span>
            </li>
          </ul>
          <p className="project__total">
            Cobre pelo projeto <strong className="panel__highlight">{formatBRL(preco.total)}</strong>
          </p>
        </div>
      )}
    </section>
  )
}
