import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { useGauges } from '../../context/GaugeContext'
import { useSurveyMeters } from '../../context/SurveyMeterContext'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'
import { useMeetings } from '../../context/MeetingContext'
import { RsoCertifiedPersonnelCard } from './RsoCertifiedPersonnelCard'

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

// High-fidelity industrial theme matching professional steel/industrial design tokens
const CONFIG_THEME = {
  slate950: '#0f172a',   // Primary dark text/accents
  slate700: '#334155',   // Subdued headings
  slate500: '#64748b',   // Muted labels/ticks
  slate100: '#f1f5f9',   // Borders and grids
  bluePrimary: '#1e40af',// Corporate Industrial Blue
  blueLight: '#3b82f6',  // Accent Blue
}

// Semantic, high-contrast industrial compliance colors
const CHART_COLORS = {
  // Operational States (Safe / Functional)
  'Working': '#10b981',      // Vibrant Emerald
  'Valid': '#10b981',        // Vibrant Emerald
  'Active': '#2563eb',       // Safety Blue

  // Warning States
  'Expiring Soon': '#f59e0b', // Industrial Amber
  'Inactive': '#d97706',      // Dark Amber

  // Critical / Action Required States
  'Not Working': '#ef4444',   // Critical Red
  'Expired': '#ef4444',       // Critical Red
  'Disposed': '#64748b',      // Neutral Slate
}

const FALLBACK_COLORS = [
  CONFIG_THEME.bluePrimary,
  CONFIG_THEME.blueLight,
  '#0284c7',
  '#0d9488',
  '#4f46e5'
]

export function DashboardCharts() {
  const { plantDistribution, statusDistribution } = useGauges()
  const { surveyMeters } = useSurveyMeters()
  const { personnel } = useRsoPersonnel()
  const { meetings } = useMeetings()

  const surveyData = [
    {
      name: 'Working',
      value: surveyMeters.filter((m) => m.functionalStatus === 'Working').length,
    },
    {
      name: 'Not Working',
      value: surveyMeters.filter((m) => m.functionalStatus === 'Not Working').length,
    },
  ]

  const rsoData = [
    {
      name: 'Valid',
      value: personnel.filter((p) => p.status === 'Valid').length,
    },
    {
      name: 'Expired',
      value: personnel.filter((p) => p.status === 'Expired').length,
    },
  ]

  const upcomingMeetings = [...meetings]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Context-aware color selector with safe fallback (TypeScript types removed)
  const getContextColor = (name, index) => {
    return CHART_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  }

  // Premium custom glassmorphism style object for Recharts Tooltips
  const customTooltipStyle = {
    background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    color: CONFIG_THEME.slate700,
    padding: '8px 12px'
  }

  return (
    <div className="space-y-8 industrial-grid-bg p-2 rounded-2xl">

      {/* SECTION 1 — NUCLEONIC GAUGE METRICS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          Nucleonic Gauge Analytics
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Gauge Lifecycle Distribution */}
          <Card glass={true} hover={true}>
            <CardHeader>
              <CardTitle>Gauge Lifecycle Distribution</CardTitle>
            </CardHeader>
            <CardBody className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ bottom: 10 }}>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={90}
                    paddingAngle={4}
                    animationDuration={600}
                  >
                    {statusDistribution?.map((entry, i) => (
                      <Cell key={i} fill={getContextColor(entry.name, i)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', pt: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Plant-wise Gauge Distribution */}
          <Card glass={true} hover={true}>
            <CardHeader>
              <CardTitle>Plant-wise Gauge Distribution</CardTitle>
            </CardHeader>
            <CardBody className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plantDistribution} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                  <XAxis
                    dataKey="plant"
                    tick={{ fill: CONFIG_THEME.slate500, fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: CONFIG_THEME.slate500, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip cursor={{ fill: 'rgba(51, 65, 85, 0.03)' }} contentStyle={customTooltipStyle} />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

        </div>
      </div>

      {/* SECTION 2 — RADIATION DEVICE & STAFF COMPLIANCE */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          Compliance & Device Readiness
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Survey Meter Status */}
          <Card glass={true} hover={true}>
            <CardHeader>
              <CardTitle>Survey Meter Status</CardTitle>
            </CardHeader>
            <CardBody className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ bottom: 10 }}>
                  <Pie
                    data={surveyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={90}
                    paddingAngle={5}
                    animationDuration={600}
                  >
                    {surveyData.map((entry, i) => (
                      <Cell key={i} fill={getContextColor(entry.name, i)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* RSO Certification Status */}
          <Card glass={true} hover={true}>
            <CardHeader>
              <CardTitle>RSO Certification Status</CardTitle>
            </CardHeader>
            <CardBody className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ bottom: 10 }}>
                  <Pie
                    data={rsoData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={90}
                    paddingAngle={5}
                    animationDuration={600}
                  >
                    {rsoData.map((entry, i) => (
                      <Cell key={i} fill={getContextColor(entry.name, i)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

        </div>
      </div>

      {/* SECTION 3 — COMPLIANCE MEETING TIMELINE */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          Upcoming Compliance Timeline
        </h2>
        <Card glass={true} hover={false} className="overflow-hidden shadow-sm border border-slate-200/60">
          <CardHeader className="bg-slate-50/70 border-b border-slate-200/60 flex flex-row items-center justify-between py-4 px-6">
            <CardTitle className="text-slate-800 font-bold text-base">Safety Review Schedule</CardTitle>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Next 5 Core Briefings
            </span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse m-0">
                <thead>
                  <tr className="bg-slate-100/50 text-slate-500 font-medium text-xs uppercase tracking-wider border-b border-slate-200/40">
                    <th className="px-6 py-3.5 font-semibold">Meeting Agenda Title</th>
                    <th className="px-6 py-3.5 font-semibold">Scheduled Date</th>
                    <th className="px-6 py-3.5 font-semibold">Location / Venue</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-sans">
                  {upcomingMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium tracking-wide">
                        No upcoming regulatory safety meetings are currently logged in the compliance engine.
                      </td>
                    </tr>
                  ) : (
                    upcomingMeetings.map((meeting) => {
                      const isPending = meeting.status?.toLowerCase() === 'scheduled' || meeting.status?.toLowerCase() === 'pending';
                      return (
                        <tr key={meeting.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 font-semibold text-slate-900">{meeting.title}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">
                            {new Date(meeting.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200/40">
                              {meeting.venue}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold capitalize tracking-wide ${isPending
                                ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                                : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              }`}>
                              {meeting.status?.toLowerCase() || 'Scheduled'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          Certified RSO Personnel
        </h2>

        <Card glass={true} hover={false}>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {personnel
                .filter((p) => p.status === 'Valid')
                .map((person) => (
                  <div
                    key={person.employeeId}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {person.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      Employee ID: {person.employeeId}
                    </p>

                    <p className="text-sm text-slate-600">
                      Department: {person.department}
                    </p>

                    <p className="text-sm text-slate-600">
                      Phone: {person.phone}
                    </p>

                    <p className="text-sm text-slate-600">
                      Email: {person.email}
                    </p>

                    <p className="mt-3 text-xs font-medium text-amber-700">
                      Valid Till: {person.validTill}
                    </p>
                  </div>
                ))}

            </div>
          </CardBody>
        </Card>
      </div>

    </div>


  )
}