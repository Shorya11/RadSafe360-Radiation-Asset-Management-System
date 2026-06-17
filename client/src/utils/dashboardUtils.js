import {
  Gauge,
  Activity,
  Trash2,
  CalendarDays,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'
import { computeGaugeKpis } from './gaugeUtils'
import { computeSurveyMeterKpis } from './surveyMeterUtils'
import { computeRsoPersonnelKpis } from './rsoPersonnelUtils'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** @param {import('../data/gauges.js').Gauge[]} gauges */
export function countHighRiskGauges(gauges) {
  const today = startOfDay(new Date())
  return gauges.filter((g) => {
    if (g.status === 'Inactive') return true
    if (!g.calibrationDueDate) return false
    const due = startOfDay(new Date(g.calibrationDueDate))
    if (Number.isNaN(due.getTime())) return false
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / 86400000)
    return daysUntil <= 30
  }).length
}

function formatCount(n) {
  return Number(n).toLocaleString()
}

function formatPercent(n) {
  return `${n}%`
}

/**
 * @param {{
 *   gauges: unknown[]
 *   surveyMeters: unknown[]
 *   personnel: unknown[]
 *   meetings: { status?: string; attendanceRate?: number }[]
 *   analytics: { avgAttendance?: number }
 *   loading?: boolean
 * }} input
 */
export function buildDashboardKpiStats({
  gauges,
  surveyMeters,
  personnel,
  meetings,
  analytics,
  loading = false,
}) {
  if (loading) {
    return KPI_DEFINITIONS.map((def) => ({
      ...def,
      value: '—',
      change: 'Loading…',
      changeType: 'neutral',
    }))
  }

  const gaugeKpis = computeGaugeKpis(gauges)
  const surveyKpis = computeSurveyMeterKpis(surveyMeters)
  const personnelKpis = computeRsoPersonnelKpis(personnel)
  const highRisk = countHighRiskGauges(gauges)
  const totalMeetings = meetings.length
  const scheduledMeetings = meetings.filter((m) => m.status === 'scheduled').length
  const avgAttendance = analytics?.avgAttendance ?? 0

  const activePct =
    gaugeKpis.total > 0
      ? Math.round((gaugeKpis.active / gaugeKpis.total) * 1000) / 10
      : 0

  return [
    {
      id: 'total-gauges',
      title: 'Total Gauges',
      value: formatCount(gaugeKpis.total),
      change: `${formatCount(surveyKpis.total)} survey meters tracked`,
      changeType: 'neutral',
      icon: Gauge,
    },
    {
      id: 'active-gauges',
      title: 'Active Gauges',
      value: formatCount(gaugeKpis.active),
      change: `${formatPercent(activePct)} of fleet`,
      changeType: 'up',
      icon: Activity,
    },
    {
      id: 'disposed-gauges',
      title: 'Disposed Gauges',
      value: formatCount(gaugeKpis.disposed),
      change: `${formatCount(gaugeKpis.inactive)} inactive · ${formatCount(surveyKpis.notWorking)} meters down`,
      changeType: 'neutral',
      icon: Trash2,
    },
    {
      id: 'total-meetings',
      title: 'Total Meetings',
      value: formatCount(totalMeetings),
      change:
        scheduledMeetings > 0
          ? `${formatCount(scheduledMeetings)} scheduled`
          : `${formatCount(personnelKpis.total)} RSO personnel`,
      changeType: 'up',
      icon: CalendarDays,
    },
    {
      id: 'attendance',
      title: 'Attendance Percentage',
      value: formatPercent(avgAttendance),
      change: `${formatCount(personnelKpis.valid)} valid RSO certifications`,
      changeType: avgAttendance >= 90 ? 'up' : avgAttendance >= 75 ? 'neutral' : 'down',
      icon: UserCheck,
    },
    {
      id: 'high-risk',
      title: 'High Risk Gauges',
      value: formatCount(highRisk),
      change:
        personnelKpis.expired > 0
          ? `${formatCount(personnelKpis.expired)} expired RSO · requires action`
          : 'Inactive or calibration due within 30 days',
      changeType: highRisk > 0 ? 'down' : 'neutral',
      icon: AlertTriangle,
      highlight: true,
    },
  ]
}

export const KPI_DEFINITIONS = [
  { id: 'total-gauges', title: 'Total Gauges', icon: Gauge },
  { id: 'active-gauges', title: 'Active Gauges', icon: Activity },
  { id: 'disposed-gauges', title: 'Disposed Gauges', icon: Trash2 },
  { id: 'total-meetings', title: 'Total Meetings', icon: CalendarDays },
  { id: 'attendance', title: 'Attendance Percentage', icon: UserCheck },
  { id: 'high-risk', title: 'High Risk Gauges', icon: AlertTriangle },
]
