import { BarChart3, LineChart, PieChart } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'

const CHARTS = [
  {
    id: 'gauge-trends',
    title: 'Gauge Calibration Trends',
    description: 'Monthly calibration pass/fail rates across all zones',
    icon: LineChart,
  },
  {
    id: 'attendance-overview',
    title: 'Attendance Overview',
    description: 'Meeting attendance rates by department and period',
    icon: BarChart3,
  },
  {
    id: 'risk-distribution',
    title: 'Risk Distribution',
    description: 'Gauge risk levels segmented by facility zone',
    icon: PieChart,
  },
]

export function ChartPlaceholders() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      {CHARTS.map((chart) => {
        const Icon = chart.icon
        return (
          <Card key={chart.id} className="flex min-h-[320px] flex-col lg:min-h-[360px]">
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
              <Icon className="h-4 w-4 text-accent-amber/70" />
            </CardHeader>
            <CardBody className="flex flex-1 flex-col">
              <p className="mb-4 text-xs leading-relaxed text-industrial-600">
                {chart.description}
              </p>
              <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-amber-300/60 bg-slate-50/80 lg:min-h-[260px]">
                <Icon className="mb-3 h-12 w-12 text-amber-500/25" strokeWidth={1} />
                <p className="text-sm font-medium text-industrial-600">Analytics visualization</p>
                <p className="mt-1 text-xs text-industrial-500">Chart data area</p>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
