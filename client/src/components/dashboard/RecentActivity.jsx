import { Activity } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { RECENT_ACTIVITY } from '../../data/dashboardData'
import clsx from 'clsx'

const dotColors = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  muted: 'bg-slate-500',
  default: 'bg-amber-500',
}

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <Activity className="h-4 w-4 text-accent-amber" />
      </CardHeader>
      <CardBody>
        <ul className="relative space-y-0">
          {RECENT_ACTIVITY.map((item, index) => (
            <li
              key={item.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index < RECENT_ACTIVITY.length - 1 && (
                <span
                  className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-gradient-to-b from-amber-500/30 to-transparent"
                  aria-hidden
                />
              )}
              <span
                className={clsx(
                  'relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white',
                  dotColors[item.type],
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{item.user}</span>{' '}
                  {item.action}{' '}
                  <span className="font-mono text-accent-amber/90">{item.target}</span>
                </p>
                <p className="mt-1 text-xs text-industrial-600">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}
