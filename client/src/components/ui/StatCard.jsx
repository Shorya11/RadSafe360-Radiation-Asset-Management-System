import clsx from 'clsx'
import { Card, CardBody } from './Card'

const changeStyles = {
  up: 'text-emerald-700',
  down: 'text-accent-red',
  neutral: 'text-industrial-600',
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  highlight = false,
}) {
  return (
    <Card className={clsx('group overflow-hidden', highlight && 'ring-1 ring-red-200')}>
      <CardBody className="relative">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100/60 blur-2xl transition-all duration-300 group-hover:bg-amber-200/50" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-industrial-600">
              {title}
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-gray-900 tabular-nums sm:text-3xl">
              {value}
            </p>
            {change && (
              <p className={clsx('mt-2 text-sm font-medium', changeStyles[changeType])}>
                {change}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={clsx(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-200',
                highlight
                  ? 'border-red-200 bg-red-50 text-accent-red group-hover:border-red-300'
                  : 'border-amber-200 bg-amber-50 text-accent-amber group-hover:border-amber-300 group-hover:bg-amber-100/80',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
