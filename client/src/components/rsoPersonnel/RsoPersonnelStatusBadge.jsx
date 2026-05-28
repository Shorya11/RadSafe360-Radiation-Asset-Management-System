import { Badge } from '../ui/Badge'
import { isExpiringSoon } from '../../utils/rsoPersonnelUtils'

const STATUS_VARIANT = {
  Valid: 'success',
  Expired: 'danger',
}

export function RsoPersonnelStatusBadge({ status, validTill }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={STATUS_VARIANT[status] ?? 'muted'}>{status}</Badge>
      {status === 'Valid' && isExpiringSoon(validTill) && (
        <Badge variant="warning">Expiring Soon</Badge>
      )}
    </div>
  )
}
