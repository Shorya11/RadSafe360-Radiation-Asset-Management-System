import { BarChart3, LineChart, PieChart } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { CHART_PLACEHOLDERS } from '../../data/dashboardData'

const chartIcons = [LineChart, BarChart3, PieChart]

export function ChartPlaceholders() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {CHART_PLACEHOLDERS.map((chart, index) => {
        const Icon = chartIcons[index % chartIcons.length]
        return (
          <Card key={chart.id}>
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
              <Icon className="h-4 w-4 text-accent-amber/70" />
            </CardHeader>
            <CardBody>
              <p className="mb-4 text-xs text-industrial-600">{chart.description}</p>
              <div
                className={`flex ${chart.height} flex-col items-center justify-center rounded-xl border border-dashed border-amber-300/60 bg-slate-50/80`}
              >
                <Icon className="mb-3 h-10 w-10 text-amber-500/20" strokeWidth={1} />
                <p className="text-sm font-medium text-industrial-600">Chart placeholder</p>
                <p className="mt-1 text-xs text-industrial-600">Connect Recharts or your API</p>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
