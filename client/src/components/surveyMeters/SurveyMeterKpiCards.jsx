import { Wrench, CircleOff, ClipboardList } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { useSurveyMeters } from '../../context/SurveyMeterContext'

export function SurveyMeterKpiCards() {
  const { kpis } = useSurveyMeters()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard title="Total Survey Meters" value={String(kpis.total)} icon={ClipboardList} />
      <StatCard
        title="Working Meters"
        value={String(kpis.working)}
        change={`${kpis.total ? Math.round((kpis.working / kpis.total) * 100) : 0}% of inventory`}
        changeType="up"
        icon={Wrench}
      />
      <StatCard
        title="Not Working"
        value={String(kpis.notWorking)}
        changeType="down"
        icon={CircleOff}
      />
    </div>
  )
}
