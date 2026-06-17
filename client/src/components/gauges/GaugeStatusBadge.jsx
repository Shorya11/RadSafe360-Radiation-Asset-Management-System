import { Badge } from '../ui/Badge'

const STATUS_VARIANT = {
  Active: 'success',
  Inactive: 'muted',
  Disposed: 'danger',
  Maintenance: 'warning',
}

export function GaugeStatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? 'muted'}>{status}</Badge>
  )
}
