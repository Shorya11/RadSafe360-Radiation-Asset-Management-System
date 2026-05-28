import { ShieldCheck, ShieldX, Users, AlertTriangle } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'

export function RsoPersonnelKpiCards() {
  const { kpis } = useRsoPersonnel()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Personnel" value={String(kpis.total)} icon={Users} />
      <StatCard title="Valid Certificates" value={String(kpis.valid)} changeType="up" icon={ShieldCheck} />
      <StatCard title="Expired Certificates" value={String(kpis.expired)} changeType="down" icon={ShieldX} />
      <StatCard
        title="Expiring Soon"
        value={String(kpis.expiringSoon)}
        change="Within 30 days"
        changeType="neutral"
        icon={AlertTriangle}
      />
    </div>
  )
}
