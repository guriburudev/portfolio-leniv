import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { inputBase, inputError, inputNormal } from '../lib/ui'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function Field({ label, error, hint, className = '', ...inputProps }: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-text-primary">
        {label}
      </label>
      <input
        id={id}
        className={`${inputBase} ${error ? inputError : inputNormal}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-text-tertiary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}