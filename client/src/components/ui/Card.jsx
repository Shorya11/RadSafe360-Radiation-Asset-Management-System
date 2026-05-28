import clsx from 'clsx'

export function Card({ children, className, hover = true, glass = true, ...props }) {
  return (
    <div
      className={clsx(
        glass ? 'glass-card' : 'enterprise-surface rounded-2xl',
        hover && glass && 'glass-card-hover',
        hover &&
          !glass &&
          'transition-all duration-200 hover:border-amber-300/40 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between border-b border-slate-200/80 px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3
      className={clsx(
        'text-sm font-semibold uppercase tracking-wider text-industrial-700',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function CardBody({ children, className }) {
  return <div className={clsx('p-5', className)}>{children}</div>
}
