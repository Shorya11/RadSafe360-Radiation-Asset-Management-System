import { Gauge, Activity, PauseCircle, Trash2 } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { useGauges } from '../../context/GaugeContext'

export function GaugeKpiCards() {
  const { kpis } = useGauges()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Gauges" value={String(kpis.total)} icon={Gauge} />
      <StatCard
        title="Active Gauges"
        value={String(kpis.active)}
        change={`${kpis.total ? Math.round((kpis.active / kpis.total) * 100) : 0}% of fleet`}
        changeType="up"
        icon={Activity}
      />
      <StatCard
        title="Inactive Gauges"
        value={String(kpis.inactive)}
        changeType="neutral"
        icon={PauseCircle}
      />
      <StatCard
        title="Disposed Gauges"
        value={String(kpis.disposed)}
        changeType="down"
        icon={Trash2}
      />
    </div>
  )
}
