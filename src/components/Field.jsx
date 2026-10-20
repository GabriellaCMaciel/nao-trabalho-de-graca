/**
 * Campo de texto com rótulo, dica e mensagem de erro ligados por aria-describedby,
 * para leitores de tela lerem tudo junto com o campo.
 * Usamos type="text" com inputMode="decimal": aceita vírgula e abre o teclado numérico no celular.
 */
export default function Field({ id, label, hint, error, prefix, suffix, value, onChange, onBlur }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className={`field__control${error ? ' is-invalid' : ''}`}>
        {prefix && (
          <span className="field__affix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          maxLength={12} // limite de tamanho: ninguém precisa de mais que isso aqui
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
        />
        {suffix && (
          <span className="field__affix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
