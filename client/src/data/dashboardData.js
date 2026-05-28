import {
  Gauge,
  Activity,
  Trash2,
  CalendarDays,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'

export const KPI_STATS = [
  {
    id: 'total-gauges',
    title: 'Total Gauges',
    value: '1,248',
    change: '+32 this month',
    changeType: 'up',
    icon: Gauge,
  },
  {
    id: 'active-gauges',
    title: 'Active Gauges',
    value: '1,089',
    change: '87.3% of fleet',
    changeType: 'neutral',
    icon: Activity,
  },
  {
    id: 'disposed-gauges',
    title: 'Disposed Gauges',
    value: '159',
    change: '12 pending review',
    changeType: 'neutral',
    icon: Trash2,
  },
  {
    id: 'total-meetings',
    title: 'Total Meetings',
    value: '86',
    change: '+8 this week',
    changeType: 'up',
    icon: CalendarDays,
  },
  {
    id: 'attendance',
    title: 'Attendance Percentage',
    value: '94.6%',
    change: '+2.1% vs last period',
    changeType: 'up',
    icon: UserCheck,
  },
  {
    id: 'high-risk',
    title: 'High Risk Gauges',
    value: '23',
    change: 'Requires immediate action',
    changeType: 'down',
    icon: AlertTriangle,
  },
]

export const CHART_PLACEHOLDERS = [
  {
    id: 'gauge-trends',
    title: 'Gauge Calibration Trends',
    description: 'Monthly calibration pass/fail rates across all zones',
    height: 'h-56',
  },
  {
    id: 'attendance-overview',
    title: 'Attendance Overview',
    description: 'Daily check-in rates by shift and department',
    height: 'h-56',
  },
  {
    id: 'risk-distribution',
    title: 'Risk Distribution',
    description: 'Gauge risk levels segmented by facility zone',
    height: 'h-56',
  },
]

export const RECENT_MEETINGS = [
  {
    id: 1,
    title: 'Safety Briefing — Zone A',
    date: 'May 26, 2026',
    time: '09:00 AM',
    attendees: 24,
    status: 'completed',
  },
  {
    id: 2,
    title: 'Calibration Review Board',
    date: 'May 25, 2026',
    time: '02:30 PM',
    attendees: 12,
    status: 'completed',
  },
  {
    id: 3,
    title: 'Quarterly Compliance Sync',
    date: 'May 27, 2026',
    time: '11:00 AM',
    attendees: 18,
    status: 'scheduled',
  },
  {
    id: 4,
    title: 'High-Risk Gauge Escalation',
    date: 'May 27, 2026',
    time: '03:00 PM',
    attendees: 8,
    status: 'urgent',
  },
]

export const RECENT_ACTIVITY = [
  {
    id: 1,
    user: 'Sarah Chen',
    action: 'calibrated gauge',
    target: 'PG-2041-A',
    timestamp: '5 minutes ago',
    type: 'success',
  },
  {
    id: 2,
    user: 'Marcus Webb',
    action: 'flagged high-risk status on',
    target: 'TG-1187-C',
    timestamp: '18 minutes ago',
    type: 'warning',
  },
  {
    id: 3,
    user: 'System',
    action: 'auto-disposed expired gauge',
    target: 'FG-0092-X',
    timestamp: '42 minutes ago',
    type: 'muted',
  },
  {
    id: 4,
    user: 'Elena Ruiz',
    action: 'recorded attendance for',
    target: 'Shift B — Assembly',
    timestamp: '1 hour ago',
    type: 'success',
  },
  {
    id: 5,
    user: 'David Park',
    action: 'scheduled meeting',
    target: 'Risk Review — Zone C',
    timestamp: '2 hours ago',
    type: 'default',
  },
]
