import { Download } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { ChartPlaceholders } from '../components/dashboard/ChartPlaceholders'
import { RecentMeetings } from '../components/dashboard/RecentMeetings'
import { RecentActivity } from '../components/dashboard/RecentActivity'

export function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Dashboard"
        description="Monitor gauges, meetings, attendance, and risk metrics across your facility."
        action={
          <Button type="button">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        }
      />

      <section aria-label="Key performance indicators">
        <KpiGrid />
      </section>

      <section aria-label="Analytics charts" className="space-y-4">
        <h2 className="section-heading">Analytics</h2>
        <ChartPlaceholders />
      </section>

      <section
        aria-label="Meetings and activity"
        className="grid gap-6 xl:grid-cols-2"
      >
        <RecentMeetings />
        <RecentActivity />
      </section>
    </div>
  )
}
