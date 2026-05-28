import { Badge } from '../ui/Badge'

const STATUS_VARIANT = {
  Working: 'success',
  'Not Working': 'danger',
}

export function SurveyMeterStatusBadge({ status }) {
  return <Badge variant={STATUS_VARIANT[status] ?? 'muted'}>{status}</Badge>
}
