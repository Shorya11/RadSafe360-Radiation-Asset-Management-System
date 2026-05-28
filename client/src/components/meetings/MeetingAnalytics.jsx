import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { StatCard } from '../ui/StatCard'
import {
  CalendarDays,
  Percent,
  Building2,
  UserX,
  TrendingUp,
} from 'lucide-react'
import { useMeetings } from '../../context/MeetingContext'

const chartTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
  color: '#334155',
  fontSize: '13px',
}

export function MeetingAnalytics() {
  const { analytics } = useMeetings()

  return (
    <section className="space-y-6">
      <h2 className="section-heading">Meeting Analytics</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Meetings"
          value={String(analytics.totalMeetings)}
          icon={CalendarDays}
        />
        <StatCard
          title="Average Attendance"
          value={`${analytics.avgAttendance}%`}
          change="Across recorded meetings"
          changeType="neutral"
          icon={Percent}
        />
        <StatCard
          title="Most Active Department"
          value={analytics.mostActiveDept}
          subtitle="Highest participation rate"
          icon={Building2}
        />
        <StatCard
          title="Top Absentee"
          value={analytics.frequentAbsentees[0]?.name ?? '—'}
          change={
            analytics.frequentAbsentees[0]
              ? `${analytics.frequentAbsentees[0].count} absences`
              : 'No data'
          }
          changeType="down"
          icon={UserX}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-amber" />
          </CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Attendance %"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={{ fill: '#D97706', r: 4 }}
                  activeDot={{ r: 6, fill: '#B45309' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Participation</CardTitle>
          </CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentParticipation.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="department"
                  width={100}
                  tick={{ fill: '#475569', fontSize: 10 }}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="rate" name="Participation %" fill="#334155" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Attendance Comparison</CardTitle>
        </CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ color: '#475569', fontSize: 12 }} />
              <Bar dataKey="present" name="Present" fill="#D97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#C62828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {analytics.frequentAbsentees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Frequent Absentees</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {analytics.frequentAbsentees.map((p) => (
                <li
                  key={p.name}
                  className="enterprise-surface flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-900">{p.name}</span>
                  <span className="font-mono text-sm font-semibold text-accent-red">
                    {p.count} absent
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </section>
  )
}
