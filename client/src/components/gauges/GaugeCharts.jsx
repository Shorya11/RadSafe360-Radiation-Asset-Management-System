import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { useGauges } from '../../context/GaugeContext'

const CHART_COLORS = [
  '#D97706',
  '#334155',
  '#475569',
  '#B45309',
  '#C62828',
]
const STATUS_COLORS = {
  Valid: '#16a34a',
  'Expiring Soon': '#D97706',
  Expired: '#C62828',
}

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
  color: '#334155',
  fontSize: '13px',
}

export function GaugeCharts() {
  const { plantDistribution, statusDistribution } = useGauges()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Plant-wise Gauge Distribution</CardTitle>
        </CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={plantDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="plant"
                tick={{ fill: '#475569', fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Gauges" radius={[4, 4, 0, 0]}>
                {plantDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gauge Lifecycle Distribution</CardTitle>
        </CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {statusDistribution.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] ?? '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#475569', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  )
}
