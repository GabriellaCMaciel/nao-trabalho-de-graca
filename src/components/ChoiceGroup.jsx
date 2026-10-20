/**
 * Grupo de opções (radio) com título e descrição por opção.
 * Usa <input type="radio"> de verdade: teclado (setas) e leitores de tela funcionam de graça.
 */
export default function ChoiceGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="choices">
      <legend className="choices__legend">{legend}</legend>
      {options.map((opcao) => (
        <label key={opcao.value} className="choice">
          <input
            type="radio"
            name={name}
            value={opcao.value}
            checked={value === opcao.value}
            onChange={() => onChange(opcao.value)}
          />
          <span className="choice__title">{opcao.label}</span>
          <span className="choice__desc">{opcao.description}</span>
        </label>
      ))}
    </fieldset>
  )
}
