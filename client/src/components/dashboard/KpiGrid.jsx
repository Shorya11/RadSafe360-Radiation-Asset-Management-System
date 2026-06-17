import { StatCard } from '../ui/StatCard'
import { useGauges } from '../../context/GaugeContext'
import { useSurveyMeters } from '../../context/SurveyMeterContext'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'
import { useMeetings } from '../../context/MeetingContext'
import { buildDashboardKpiStats } from '../../utils/dashboardUtils'
import { useMemo } from 'react'

export function KpiGrid() {
  const { gauges, loading: gaugesLoading } = useGauges()
  const { surveyMeters, loading: metersLoading } = useSurveyMeters()
  const { personnel, loading: personnelLoading } = useRsoPersonnel()
  const { meetings, analytics, loading: meetingsLoading } = useMeetings()

  const loading = gaugesLoading || metersLoading || personnelLoading || meetingsLoading

  const stats = useMemo(
    () =>
      buildDashboardKpiStats({
        gauges,
        surveyMeters,
        personnel,
        meetings,
        analytics,
        loading,
      }),
    [gauges, surveyMeters, personnel, meetings, analytics, loading],
  )

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {stats.map((stat) => (
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
