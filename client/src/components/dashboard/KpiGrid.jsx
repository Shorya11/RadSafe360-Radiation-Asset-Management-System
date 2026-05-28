import { StatCard } from '../ui/StatCard'
import { KPI_STATS } from '../../data/dashboardData'

export function KpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {KPI_STATS.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          highlight={stat.id === 'high-risk'}
        />
      ))}
    </div>
  )
}
