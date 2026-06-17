import { KpiGrid } from '../components/dashboard/KpiGrid'
import { DashboardCharts } from '../components/dashboard/DashboardCharts'
import { RsoCertifiedPersonnelCard } from '../components/dashboard/RsoCertifiedPersonnelCard'

export function Dashboard() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10 lg:gap-12">
      <section aria-label="Key performance indicators" className="space-y-5">
        <h2 className="section-heading">Overview</h2>
        <KpiGrid />
      </section>

      <section aria-label="Analytics charts" className="min-h-0 flex-1 space-y-5">
        <h2 className="section-heading">Analytics</h2>
        <DashboardCharts />
      </section>
    </div>
  )
}
