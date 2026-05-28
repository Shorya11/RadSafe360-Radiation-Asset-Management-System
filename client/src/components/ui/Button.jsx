import clsx from 'clsx'

const variants = {
  primary:
    'border-transparent bg-accent-amber text-white shadow-sm hover:bg-accent-amber-dim hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-500/30',
  secondary:
    'border-slate-200 bg-white text-industrial-700 shadow-sm hover:border-amber-300/60 hover:bg-amber-50/50 hover:text-industrial-800',
  ghost:
    'border-transparent text-industrial-600 hover:bg-slate-100 hover:text-industrial-800',
}

export function Button({
  children,
  variant = 'primary',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
