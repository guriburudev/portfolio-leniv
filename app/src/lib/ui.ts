// Clases de Tailwind reutilizables, basadas en los tokens del proyecto.

const btnBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40'

export const btnPrimary = `${btnBase} bg-accent px-5 py-2.5 text-sm text-text-on-accent hover:bg-accent-hover`
export const btnSecondary = `${btnBase} border border-default bg-surface px-5 py-2.5 text-sm text-text-primary hover:border-accent`
export const btnGhost = `${btnBase} px-3.5 py-2 text-xs text-text-secondary hover:bg-accent-surface hover:text-accent`
export const btnLarge = 'w-full rounded-lg px-7 py-3.5'

export const inputBase =
  'w-full rounded-md border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-surface'
export const inputNormal = 'border-default hover:border-strong focus:border-accent'
export const inputError = 'border-red-500'

export const card = 'rounded-xl border border-default bg-surface'