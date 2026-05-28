import {
  LayoutDashboard,
  Gauge,
  Radio,
  Users,
  CalendarDays,
  ClipboardCheck,
  FileBarChart,
  BookOpen,
  ShieldCheck,
} from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Gauge Management', path: '/gauges', icon: Gauge },
  { label: 'Survey Meter Management', path: '/survey-meters', icon: Radio },
  { label: 'RSO Personnel', path: '/rso-personnel', icon: Users },
  { label: 'Meeting Management', path: '/meetings', icon: CalendarDays },
  { label: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { label: 'Reports & Documents', path: '/reports', icon: FileBarChart },
  { label: 'Training & Manuals', path: '/training-manuals', icon: BookOpen },
  { label: 'ELORA Information', path: '/elora-information', icon: ShieldCheck },
]

export const ROUTE_TITLES = Object.fromEntries(
  NAV_ITEMS.map(({ path, label }) => [path, label]),
)
